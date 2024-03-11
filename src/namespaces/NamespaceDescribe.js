import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Page,
  Split,
  PageSection,
  PageSectionVariants,
  InputGroup,
  TextInput,
  Title,
  TitleSizes,
  InputGroupItem,
  SplitItem,
  EmptyState,
  EmptyStateVariant,
  EmptyStateHeader,
  EmptyStateBody,
  EmptyStateIcon,
  Stack,
  StackItem,
  Grid,
  GridItem,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";
import {
  loadNamespaceTopPods,
  getNamespaceTopPods,
  getResourcesForNamespace,
} from "../store/ListSlice";
import { useDispatch, useSelector } from "react-redux";
import NamespaceDescriptionCard from "./NamespaceDescribeCard";
import PodsTableCard from "./TopPodsCard";
import NamespaceResourcesCard from "./NamespaceResourcesCard";
import ErrorCard from "../shared/ErrorCard";

function NamespaceDescribe() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { namespaceParam } = useParams();
  const topPods = useSelector(getNamespaceTopPods);
  const [description, setDescription] = useState({});
  const [loading, setLoading] = useState(false);
  const [namespace, setNamespace] = useState("");
  const [namespaceInput, setNamespaceInput] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (namespaceParam) {
      setNamespace(namespaceParam);
      setNamespaceInput(namespaceParam);
    }
  }, [namespaceParam]);

  const buttonClickHandler = () => {
    setError(null);
    navigate(`/namespace/describe/${namespaceInput}`);
  }

  const NoNamespaceLoaded = () => (
    <EmptyState variant={EmptyStateVariant.lg}>
      <EmptyStateHeader
        titleText="No Namespace Specified"
        headingLevel="h4"
        icon={<EmptyStateIcon icon={CubesIcon} />}
      />
      <EmptyStateBody>
        Enter a namespace name in the input box above to get started.
      </EmptyStateBody>
    </EmptyState>
  );

  const ToolBar = () => {
    return (
      <PageSection variant={PageSectionVariants.light}>
        <Split>
          <SplitItem>
            <Title headingLevel="h1" size={TitleSizes["3xl"]}>
              Describe Namespace
            </Title>
          </SplitItem>
          <SplitItem isFilled />
          <SplitItem>
            <InputGroup>
              <InputGroupItem isFill>
                <TextInput
                  id="text-input"
                  value={namespaceInput}
                  onChange={(_evt, value) => setNamespaceInput(value)}
                  default="test"
                />
              </InputGroupItem>
              <InputGroupItem>
                <Button onClick={buttonClickHandler}>Describe</Button>
              </InputGroupItem>
            </InputGroup>
          </SplitItem>
        </Split>
      </PageSection>
    );
  };

  if (namespace === "") {
    return (
      <Page>
        <ToolBar />
        <PageSection>
          <NoNamespaceLoaded />
        </PageSection>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <ToolBar />
        <PageSection isCenterAligned={true}>
          <ErrorCard error={error.message} onRetry={buttonClickHandler} />
        </PageSection>
      </Page>
    );
  }

  return (
    <Page>
      <ToolBar />
      <PageSection isCenterAligned={true}>
        <Stack hasGutter>
          <StackItem>
            <NamespaceResourcesCard namespace={namespace} />
          </StackItem>
          <StackItem>
            <Grid hasGutter>
              <GridItem span={6}>
                <NamespaceDescriptionCard
                  namespace={namespace}
                  onError={setError}
                />
              </GridItem>
              <GridItem span={6}>
                <PodsTableCard 
                  namespace={namespace}
                  onError={setError}
                />
              </GridItem>
            </Grid>
          </StackItem>
        </Stack>
      </PageSection>
    </Page>
  );
}

export default NamespaceDescribe;
