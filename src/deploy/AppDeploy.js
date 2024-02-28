import React, { useEffect, useState } from 'react';
import { useParams, } from 'react-router-dom';

import Loading from '../shared/Loading';
import {
	Page,
	PageSectionVariants,
	PageSection,
	Split,
	SplitItem,
	Title,
	TitleSizes,
	Wizard,
    WizardStep,
    TextContent,
    Text,
    Stack,
    StackItem,
    Alert,
    TextVariants,
} from '@patternfly/react-core';
import { useSelector, useDispatch } from 'react-redux';
import {
    getApps,
    getIsAppsEmpty,
    getIsNamespacesEmpty,
    loadApps,
    loadNamespaces,
} from '../store/ListSlice';
import {
    addOrRemoveApp,
    addOrRemoveAppName,
    setNoRemoveResources,
    setRemoveDependencies,
    getAppDeployNoRemoveResources,
    getAppDeployRemoveDependencies,
    clearAppDeployOptions,
    getAppDeployListIsEmpty,
    setAppDeployRequester,
} from '../store/AppDeploySlice';
import AppMenuCard from './AppMenuCard';
import AppDeoployOptions from './AppDeployOptionsCard';
import ResourceSelector from './ResourceSelector';
import AppDeployNamespaceSelector from './AppDeployNamespaceSelector';
import SetParameters from './SetParameters';
import AppDeployReview from './AppDeployReview';
import { clearAll } from '../store/ParamSelectorSlice';
import { getRequester } from '../store/AppSlice';

