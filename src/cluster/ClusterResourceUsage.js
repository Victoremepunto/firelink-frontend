import React from 'react';
import {
  Progress,
  ProgressVariant,
  ProgressMeasureLocation,
  Card,
  CardBody,
  Skeleton,
} from '@patternfly/react-core';

const ClusterResourceUsage = ({ data, resourceType }) => {
  if (!data || data.length === 0) {
    return <Skeleton height="20px" width="100%" />;
  }

  const percentageKey = resourceType === 'CPU' ? 'CPU%' : 'MEMORY%';

  const totalPercentage = data.reduce((acc, node) => {
    const percentageValue = parseFloat(node[percentageKey].replace('%', ''));
    return acc + percentageValue;
  }, 0);

  const averagePercentage = totalPercentage / data.length;

  return (

        <Progress
          value={averagePercentage}
          title={`${resourceType} Usage`}
          measureLocation={ProgressMeasureLocation.outside}
          variant={averagePercentage > 80 ? ProgressVariant.danger : ProgressVariant.success}
        />

  );
};

export default ClusterResourceUsage;
