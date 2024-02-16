import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
} from '../store/AppDeploySlice';
import AppMenuCard from './AppMenuCard';
import AppDeployController from './AppDeployControllerCard';
import AppDeoployOptions from './AppDeployOptionsCard';

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

    const apps = useSelector(getApps);

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

    const AppDeployGrid = () => {
        if ( isAppsEmpty ) {
            return <Loading message={loadingMessage()}/>
        } 
        return <Wizard>
            <WizardStep name="Apps" id="step-1">
                <AppMenuCard />
            </WizardStep>
            <WizardStep name="Options" id="step-2">
                <AppDeoployOptions />
            </WizardStep>
            <WizardStep name="Deploy" id="step-3">
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