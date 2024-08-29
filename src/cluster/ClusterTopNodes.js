import React from "react";
import { Table, Thead, Tbody, Tr, Td } from "@patternfly/react-table";
import ClusterResourceUsageMini from "./ClusterResourceUsageMini";

const TopNodesCard = ({ topNodes }) => {
  const openshiftConsoleBaseUrl =
    process.env.OPENSHIFT_CONSOLE_BASE_URL ||
    "https://console-openshift-console.apps.crc-eph.r9lp.p1.openshiftapps.com";

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
              <a
                target="_blank"
                href={`${openshiftConsoleBaseUrl}/k8s/cluster/nodes/${node["node"]}`}
              >
                {node["node"]}
              </a>
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
