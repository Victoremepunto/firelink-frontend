import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Skeleton,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import { Table, Thead, Tbody, Tr, Th, Td } from "@patternfly/react-table";
import ClusterResourceUsage from "./ClusterResourceUsage";
import ErrorCard from "../shared/ErrorCard";

const fetchTopNodes = async () => {
  try {
    const response = await fetch("/api/firelink/cluster/top_nodes");
    if (!response.ok) {
      console.log("HTTP error! status: ", response.status);
      throw new Error(`Something went wrong loading the cluster resource metrics.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching top nodes:", error);
    throw error;
  }
};

const TopNodesCard = () => {
  const [topNodes, setTopNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortIndex, setSortIndex] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const getTopNodes = async () => {
      try {
        const data = await fetchTopNodes();
        setTopNodes(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    getTopNodes();
  }, []);

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

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTopNodes();
      setTopNodes(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  if (error) {
    return <ErrorCard error={error} onRetry={handleRetry} />;
  }

  return (
    <Card>
      <CardBody>
        {isLoading ? (
          <Skeleton height="100px" />
        ) : (
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
        )}
      </CardBody>
    </Card>
  );
};

export default TopNodesCard;