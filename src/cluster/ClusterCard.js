import React, { useEffect, useState } from "react";
import {
  Button,
  Page,
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
  Title,
  TitleSizes,
} from "@patternfly/react-core";
import TopNodesCard from "./ClusterTopNodes";
import ErrorCard from "../shared/ErrorCard";

const ClusterCard = () => {
  const [topNodes, setTopNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopNodes = async () => {
    try {
      const response = await fetch("/api/firelink/cluster/top_nodes");
      if (!response.ok) {
        console.log("HTTP error! status: ", response.status);
        throw new Error(
          `Something went wrong loading the cluster resource metrics.`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching top nodes:", error);
      throw error;
    }
  };

  const loadTopNodes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTopNodes();
      setTopNodes(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTopNodes();
  }, []);

  if (error) {
    return <ErrorCard error={error} onRetry={loadTopNodes} />;
  }

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light}>
        <Split>
          <SplitItem>
            <Title headingLevel="h1" size={TitleSizes["3xl"]}>
              Cluster Metrics
            </Title>
          </SplitItem>
          <SplitItem isFilled />
          <SplitItem>
            <Button variant="primary" onClick={loadTopNodes}>Refresh</Button>
          </SplitItem>
        </Split>
      </PageSection>
      <PageSection hasOverflowScroll>
        <TopNodesCard topNodes={topNodes} isLoading={isLoading}/>
      </PageSection>
    </Page>
  );
};

export default ClusterCard;
