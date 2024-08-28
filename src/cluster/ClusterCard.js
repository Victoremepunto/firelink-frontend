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
  Card,
  CardBody,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import TopNodesCard from "./ClusterTopNodes";
import ErrorCard from "../shared/ErrorCard";
import Loading from "../shared/Loading";
import ClusterResourceUsage from "./ClusterResourceUsage";

const ClusterCard = () => {
  const [topNodes, setTopNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cpuUsage, setCpuUsage] = useState(null);
  const [memoryUsage, setMemoryUsage] = useState(null);

  
  const fetchClusterMemoryUsage = async () => {
    try {
      const response = await fetch("/api/firelink/cluster/memory_usage");
      if (!response.ok) {
        console.log("HTTP error! status: ", response.status);
        throw new Error(
          `Something went wrong loading the cluster memory usage metrics.`
        );
      }
      const data = await response.json();
      setMemoryUsage(data);
    } catch (error) {
      console.error("Error fetching cluster memory usage:", error);
      throw error;
    }
  }

  const fetchClusterCPUUsage = async () => {
    try {
      const response = await fetch("/api/firelink/cluster/cpu_usage");
      if (!response.ok) {
        console.log("HTTP error! status: ", response.status);
        throw new Error(
          `Something went wrong loading the cluster CPU usage metrics.`
        );
      }
      const data = await response.json();
      setCpuUsage(data);
    } catch (error) {
      console.error("Error fetching cluster CPU usage:", error);
      throw error;
    }
  };

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
    fetchClusterCPUUsage();
    fetchClusterMemoryUsage();
  }, []);

  if (error) {
    return <ErrorCard error={error} onRetry={loadTopNodes} />;
  }

  if (isLoading) {
    return (
      <Page>
        <PageSection>
          <Loading message="Loading cluster metrics..." />
        </PageSection>
      </Page>
    );
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
            <Button variant="primary" onClick={loadTopNodes}>
              Refresh
            </Button>
          </SplitItem>
        </Split>
      </PageSection>
      <PageSection hasOverflowScroll>
        <Card>
          <CardBody>
            <Stack hasGutter>
              <StackItem>
                <ClusterResourceUsage data={cpuUsage} resourceType="CPU" />
              </StackItem>
              <StackItem>
                <ClusterResourceUsage data={memoryUsage} resourceType="RAM" />
              </StackItem>
              <StackItem>
                <TopNodesCard topNodes={topNodes} />
              </StackItem>
            </Stack>
          </CardBody>
        </Card>
      </PageSection>
    </Page>
  );
};

export default ClusterCard;
