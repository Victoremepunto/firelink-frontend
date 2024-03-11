import React, { useState, useEffect } from "react";
import {
  SplitItem,
  Title,
  TitleSizes,
  Button,
  Page,
  PageSection,
  PageSectionVariants,
  Split,
  Switch,
} from "@patternfly/react-core";
import Loading from "../shared/Loading";
import NamespaceListTable from "./NamespaceListTable";
import { useSelector, useDispatch } from "react-redux";
import {
  getIsNamespacesEmpty,
  loadNamespaces,
  clearNamespaces,
  getNamespaces,
  loadNamespaceResources,
  getLoading,
  getError,
} from "../store/ListSlice";
import FadeInFadeOut from "../shared/FadeInFadeOut";
import ErrorCard from "../shared/ErrorCard";

function NamespaceList() {
  const dispatch = useDispatch();
  const [showJustMyReservations, setShowJustMyReservations] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const isNamespacesEmpty = useSelector(getIsNamespacesEmpty);
  const namespaces = useSelector(getNamespaces);
  const loading = useSelector(getLoading);
  const error = useSelector(getError);

  useEffect(() => {
    if (isNamespacesEmpty) {
      dispatch(loadNamespaces());
      dispatch(loadNamespaceResources());
    }
  }, [dispatch, isNamespacesEmpty]);

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        dispatch(loadNamespaces());
        dispatch(loadNamespaceResources());
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, dispatch]);

  if (isNamespacesEmpty && showJustMyReservations) {
    setShowJustMyReservations(false);
  }

  const refreshData = () => {
    dispatch(clearNamespaces());
    dispatch(loadNamespaces());
    dispatch(loadNamespaceResources());
  };

  if (loading) {
    return (
      <Page>
        <PageSection>
          <Loading message="Fetching namespaces and reservations..." />
        </PageSection>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <PageSection>
          <ErrorCard error={error} onRetry={refreshData} />
        </PageSection>
      </Page>
    )
  }

  return (
    <React.Fragment>
      <Page>
        <PageSection variant={PageSectionVariants.light}>
          <Split hasGutter>
            <SplitItem>
              <Title headingLevel="h1" size={TitleSizes["3xl"]}>
                Namespaces
              </Title>
            </SplitItem>
            <SplitItem isFilled></SplitItem>
            <SplitItem>
              <Switch
                id="namespace-auto-refresh"
                label="Auto Refresh"
                labelOff="Auto Refresh"
                isChecked={autoRefresh}
                isReversed
                onChange={() => {
                  setAutoRefresh(!autoRefresh);
                }}
              />
            </SplitItem>
            <SplitItem>
              <Switch
                id="namespace-list-my-reservations"
                label="My Reservations"
                labelOff="My Reservations"
                isChecked={showJustMyReservations}
                isReversed
                onChange={() => {
                  setShowJustMyReservations(!showJustMyReservations);
                }}
              />
            </SplitItem>
            <SplitItem>
              <Button variant="primary" onClick={refreshData}>
                Refresh
              </Button>
            </SplitItem>
          </Split>
        </PageSection>
        <PageSection>
          {isNamespacesEmpty ? (
            <FadeInFadeOut>
              <Loading message="Fetching namespaces and reservations..." />;
            </FadeInFadeOut>
          ) : (
            <NamespaceListTable
              namespaces={namespaces}
              showJustMyReservations={showJustMyReservations}
            />
          )}
        </PageSection>
      </Page>
    </React.Fragment>
  );
}

export default NamespaceList;
