import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardTitle,
  CardBody,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title,
  Skeleton,
  Spinner,
  EmptyStateVariant,
  Split,
  SplitItem,
  Stack,
  StackItem,
  TextInput,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableVariant,
} from "@patternfly/react-table";
import { getNamespaceTopPods, loadNamespaceTopPods } from "../store/ListSlice";


const PodsTableCard = ({ namespace, onError = (_error) => {} }) => {
  const dispatch = useDispatch();
  
  const [sortIndex, setSortIndex] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [topPods, setTopPods] = useState([]);
  const [filteredPods, setFilteredPods] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nextRefresh, setNextRefresh] = useState(10);
  const [filterText, setFilterText] = useState("");


  const openshiftConsoleBaseUrl =
    process.env.OPENSHIFT_CONSOLE_BASE_URL ||
    "https://console-openshift-console.apps.crc-eph.r9lp.p1.openshiftapps.com";

  const topPodsFromStore = useSelector(getNamespaceTopPods);

  useEffect(() => {
    //fetchData();
    const interval = setInterval(() => {
      setNextRefresh((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (nextRefresh === 0) {
      fetchData();
      setNextRefresh(10);
    }
  }, [nextRefresh]);

  const fetchData = () => {
    if (!namespace) {
      return;
    }
    setIsLoading(true);
    dispatch(loadNamespaceTopPods(namespace))
      .unwrap()
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading namespace top pods:", error);
        setIsLoading(false);
        setError(error);
        onError(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [namespace]);

  useEffect(() => {
    setTopPods(topPodsFromStore);
  }, [topPodsFromStore]);

  useEffect(() => {
    const filtered = topPods.filter((pod) =>
      pod.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredPods(filtered);
  }, [filterText, topPods]);

  const columns = ["Name", "CPU (cores)", "Memory (GB)"];

  const getSortableRowValues = (pod) => {
    return [
      pod.name,
      pod.cpu,
      pod.ram,
    ];
  };

  let sortedPodsData = filteredPods;
  if (sortIndex !== null) {
    sortedPodsData = [...filteredPods].sort((a, b) => {
      const aValue = getSortableRowValues(a)[sortIndex];
      const bValue = getSortableRowValues(b)[sortIndex];
      if (typeof aValue === "number") {
        return (sortDirection === "asc" ? 1 : -1) * (aValue - bValue);
      } else {
        return (
          (sortDirection === "asc" ? 1 : -1) * aValue.localeCompare(bValue)
        );
      }
    });
  }

  const onSort = (event, index, direction) => {
    setSortIndex(index);
    setSortDirection(direction);
  };

  const handleFilterChange = (_e, value) => {
    setFilterText(value);
  };


  if (!topPods || topPods.length <= 0) {
    return (
      <Card>
        <CardTitle>
          Pods Resource Usage
          {isLoading ? <Spinner size="md" /> : <div />}
        </CardTitle>
        <CardBody>
          <Skeleton />
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardTitle>Pods Resource Usage</CardTitle>
        <CardBody>
          <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h2" size="lg">
              Error loading pods resource usage
            </Title>
            <EmptyStateBody>
              An error occurred while loading pods resource usage.
            </EmptyStateBody>
          </EmptyState>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>
        <Split>
          <SplitItem>Pods Resource Usage</SplitItem>
          <SplitItem isFilled />
        </Split>
      </CardTitle>
      <CardBody>
        <Stack>
          <StackItem>
            <TextInput
              type="text"
              value={filterText}
              onChange={handleFilterChange}
              aria-label="Filter pods"
              placeholder="Filter by pod name..."
            />
          </StackItem>
          <StackItem>
            <Table
              aria-label="Pods Resource Usage Table"
              variant={TableVariant.compact}
            >
              <Thead>
                <Tr>
                  {columns.map((column, index) => (
                    <Th
                      key={column}
                      sort={{
                        sortBy: { index: sortIndex, direction: sortDirection },
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
                {sortedPodsData.map((pod, index) => {
                  return (
                    <Tr key={index}>
                      <Td dataLabel="Name">
                        <a
                          href={`${openshiftConsoleBaseUrl}/k8s/ns/${namespace}/pods/${pod.name}/logs`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {pod.name}
                        </a>
                      </Td>
                      <Td dataLabel="cpu">{pod.cpu.toFixed(2)}</Td>
                      <Td dataLabel="Memory (bytes)">{
                        //only 2 decimal places
                        pod.ram.toFixed(2)
                        }</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </StackItem>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default PodsTableCard;
