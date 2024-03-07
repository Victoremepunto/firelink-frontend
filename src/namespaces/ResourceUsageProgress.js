import React from 'react';
import {
  Progress,
  ProgressVariant,
  ProgressMeasureLocation,
  Tooltip,
  Text,
  TextContent,
  TextVariants,
  Skeleton
} from '@patternfly/react-core';
import { useSelector } from 'react-redux';
import { getNamespaceResources } from '../store/ListSlice';

const ResourceUsageProgress = ({ namespace, resource, showDetails = false }) => {
  const data = useSelector(getNamespaceResources);

  if (!data[namespace] && showDetails) {
    return <Skeleton />;
  }
  if (!data[namespace]) {
    return <div/>;
  }

  const usage = data[namespace].usage[resource];
  const requests = data[namespace].requests[resource];
  const limits = data[namespace].limits[resource];

  let variant = ProgressVariant.success;
  if (usage > requests) {
    variant = usage > limits * 0.8 ? ProgressVariant.danger : ProgressVariant.warning;
  }

  const percentage = (usage / limits) * 100;
  const usagePercentageOfRequests = (usage / requests) * 100;
  const usagePercentageOfLimits = (usage / limits) * 100;

  const formatResourceValue = (value) => {
    if (resource === 'memory') {
      return `${(value / 1024).toFixed(2)} GB`;
    }
    return `${value.toFixed(2)} cores`;
  };

  const tooltipContent = `
    Usage: ${formatResourceValue(usage)} (${usagePercentageOfLimits.toFixed(2)}% of limits, ${usagePercentageOfRequests.toFixed(2)}% of requests)
    Requests: ${formatResourceValue(requests)}
    Limits: ${formatResourceValue(limits)}
  `;

  return (
    <div>
      {showDetails && (
        <TextContent>
          <Text component={TextVariants.h6}>{resource.toUpperCase()}</Text>
        </TextContent>
      )}
      <Tooltip content={tooltipContent}>
        <Progress
          value={percentage}
          measureLocation={showDetails ? ProgressMeasureLocation.outside : ProgressMeasureLocation.none}
          variant={variant}
          label={showDetails ? `${percentage.toFixed(2)}%` : ''}
        />
      </Tooltip>
      {showDetails && (
        <TextContent>
          <Text>{tooltipContent.trim().split('\n').map(line => <div key={line}>{line}</div>)}</Text>
        </TextContent>
      )}
    </div>
  );
};

export default ResourceUsageProgress;
