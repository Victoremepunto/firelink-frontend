import React from "react";
import {
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardFooter,
  Bullseye,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

function ErrorCard({ error, onRetry }) {
  return (
    <Bullseye >
        <Card isLarge>
          <CardTitle>Error</CardTitle>
          <CardBody>
            <EmptyState>
              <EmptyStateIcon
                icon={ExclamationCircleIcon}
                color="red"
              />
              <Title headingLevel="h2" size="lg">
                Something went wrong
              </Title>
              <EmptyStateBody>{error}</EmptyStateBody>
              <Button variant="primary" onClick={onRetry}>
                Retry
              </Button>
            </EmptyState>
          </CardBody>
          <CardFooter>
            Please try again later or contact DevProd if the problem persists.
          </CardFooter>
        </Card>
    </Bullseye>
  );
}

export default ErrorCard;
