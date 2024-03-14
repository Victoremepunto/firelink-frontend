import React, { useState } from "react";
import {
  Title,
  TitleSizes,
  Switch,
  Button,
  Form,
  Card,
  Split,
  Grid,
  GridItem,
  CardBody,
  CodeBlock,
  CodeBlockCode,
  FormGroup,
  TextInput,
  Page,
  PageSection,
  PageSectionVariants,
  SplitItem,
  CardTitle,
} from "@patternfly/react-core";
import Loading from "../shared/Loading";
import {
  PoolSelectList,
  DurationSelectList,
  DefaultPool,
  DefaultDuration,
} from "../shared/CustomSelects";
import DescribeLink from "../shared/DescribeLink";
import { useSelector, useDispatch } from "react-redux";
import { getRequester } from "../store/AppSlice";
import { 
  loadNamespaces, 
  clearNamespaces,
  reserveNamespace 
} from "../store/ListSlice";
import FadeInFadeOut from "../shared/FadeInFadeOut";

export default function NamespaceReserve() {
  const [response, setResponse] = useState({
    message: "",
    completed: false,
    namespace: "",
  });
  const [displayResponse, setDisplayResponse] = useState(false);

  const [duration, setDuration] = useState(DefaultDuration);
  const [pool, setPool] = useState(DefaultPool);

  const [force, setForce] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [loadingMessage, setLoadingMessage] = useState(
    "Reserving namespace..."
  );
  const requester = useSelector(getRequester);

  const dispatch = useDispatch();

  function requestReservation() {
    setLoadingMessage("Reserving namespace...");
    setIsLoading(true);

    dispatch(reserveNamespace({ requester, duration, pool, force }))
      .unwrap()
      .then((resp) => {
        setResponse(resp);
        dispatch(loadNamespaces());
        setDisplayResponse(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Reservation error:", error);
        setIsLoading(false);
        setResponse({
          message:
            "An error occurred while reserving the namespace. Please try again later.",
          completed: false,
          namespace: "",
        });
        setDisplayResponse(true);
      });
  }

  const handleForce = (_checked, _event) => {
    setForce(!force);
  };

  const form = (
    <Form>
      <FormGroup label="Requester" fieldId="simple-form-requester-01">
        <TextInput
          isRequired
          type="text"
          id="simple-form-requester-01"
          name="simple-form-requester-01"
          value={requester}
          isDisabled
        />
      </FormGroup>
      <DurationSelectList duration={duration} setDuration={setDuration} />
      <PoolSelectList pool={pool} setPool={setPool} />
      <FormGroup
        label="Allow Multiple Reservations"
        fieldId="simple-form-force-01"
      >
        <Switch
          label="Yes"
          labelOff="No"
          isChecked={force}
          onChange={handleForce}
        />
      </FormGroup>
    </Form>
  );

  function renderResponse() {
    if (displayResponse) {
      return (
        <React.Fragment>
          <p>{response.message}</p>
          <DescribeLink namespace={response.namespace} />
        </React.Fragment>
      );
    }
  }

  function renderResponseCard() {
    if (displayResponse) {
      return (
        <React.Fragment>
          <GridItem span={6}>
            <Card isFullHeight={true}>
              <CardTitle>Response</CardTitle>
              <CardBody>
                <CodeBlock>
                  <CodeBlockCode id="code-content">
                    {renderResponse()}
                  </CodeBlockCode>
                </CodeBlock>
              </CardBody>
            </Card>
          </GridItem>
        </React.Fragment>
      );
    }
  }

  function renderUI() {
    if (isLoading) {
      return <Loading message={loadingMessage} />;
    } else {
      return (
        <React.Fragment>
          <Grid hasGutter={true}>
            <GridItem span={3}></GridItem>
            <GridItem span={6}>
              <Card isFullHeight={true}>
                <CardTitle>Request</CardTitle>
                <CardBody>{form}</CardBody>
              </Card>
            </GridItem>
            <GridItem span={3}></GridItem>
            <GridItem span={3}></GridItem>
            {renderResponseCard()}
          </Grid>
        </React.Fragment>
      );
    }
  }

  return (
    <React.Fragment>
      <Page>
        <PageSection variant={PageSectionVariants.light}>
          <Split>
            <SplitItem>
              <Title headingLevel="h1" size={TitleSizes["3xl"]}>
                Reserve Namespace
              </Title>
            </SplitItem>
            <SplitItem isFilled />
            <SplitItem>
              <Button
                onClick={() => {
                  requestReservation();
                }}
                variant="primary"
              >
                Reserve
              </Button>
            </SplitItem>
          </Split>
        </PageSection>
        <PageSection isCenterAligned={true}>
          <FadeInFadeOut>{renderUI()}</FadeInFadeOut>
        </PageSection>
      </Page>
    </React.Fragment>
  );
}
