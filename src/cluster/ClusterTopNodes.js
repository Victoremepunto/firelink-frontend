import React, { useEffect, useState } from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  Skeleton,
  Stack,
  StackItem
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import ClusterResourceUsage from './ClusterResourceUsage';

const TopNodesCard = () => {
  const [topNodes, setTopNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortIndex, setSortIndex] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/firelink/cluster/top_nodes')
      .then(response => response.json())
      .then(data => {
        setTopNodes(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching top nodes:', error);
        setIsLoading(false);
      });
  }, []);

  const columns = ['NAME', 'CPU(cores)', 'CPU%', 'MEMORY(bytes)', 'MEMORY%'];

  const getSortableRowValues = node => {
    return columns.map(column => node[column]);
  };

  let sortedTopNodes = topNodes;
  if (sortIndex !== null && topNodes) {
    sortedTopNodes = [...topNodes].sort((a, b) => {
      const aValue = getSortableRowValues(a)[sortIndex];
      const bValue = getSortableRowValues(b)[sortIndex];
      return (sortDirection === 'asc' ? 1 : -1) * aValue.localeCompare(bValue);
    });
  }

  const onSort = (event, index, direction) => {
    setSortIndex(index);
    setSortDirection(direction);
  };

  return (
    <Card>
      <CardBody>
        {isLoading ? (
          <Skeleton height="100px" />
        ) : ( <Stack hasGutter>
            <StackItem>
                <ClusterResourceUsage data={topNodes} resourceType="CPU" />
            </StackItem>
            <StackItem>
                <ClusterResourceUsage data={topNodes} resourceType="RAM" />
            </StackItem>
            <StackItem>
                <Table aria-label="Top Nodes Table">
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
                    {sortedTopNodes.map((node, index) => (
                        <Tr key={index}>
                        {columns.map(column => (
                            <Td key={column} dataLabel={column}>{node[column]}</Td>
                        ))}
                        </Tr>
                    ))}
                    </Tbody>
                </Table>
            </StackItem>
        </Stack>
        )}
      </CardBody>
    </Card>
  );
};

export default TopNodesCard;
