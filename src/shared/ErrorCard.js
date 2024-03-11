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
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

function ErrorCard({ error, onRetry }) {
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "24rem", textAlign: "center" }}>
        <Card isLarge>
          <CardTitle>Error</CardTitle>
          <CardBody>
            <EmptyState>
              <EmptyStateIcon icon={ExclamationCircleIcon} color="var(--pf-global--danger-color--100)" />
              <Title headingLevel="h2" size="lg">
                Something went wrong
              </Title>
              <EmptyStateBody>{error}</EmptyStateBody>
              <Button variant="primary" onClick={onRetry}>
                Retry
              </Button>
            </EmptyState>
          </CardBody>
          <CardFooter>Please try again later or contact DevProd if the problem persists.</CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default ErrorCard;