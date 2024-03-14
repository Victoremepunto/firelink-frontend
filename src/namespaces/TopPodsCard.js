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
  Button,
  EmptyStateVariant,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import { CubesIcon, SyncIcon } from "@patternfly/react-icons";
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
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nextRefresh, setNextRefresh] = useState(10);

  const topPodsFromStore = useSelector(getNamespaceTopPods);

  useEffect(() => {
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
        setTopPods(topPodsFromStore);
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

  const columns = ["Name", "CPU (cores)", "Memory (bytes)"];

  const getSortableRowValues = (pod) => {
    return [
      pod.NAME,
      parseFloat(pod["CPU(cores)"].replace(/[^\d.]/g, "")),
      parseFloat(pod["MEMORY(bytes)"].replace(/[^\d.]/g, "")),
    ];
  };

  let sortedPodsData = topPods;
  if (sortIndex !== null) {
    sortedPodsData = [...topPods].sort((a, b) => {
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

  if (!topPods || topPods.length <= 0) {
    return (
      <Card>
        <CardTitle>
          Pods Resource Usage
          {isLoading && <Spinner size="md" />}
          <Button variant="plain" onClick={fetchData}>
            <SyncIcon />
          </Button>
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
          <SplitItem>{isLoading ? <Spinner size="md" /> : <div />}</SplitItem>
        </Split>
      </CardTitle>
      <CardBody>
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
            {sortedPodsData.map((pod, index) => (
              <Tr key={index}>
                <Td dataLabel="Name">{pod.NAME}</Td>
                <Td dataLabel="CPU (cores)">{pod["CPU(cores)"]}</Td>
                <Td dataLabel="Memory (bytes)">{pod["MEMORY(bytes)"]}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default PodsTableCard;
