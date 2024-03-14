import React, { useState, useEffect } from 'react';
import {
  Progress,
  ProgressVariant,
  ProgressMeasureLocation,
  Tooltip,
  Text,
  TextContent,
  TextVariants,
  Skeleton,
  Spinner
} from '@patternfly/react-core';

const ResourceUsageProgress = ({ namespace, resource, showDetails = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true); // New state variable for tracking initial load

  const fetchData = async () => {
    if (initialLoad) {
      setLoading(true);
    }
    try {
      const response = await fetch(`/api/firelink/namespace/resource_metrics/${namespace}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const newData = await response.json();
      setData(newData);
    } catch (error) {
      console.error('Error fetching resource metrics:', error);
    } finally {
      setLoading(false);
      setInitialLoad(false); // Set initial load to false after the first fetch
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [namespace]);

  if (loading && initialLoad) { // Only show the skeleton during the initial load
    return <Skeleton />;
  }
  if (!data) {
    return <div />;
  }

  const usage = data.usage[resource];
  const requests = data.requests[resource];
  const limits = data.limits[resource];

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
          <Text component={TextVariants.h6}>
            {resource.toUpperCase()}
            {loading && !initialLoad && <Spinner size="md" />} {/* Only show spinner during auto-refresh */}
          </Text>
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
