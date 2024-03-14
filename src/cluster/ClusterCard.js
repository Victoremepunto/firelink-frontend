import React from "react";
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

const ClusterCard = () => {
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
            <Button variant="primary">Refresh</Button>
          </SplitItem>
        </Split>
      </PageSection>
      <PageSection hasOverflowScroll>
        <TopNodesCard />
      </PageSection>
    </Page>
  );
};

export default ClusterCard;
