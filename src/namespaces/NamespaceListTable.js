import React, { useEffect } from "react";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ActionsColumn,
} from "@patternfly/react-table";

import { Tooltip, TextContent, Text, Truncate } from "@patternfly/react-core";

import FilterDropdown from "../shared/FilterDropdown";

import { useState } from "react";
import DescribeLink from "../shared/DescribeLink";

import { Icon } from "@patternfly/react-core";
import CogIcon from "@patternfly/react-icons/dist/esm/icons/cog-icon";
import CheckCircleIcon from "@patternfly/react-icons/dist/esm/icons/check-circle-icon";
import TimesCircleIcon from "@patternfly/react-icons/dist/esm/icons/times-circle-icon";

import { useSelector, useDispatch } from "react-redux";
import { loadNamespaces, clearNamespaces } from "../store/ListSlice";
import { getRequester } from "../store/AppSlice";

import Loading from "../shared/Loading";
import ResourceUsageProgress from "./ResourceUsageProgress";

function filterNamespaces(namespaces, filter) {
  return namespaces.filter((namespace) => {
    let foundFilterMatch = false;
    const filteredColumnNames = [
      "name",
      "reserved",
      "status",
      "requester",
      "pool_type",
    ];

    for (let i = 0; i < filteredColumnNames.length; i++) {
      let key = filteredColumnNames[i];
      foundFilterMatch =
        filter[key] === "all" ? true : String(namespace[key]) === filter[key];
      if (!foundFilterMatch) {
        break;
      }
    }

    return foundFilterMatch;
  });
}

