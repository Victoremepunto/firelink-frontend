import React, { useState } from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title,
  Skeleton
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableVariant
} from '@patternfly/react-table';

const PodsTableCard = ({ podsData = [] }) => {
  const [sortIndex, setSortIndex] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const columns = ['Name', 'CPU (cores)', 'Memory (bytes)'];

  const getSortableRowValues = pod => {
    return [
      pod.NAME,
      parseFloat(pod['CPU(cores)'].replace(/[^\d.]/g, '')),
      parseFloat(pod['MEMORY(bytes)'].replace(/[^\d.]/g, ''))
    ];
  };

  let sortedPodsData = podsData;
  if (sortIndex !== null) {
    sortedPodsData = [...podsData].sort((a, b) => {
      const aValue = getSortableRowValues(a)[sortIndex];
      const bValue = getSortableRowValues(b)[sortIndex];
      if (typeof aValue === 'number') {
        return (sortDirection === 'asc' ? 1 : -1) * (aValue - bValue);
      } else {
        return (sortDirection === 'asc' ? 1 : -1) * aValue.localeCompare(bValue);
      }
    });
  }

  const onSort = (event, index, direction) => {
    setSortIndex(index);
    setSortDirection(direction);
  };

  if (podsData.length <= 0) {
    return (
      <Card>
        <CardTitle>Pods Resource Usage</CardTitle>
        <CardBody>
          <Skeleton />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>Pods Resource Usage</CardTitle>
      <CardBody>
        <Table aria-label="Pods Resource Usage Table" variant={TableVariant.compact}>
          <Thead>
            <Tr>
              {columns.map((column, index) => (
                <Th key={column} sort={{ sortBy: { index: sortIndex, direction: sortDirection }, onSort, columnIndex: index }}>
                  {column}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {sortedPodsData.map((pod, index) => (
              <Tr key={index}>
                <Td dataLabel="Name">{pod.NAME}</Td>
                <Td dataLabel="CPU (cores)">{pod['CPU(cores)']}</Td>
                <Td dataLabel="Memory (bytes)">{pod['MEMORY(bytes)']}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default PodsTableCard;
