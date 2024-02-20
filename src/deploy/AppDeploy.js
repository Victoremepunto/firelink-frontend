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
    setRemoveResources,
    setNoRemoveDependencies,
    setRemoveDependencies,
    getAppDeployNoRemoveResources,
    getAppDeployRemoveResources,
    getAppDeployNoRemoveDependencies,
    getAppDeployRemoveDependencies,
} from '../store/AppDeploySlice';
import AppMenuCard from './AppMenuCard';
import AppDeployController from './AppDeployControllerCard';
import AppDeoployOptions from './AppDeployOptionsCard';
import ResourceSelector from './ResourceSelector';

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

    const getNoRemoveResources = useSelector(getAppDeployNoRemoveResources);
    const getRemoveDependencies = useSelector(getAppDeployRemoveDependencies);    
    const apps = useSelector(getApps);

    // Actions
    const setNoRemoveResourcesAction = (value) => { dispatch(setNoRemoveResources(value)) }
    const setRemoveDependenciesAction = (value) => { dispatch(setRemoveDependencies(value)) }

    // State
    const [appsSelected, setAppsSelected] = useState(false);

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
    useEffect(() => {
        if ( !appParam ) {
            return;
        }
        if ( isAppsEmpty ) {
            return;
        }
        const appObj = apps.find(app => app.name === appParam);
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

    const onAppSelectionChange = (appsAreSelected) => {
        setAppsSelected(appsAreSelected);
    }

    const AppDeployGrid = () => {
        if ( isAppsEmpty ) {
            return <Loading message={loadingMessage()}/>
        } 
        return <Wizard isVisitRequired>
            <WizardStep name="Apps" id="step-1" footer={{ isNextDisabled: !appsSelected, isCancelHidden: true }}>
                <AppMenuCard onAppSelectionChange={onAppSelectionChange}  />
            </WizardStep>
            <WizardStep name="Namespace" id="step-12" footer={{ isCancelHidden: true }}>
                <AppDeployController />
            </WizardStep>
            <WizardStep name="Options" id="step-2" footer={{ isCancelHidden: true }}>
                <AppDeoployOptions />
            </WizardStep>
            <WizardStep name="Preserve Resources" id="step-3" footer={{ isCancelHidden: true }}>
                <Stack hasGutter>
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
            <WizardStep name="Review" id="step-7" footer={{ isCancelHidden: true }}>
                <AppDeployController />
            </WizardStep>
            <WizardStep name="Deploy" id="step-8" footer={{ isCancelHidden: true }}>
                <AppDeployController />
            </WizardStep>
        </Wizard>
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
            <AppDeployGrid />
        </PageSection>
    </Page> 
}