// AppDeploy is the parent component to the app deploy page
// It ensures redux is hydrated with the app and namespace lists, but that's all it does
// It mantains no state and passes no state to its children
// In its original incarnation this component got really hairy and hard to work with
// so I am trying to keep it and its children as small as possible
// because app deploy is the most complex part of the app
export default function AppDeploy() {

    // Query string
    const { appParam } = useParams()

    // Redux
    const dispatch = useDispatch();

    // Selectors
    const isNamespacesEmpty = useSelector(getIsNamespacesEmpty);
    const isAppsEmpty = useSelector(getIsAppsEmpty);
    const deployAppListEmpty = useSelector(getAppDeployListIsEmpty);
    const requester = useSelector(getRequester);

    const getNoRemoveResources = useSelector(getAppDeployNoRemoveResources);
    const getRemoveDependencies = useSelector(getAppDeployRemoveDependencies);    
    const apps = useSelector(getApps);

    // Actions
    const setNoRemoveResourcesAction = (value) => { dispatch(setNoRemoveResources(value)) }
    const setRemoveDependenciesAction = (value) => { dispatch(setRemoveDependencies(value)) }
    const setRequesterAction = (value) => { dispatch(setAppDeployRequester(value)) }


    useEffect(() => {
        dispatch(clearAll());
        dispatch(clearAppDeployOptions());
        //Need to reset the requester here 
        setRequesterAction(requester)
    }, [])
    
    // Load the app list if the app list is empty
    useEffect(() => {
        if ( isAppsEmpty)  {
            console.log("Loading apps");
            dispatch(loadApps());
        }
    }, [dispatch, isAppsEmpty])

    // Load the namespace list if the namespace list is empty
    useEffect(() => {
        if (isNamespacesEmpty) {
            console.log("Loading namespaces");
            dispatch(loadNamespaces());
        }
    }, [dispatch, isNamespacesEmpty])

    // Add the app to the list of selected apps if the appParam is set
    // appParam is taken from the query string
    useEffect(() => {
        // If the appParam is not set, do nothing
        if ( !appParam ) {
            return;
        }
        // If the app list is empty, do nothing
        // This is because if the app list is empty we wont be able to look 
        // up the app for the app param
        if ( isAppsEmpty ) {
            return;
        }
        // Find the app object that matches the appParam
        const appObj = apps.find(app => app.name === appParam);
        // TODO: We should probably show an error message if the app is not found
        if ( appObj ) {
            dispatch(addOrRemoveApp(appObj));
            dispatch(addOrRemoveAppName(appObj.name));
        }
    }, [appParam, dispatch, isAppsEmpty])

    const loadingMessage = () => {
        if (isAppsEmpty && isNamespacesEmpty) {
            return "Fetching apps and namespaces...";
        }
        if (isAppsEmpty) {
            return "Fetching apps...";
        }
        if (isNamespacesEmpty) {
            return "Fetching namespaces...";
        }

        return "Loading...";
    }

    return <Page>
        <PageSection variant={PageSectionVariants.light}>
            <Split>
                <SplitItem>
                    <Title headingLevel="h1" size={TitleSizes['3xl']}>
                        Deploy Apps
                    </Title>
                </SplitItem>
                <SplitItem isFilled/>
            </Split>
        </PageSection>
        <PageSection hasOverflowScroll>
            {isAppsEmpty ? (
                <Loading message={loadingMessage()}/>
            ) : (
                <Wizard isVisitRequired>
                    <WizardStep name="Apps" id="step-1" footer={{ isNextDisabled: deployAppListEmpty, isCancelHidden: true }}>
                        <AppMenuCard />
                    </WizardStep>
                    <WizardStep name="Namespace" id="step-12" footer={{ isCancelHidden: true }}>
                        <AppDeployNamespaceSelector/>
                    </WizardStep>
                    <WizardStep name="Options" id="step-2" footer={{ isCancelHidden: true }}>
                        <AppDeoployOptions />
                    </WizardStep>
                    <WizardStep name="Preserve Resources" id="step-3" footer={{ isCancelHidden: true }}>
                        <Stack hasGutter>
                            <StackItem>
                                <TextContent>
                                    <Text component={TextVariants.h1}>
                                        Preserve CPU & RAM for Apps or Comononts
                                    </Text>
                                </TextContent>
                            </StackItem>
                            <StackItem>
                                <TextContent>
                                    <Text>
                                        Bonfire removes CPU and memory resource requests and limits by default. Select any ClowdApps and ResourceTemplates you may want to preserve requests and limits for. ClowdApps are prepended by "app:".
                                    </Text>
                                </TextContent>
                            </StackItem>
                            <StackItem>
                                <Alert variant="warning" title="Resource preservation is not recommended for most use cases. Use only if you know that your app requires specific resource requests and limits." ouiaId="WarningAlert" />
                            </StackItem>
                            <StackItem>
                                <ResourceSelector setSelection={setNoRemoveResourcesAction} getSelection={getNoRemoveResources}/>
                            </StackItem>
                        </Stack>
                    </WizardStep>
                    <WizardStep name="Omit Dependencies" id="step-6" footer={{ isCancelHidden: true }}>
                        <Stack hasGutter>
                            <StackItem>
                                <TextContent>
                                    <Text component={TextVariants.h1}>
                                        Select Dependencies to Omit
                                    </Text>
                                </TextContent>
                            </StackItem>
                            <StackItem>
                                <TextContent>
                                    <Text>
                                        Bonfire deploys all dependencies for your ClowdApps and Resource Templates. If you wish to omit dependencies for a ClowdApp or ResourceTemplate, select them here. ClowdApps are prepended by "app:".
                                    </Text>
                                </TextContent>
                            </StackItem>
                            <StackItem>
                                <ResourceSelector setSelection={setRemoveDependenciesAction} getSelection={getRemoveDependencies} />
                            </StackItem>
                        </Stack>
                    </WizardStep>
                    <WizardStep name="Set Parameters" id="step-4" footer={{ isCancelHidden: true }}>
                        <SetParameters />
                    </WizardStep>
                    <WizardStep name="Review & Deploy" id="step-7" footer={{ isCancelHidden: true, isNextDisabled: true }}>
                        <AppDeployReview />
                    </WizardStep>
                </Wizard>
            )}
        </PageSection>
    </Page> 
}