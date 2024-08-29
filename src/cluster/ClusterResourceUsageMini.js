import React from "react";
import {
  Progress,
  ProgressVariant,
  ProgressMeasureLocation,
  Tooltip,
  Text,
  TextContent,
} from "@patternfly/react-core";

const ClusterResourceUsageMini = ({ metrics, showDetails = false }) => {
  const usage_percent = metrics.find(
    (metric) => metric.type === "usage_percent"
  ).value;
  const usage = metrics.find((metric) => metric.type === "usage").value;
  const capacity = metrics.find((metric) => metric.type === "capacity").value;
  const variant =
    usage_percent > 80 ? ProgressVariant.danger : ProgressVariant.success;

  const tooltipContent = `
    Usage: ${usage} 
    Capacity: ${capacity}
    Percentage: ${usage_percent}
  `;

  return (
    <div>
      <Tooltip content={tooltipContent}>
        <Progress
          value={usage_percent}
          measureLocation={
            showDetails
              ? ProgressMeasureLocation.outside
              : ProgressMeasureLocation.none
          }
          variant={variant}
          label={showDetails ? `${usage_percent.toFixed(2)}%` : ""}
        />
      </Tooltip>
      {showDetails && (
        <TextContent>
          <Text>
            {tooltipContent
              .trim()
              .split("\n")
              .map((line) => (
                <div key={line}>{line}</div>
              ))}
          </Text>
        </TextContent>
      )}
    </div>
  );
};

export default ClusterResourceUsageMini;
