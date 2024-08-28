import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../shared/Loading";
import ErrorCard from "../shared/ErrorCard";
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
  Switch,
} from "@patternfly/react-core";
import { useSelector, useDispatch } from "react-redux";
import {
  getApps,
  getIsAppsEmpty,
  getIsNamespacesEmpty,
  loadApps,
  loadNamespaces,
  getMyReservations,
} from "../store/ListSlice";
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
} from "../store/AppDeploySlice";
import AppMenuCard from "./AppMenuCard";
import AppDeoployOptions from "./AppDeployOptionsCard";
import ResourceSelector from "./ResourceSelector";
import AppDeployNamespaceSelector from "./AppDeployNamespaceSelector";
import SetParameters from "./SetParameters";
import ImageTagOverrides from "./ImageTagOverrides";
import AppDeployReview from "./AppDeployReview";
import { clearAll } from "../store/ParamSelectorSlice";
import { getRequester } from "../store/AppSlice";

export default function AppDeploy() {
  const { appParam } = useParams();
  const dispatch = useDispatch();
  const isNamespacesEmpty = useSelector(getIsNamespacesEmpty);
  const isAppsEmpty = useSelector(getIsAppsEmpty);
  const deployAppListEmpty = useSelector(getAppDeployListIsEmpty);
  const requester = useSelector(getRequester);
  const reservations = useSelector(getMyReservations(requester));
  const getNoRemoveResources = useSelector(getAppDeployNoRemoveResources);
  const getRemoveDependencies = useSelector(getAppDeployRemoveDependencies);
  const apps = useSelector(getApps);

  const setNoRemoveResourcesAction = (value) => {
    dispatch(setNoRemoveResources(value));
  };
  const setRemoveDependenciesAction = (value) => {
    dispatch(setRemoveDependencies(value));
  };
  const setRequesterAction = (value) => {
    dispatch(setAppDeployRequester(value));
  };

  const [advancedMode, setAdvancedMode] = useState(false);
  const [showNamespaceStep, setShowNamespaceStep] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(clearAll());
    dispatch(clearAppDeployOptions());
    setRequesterAction(requester);
  }, []);

  useEffect(() => {
    if (isAppsEmpty) {
      dispatch(loadApps())
        .unwrap()
        .catch((error) => {
          console.error("Error loading apps:", error);
          setError(error);
        });
    }
  }, [dispatch, isAppsEmpty]);

  useEffect(() => {
    if (isNamespacesEmpty) {
      console.log("Loading namespaces");
      dispatch(loadNamespaces())
        .unwrap()
        .catch((error) => {
          console.error("Error loading namespaces:", error);
          setError(error);
        });
    }
  }, [dispatch, isNamespacesEmpty]);

  useEffect(() => {
    if (reservations.length > 0) {
      setShowNamespaceStep(true);
    }
  }, [reservations]);

  useEffect(() => {
    if (!appParam) {
      return;
    }
    if (isAppsEmpty) {
      return;
    }
    const appObj = apps.find((app) => app.name === appParam);
    if (appObj) {
      dispatch(addOrRemoveApp(appObj));
      dispatch(addOrRemoveAppName(appObj.name));
    }
  }, [appParam, dispatch, isAppsEmpty]);

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
  };

  const handleRetry = () => {
    setError(null);
    if (isAppsEmpty) {
      dispatch(loadApps());
    }
    if (isNamespacesEmpty) {
      dispatch(loadNamespaces());
    }
  };

  if (error !== null) {
    return (
        <Page>
            <PageSection>
                <ErrorCard error={error} onRetry={handleRetry} />
            </PageSection>
        </Page>
    )
  }

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light}>
        <Split>
          <SplitItem>
            <Title headingLevel="h1" size={TitleSizes["3xl"]}>
              Deploy Apps
            </Title>
          </SplitItem>
          <SplitItem isFilled />
        </Split>
      </PageSection>
      <PageSection hasOverflowScroll>
        {isAppsEmpty || isNamespacesEmpty ? (
          <Loading message={loadingMessage()} />
        ) : (
          <Wizard isVisitRequired>
            <WizardStep
              name="Apps"
              id="step-1"
              footer={{
                isNextDisabled: deployAppListEmpty,
                isCancelHidden: true,
              }}
            >
              <AppMenuCard>
                <Switch
                  id="app-deploy-switch"
                  label="Advanced Options"
                  isChecked={advancedMode}
                  onChange={() => setAdvancedMode(!advancedMode)}
                  isReversed
                />
              </AppMenuCard>
            </WizardStep>
            <WizardStep
              name="Namespace"
              id="step-12"
              footer={{ isCancelHidden: true }}
              isHidden={!showNamespaceStep}
            >
              <AppDeployNamespaceSelector />
            </WizardStep>
            <WizardStep
              name="Options"
              id="step-2"
              footer={{ isCancelHidden: true }}
            >
              <AppDeoployOptions />
            </WizardStep>
            <WizardStep
              name="Preserve Resources"
              id="step-3"
              footer={{ isCancelHidden: true }}
              isHidden={!advancedMode}
            >
              <Stack hasGutter>
                <StackItem>
                  <TextContent>
                    <Text component={TextVariants.h1}>
                      Preserve CPU & RAM for Apps or Components
                    </Text>
                  </TextContent>
                </StackItem>
                <StackItem>
                  <TextContent>
                    <Text>
                      Bonfire removes CPU and memory resource requests and
                      limits by default. Select any ClowdApps and
                      ResourceTemplates you may want to preserve requests and
                      limits for. ClowdApps are prepended by "app:".
                    </Text>
                  </TextContent>
                </StackItem>
                <StackItem>
                  <Alert
                    variant="warning"
                    title="Resource preservation is not recommended for most use cases. Use only if you know that your app requires specific resource requests and limits."
                    ouiaId="WarningAlert"
                  />
                </StackItem>
                <StackItem>
                  <ResourceSelector
                    setSelection={setNoRemoveResourcesAction}
                    getSelection={getNoRemoveResources}
                  />
                </StackItem>
              </Stack>
            </WizardStep>
            <WizardStep
              name="Omit Dependencies"
              id="step-6"
              footer={{ isCancelHidden: true }}
              isHidden={!advancedMode}
            >
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
                      Bonfire deploys all dependencies for your ClowdApps and
                      Resource Templates. If you wish to omit dependencies for a
                      ClowdApp or ResourceTemplate, select them here. ClowdApps
                      are prepended by "app:".
                    </Text>
                  </TextContent>
                </StackItem>
                <StackItem>
                  <ResourceSelector
                    setSelection={setRemoveDependenciesAction}
                    getSelection={getRemoveDependencies}
                  />
                </StackItem>
              </Stack>
            </WizardStep>
            <WizardStep
              name="Set Parameters"
              id="step-4"
              footer={{ isCancelHidden: true }}
              isHidden={!advancedMode}
            >
              <SetParameters />
            </WizardStep>
            <WizardStep
              name="Image Tag Overrides"
              id="step-44"
              footer={{ isCancelHidden: true }}
              isHidden={!advancedMode}
            >
              <ImageTagOverrides />
            </WizardStep>
            <WizardStep
              name="Review & Deploy"
              id="step-7"
              footer={{ isCancelHidden: true, isNextDisabled: true }}
            >
              <AppDeployReview />
            </WizardStep>
          </Wizard>
        )}
      </PageSection>
    </Page>
  );
}
