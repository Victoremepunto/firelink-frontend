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
  const [showReleaseModal, setShowReleaseModal] = useState(false);

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
  };

  const releaseNamespace =  async (namespace) => {
    setShowReleaseModal(true);
  
    try {
      const response = await fetch("/api/firelink/namespace/release", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ namespace: namespace }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const resp = await response.json();
  
      if (resp.completed) {
        dispatch(clearNamespaces());
        dispatch(loadNamespaces());
      } else {
        throw new Error(`Error releasing namespace ${namespace}: ${resp.message}`);
      }
    } catch (error) {
      console.error("Error releasing namespace:", error);
      // Handle specific error cases
      if (error.message.includes("HTTP error")) {
        // Handle HTTP errors
        alert(`HTTP error occurred while releasing namespace ${namespace}`);
      } else if (error.message.includes("Error releasing namespace")) {
        // Handle errors from the server response
        alert(error.message);
      } else {
        // Handle generic errors
        alert(`An error occurred while releasing namespace ${namespace}`);
      }
    } finally {
      dispatch(clearNamespaces());
      dispatch(loadNamespaces());
      setShowReleaseModal(false);
    }
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

  if (showReleaseModal) {
    return (
      <Page>
        <PageSection>
          <Loading message="Releasing namespace..." />
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
              onRelease={releaseNamespace}
            />
          )}
        </PageSection>
      </Page>
    </React.Fragment>
  );
}

export default NamespaceList;
