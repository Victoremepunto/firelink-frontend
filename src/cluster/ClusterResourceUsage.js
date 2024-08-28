import React, { useEffect } from 'react';
import {
  Progress,
  ProgressVariant,
  ProgressMeasureLocation,
  Card,
  CardBody,
  Skeleton,
} from '@patternfly/react-core';

const ClusterResourceUsage = ({ data, resourceType }) => {

  useEffect(() => {
    console.log(`ClusterResourceUsage: ${resourceType} data: ${data}`);
  }, [data]);

  if (!data ) {
    return <Skeleton height="20px" width="100%" />;
  }

  return (

        <Progress
          value={data.value * 100}
          title={`${resourceType} Usage`}
          measureLocation={ProgressMeasureLocation.outside}
          variant={data > 0.80 ? ProgressVariant.danger : ProgressVariant.success}
        />

  );
};

export default ClusterResourceUsage;