export default function NamespaceListTable({
  namespaces,
  showJustMyReservations,
  onRelease
}) {
  const dispatch = useDispatch();

  const requester = useSelector(getRequester);

  const [filteredNamespaces, setFilteredNamespaces] = useState(namespaces);

  const [showReleaseModal, setShowReleaseModal] = useState(false);

  const defaultFilter = {
    name: "all",
    reserved: "all",
    status: "all",
    requester: "all",
    pool_type: "all",
  };

  const [filter, setFilter] = useState(defaultFilter);

  useEffect(() => {
    if (showJustMyReservations) {
      let tmpFilter = { ...defaultFilter };
      tmpFilter.requester = requester;
      setFilteredNamespaces(filterNamespaces(namespaces, tmpFilter));
    } else {
      setFilteredNamespaces(filterNamespaces(namespaces, filter));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showJustMyReservations]);

  useEffect(() => {
    setFilteredNamespaces(filterNamespaces(namespaces, filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const columnNames = {
    name: "Name",
    reserved: "Reserved",
    status: "Status",
    clowdapps: "ClowdApps",
    requester: "Requester",
    pool_type: "Pool Type",
    expires_in: "Expires in",
    memory: "Memory",
    cpu: "CPU",
  };

  const actionRow = (namespace, requester) => {
    if (namespace.requester === requester) {
      return (
        <Td isActionCell>
          <ActionsColumn
            items={[
              {
                title: "Extend 1h",
                onClick: () => console.log(`clicked on Some action, on row `),
              },
              {
                title: "Extend 8h",
                onClick: () => console.log(`clicked on Some action, on row `),
              },
              {
                title: "Extend 24h",
                onClick: () => console.log(`clicked on Some action, on row `),
              },
              {
                title: "Release",
                onClick: () => onRelease(namespace.namespace),
              },
            ]}
          />
        </Td>
      );
    }
    return <Td> </Td>;
  };

  return (
    <React.Fragment>
      {showReleaseModal ? (
        <Loading message="Releasing namespace..." />
      ) : (
        <Table
          aria-label="Simple table"
          borders={"default"}
          isStriped
          key="namespace-list-table"
        >
          <Thead key="thead">
            <Tr key="header-row">
              <Th textCenter>{columnNames.name} </Th>
              <Th textCenter>{columnNames.reserved}</Th>
              <Th textCenter>{columnNames.status}</Th>
              <Th textCenter>{columnNames.clowdapps}</Th>
              <Th textCenter>{columnNames.cpu}</Th>
              <Th textCenter>{columnNames.memory}</Th>
              <Th textCenter>{columnNames.requester}</Th>
              <Th textCenter>{columnNames.pool_type}</Th>
              <Th textCenter>{columnNames.expires_in}</Th>
              <Th textCenter>
                {" "}
                <Icon>
                  <CogIcon />
                </Icon>
              </Th>
            </Tr>
          </Thead>
          <Tbody key="tbody">
            <Tr key="filter-row">
              <Td textCenter style={{ padding: "0.2em" }}></Td>
              <Td textCenter style={{ padding: "0.2em" }}>
                <FilterDropdown
                  sourceArray={filteredNamespaces}
                  sourceColumn="reserved"
                  filter={filter}
                  setFilter={setFilter}
                />
              </Td>
              <Td textCenter style={{ padding: "0em" }}>
                <FilterDropdown
                  sourceArray={filteredNamespaces}
                  sourceColumn="status"
                  filter={filter}
                  setFilter={setFilter}
                />
              </Td>
              <Td textCenter style={{ padding: "0em" }}></Td>
              <Td textCenter style={{ padding: "0em" }}></Td>
              <Td textCenter style={{ padding: "0em" }}></Td>
              <Td textCenter style={{ padding: "0em" }}>
                <FilterDropdown
                  sourceArray={filteredNamespaces}
                  sourceColumn="requester"
                  filter={filter}
                  setFilter={setFilter}
                />
              </Td>
              <Td textCenter style={{ padding: "0em" }}>
                <FilterDropdown
                  sourceArray={filteredNamespaces}
                  sourceColumn="pool_type"
                  filter={filter}
                  setFilter={setFilter}
                />
              </Td>
              <Td textCenter style={{ padding: "0em" }}></Td>
              <Td textCenter style={{ padding: "0em" }}></Td>
            </Tr>
            {filteredNamespaces.map((namespace) => (
              <Tr key={namespace.namespace}>
                <Td textCenter dataLabel={columnNames.name}>
                  <DescribeLink namespace={namespace.namespace} />
                </Td>
                <Td textCenter dataLabel={columnNames.reserved}>
                  {namespace.reserved ? (
                    <CheckCircleIcon style={{ color: "green" }} />
                  ) : (
                    ""
                  )}
                </Td>
                <Td textCenter dataLabel={columnNames.status}>
                  {namespace.status ? (
                    <CheckCircleIcon style={{ color: "green" }} />
                  ) : (
                    <TimesCircleIcon style={{ color: "red" }} />
                  )}
                </Td>
                <Td textCenter dataLabel={columnNames.clowdapps}>
                  {namespace.clowdapps === "none" ? "" : namespace.clowdapps}
                </Td>
                <Td textCenter dataLabel={columnNames.cpu}>
                  <ResourceUsageProgress
                    namespace={namespace.namespace}
                    resource="cpu"
                  />
                </Td>
                <Td textCenter dataLabel={columnNames.memory}>
                  <ResourceUsageProgress
                    namespace={namespace.namespace}
                    resource="memory"
                  />
                </Td>
                <Td
                  textCenter
                  dataLabel={columnNames.requester}
                  style={{ maxWidth: "10rem" }}
                >
                  <Tooltip content={namespace.requester}>
                    <Truncate
                      content={namespace.requester}
                      trailingNumChars={10}
                    />
                  </Tooltip>
                </Td>
                <Td textCenter dataLabel={columnNames.poolType}>
                  {namespace.pool_type}
                </Td>
                <Td textCenter dataLabel={columnNames.expiresIn}>
                  {namespace.expires_in === "TBD" ? "" : namespace.expires_in}
                </Td>
                {actionRow(namespace, requester)}
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </React.Fragment>
  );
}
