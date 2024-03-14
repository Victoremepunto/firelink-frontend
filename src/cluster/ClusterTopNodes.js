import React, { useState } from "react";
import {
  Card,
  CardBody,
  Skeleton,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import { Table, Thead, Tbody, Tr, Th, Td } from "@patternfly/react-table";
import ClusterResourceUsage from "./ClusterResourceUsage";
import Loading from "../shared/Loading";

const TopNodesCard = ({ topNodes, isLoading }) => {

  const [sortIndex, setSortIndex] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const columns = ["NAME", "CPU(cores)", "CPU%", "MEMORY(bytes)", "MEMORY%"];

  const getSortableRowValues = (node) => {
    return [
      node["NAME"],
      parseFloat(node["CPU(cores)"].replace(/[^\d.]/g, "")),
      parseFloat(node["CPU%"].replace("%", "")),
      parseFloat(node["MEMORY(bytes)"].replace(/[^\d.]/g, "")),
      parseFloat(node["MEMORY%"].replace("%", "")),
    ];
  };

  let sortedTopNodes = topNodes;

  if (sortIndex !== null && topNodes) {
    sortedTopNodes = [...topNodes].sort((a, b) => {
      const aValue = getSortableRowValues(a)[sortIndex];
      const bValue = getSortableRowValues(b)[sortIndex];
      return (sortDirection === "asc" ? 1 : -1) * (aValue - bValue);
    });
  }

  const onSort = (event, index, direction) => {
    setSortIndex(index);
    setSortDirection(direction);
  };

  if (isLoading) {
    return (
      <Loading message="Loading cluster metrics..." />
    );
  }

  return (
    <Card>
      <CardBody>
          <Stack hasGutter>
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
                      <Th
                        key={column}
                        sort={{
                          sortBy: {
                            index: sortIndex,
                            direction: sortDirection,
                          },
                          onSort,
                          columnIndex: index,
                        }}
                      >
                        {column}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedTopNodes.map((node, index) => (
                    <Tr key={index}>
                      {columns.map((column) => (
                        <Td key={column} dataLabel={column}>
                          {node[column]}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </StackItem>
          </Stack>
      </CardBody>
    </Card>
  );
};

export default TopNodesCard;