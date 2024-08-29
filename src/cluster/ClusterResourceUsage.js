import React from "react";
import {
  Progress,
  ProgressVariant,
  ProgressMeasureLocation,
  Skeleton,
} from "@patternfly/react-core";

const ClusterResourceUsage = ({ data, resourceType }) => {
  if (!data) {
    return <Skeleton height="20px" width="100%" />;
  }

  return (
    <Progress
      value={data.value * 100}
      title={`${resourceType} Usage`}
      measureLocation={ProgressMeasureLocation.outside}
      variant={data > 0.8 ? ProgressVariant.danger : ProgressVariant.success}
    />
  );
};

export default ClusterResourceUsage;
