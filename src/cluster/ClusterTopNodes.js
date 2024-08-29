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
import ClusterResourceUsageMini from "./ClusterResourceUsageMini";

const TopNodesCard = ({ topNodes }) => {
  const [sortIndex, setSortIndex] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const openshiftConsoleBaseUrl =
    process.env.OPENSHIFT_CONSOLE_BASE_URL ||
    "https://console-openshift-console.apps.crc-eph.r9lp.p1.openshiftapps.com";
  
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

  return (
    <Table aria-label="Top Nodes Table">
      <Thead>
        <Tr>
          <Td>Node</Td>
          <Td>CPU</Td>
          <Td>Memory</Td>
          <Td>Storage</Td>
        </Tr>
      </Thead>
      <Tbody>
        {topNodes.map((node, index) => (
          <Tr key={index}>
            <Td>
              <a target="_blank" href={`${openshiftConsoleBaseUrl}/k8s/cluster/nodes/${node["node"]}`}>{node["node"]}</a>
            </Td>
            <Td>
              <ClusterResourceUsageMini metrics={node["cpu"]} />
            </Td>
            <Td>
              <ClusterResourceUsageMini metrics={node["memory"]} />
            </Td>
            <Td>
              <ClusterResourceUsageMini metrics={node["ephemeral_storage"]} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default TopNodesCard;
