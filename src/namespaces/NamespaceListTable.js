import React, { useEffect } from 'react';
import {TableComposable, Thead, Tr, Th, Tbody, Td, ActionsColumn} from '@patternfly/react-table';

import FilterDropdown from '../shared/FilterDropdown';

import { AppContext } from "../shared/ContextProvider"
import {useContext, useState} from 'react';
import DescribeLink from '../shared/DescribeLink';

import { Spinner } from '@patternfly/react-core';

function filterNamespaces(namespaces, filter) {
    return namespaces.filter((namespace) => {
        let foundFilterMatch = false
        const filteredColumnNames = ["name", "reserved", "status", "requester", "pool_type"]

        for (let i=0; i<filteredColumnNames.length; i++) {
            let key = filteredColumnNames[i]
            foundFilterMatch = filter[key] === "all" ? true : String(namespace[key]) === filter[key]
            if (!foundFilterMatch) {
                break
            }
        }

        return foundFilterMatch
    });
}

function ReleaseNamespace(namespace, AppState, setShowSpinner) {
    setShowSpinner(true)
    fetch('/api/firelink/namespace/release', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({namespace: namespace})
      }).then(response => response.json()).then((resp) => {
        if (resp.completed) {
            //This will trigger a reload of the namespace list
            AppState.update({namespaces: []})
            setShowSpinner(false)
        } else {
            alert("Error releasing namespace " + namespace + ": " + resp.message)
            setShowSpinner(false)
        }
    })
}

function ActionMenu({showSpinner, namespace, AppState, setShowSpinner}) {
    if (showSpinner) {
        return <Spinner isSVG size="md"/>
    } else {
        return <ActionsColumn items={[
            {title: 'Extend 1h', onClick: () => console.log(`clicked on Some action, on row `)},
            {title: 'Extend 8h', onClick: () => console.log(`clicked on Some action, on row `)},
            {title: 'Extend 24h', onClick: () => console.log(`clicked on Some action, on row `)}, 
            {title: 'Release', onClick: () => ReleaseNamespace(namespace.namespace, AppState, setShowSpinner )}
        ]}/>   
    }
}

export default function NamespaceListTable({namespaces, showJustMyReservations}) {
    const [AppState] = useContext(AppContext);

    const [filteredNamespaces, setFilteredNamespaces] = useState(namespaces);

    const [releasingReserve, setReleasingReserve] = useState(false)

    const defaultFilter = {
        name: "all",
        reserved: "all",
        status: "all",
        requester: "all",
        pool_type: "all"
    }

    const [filter, setFilter] = useState(defaultFilter);

    useEffect(() => {
        if (showJustMyReservations) {
            let tmpFilter = {...defaultFilter}
            tmpFilter.requester = AppState.requester
            setFilteredNamespaces(filterNamespaces(namespaces, tmpFilter))
        } else {
            setFilteredNamespaces(filterNamespaces(namespaces, filter));
        }
    }, [showJustMyReservations]);
    

    useEffect(()=>{
        setFilteredNamespaces(filterNamespaces(namespaces, filter));
    }, [filter]);


    const columnNames = {
        name: 'Name',
        reserved: 'Reserved',
        status: 'Status',
        clowdapps: 'ClowdApps Ready',
        requester: 'Requester',
        pool_type: 'Pool Type',
        expires_in: 'Expires in'
      };
    

    
      const tableJSX = <TableComposable aria-label="Simple table" borders={'default'} isStriped key="namespace-list-table">
        <Thead key="thead">
          <Tr key="header-row">
            <Th>{columnNames.name} </Th>
            <Th>{columnNames.reserved}</Th>
            <Th>{columnNames.status}</Th>
            <Th>{columnNames.clowdapps}</Th>
            <Th>{columnNames.requester}</Th>
            <Th>{columnNames.pool_type}</Th>
            <Th>{columnNames.expires_in}</Th>
          </Tr>
        </Thead>
        <Tbody key="tbody">
            <Tr key="filter-row">
            <Td style={{padding: "0.2em"}}></Td>
            <Td style={{padding: "0.2em"}}><FilterDropdown sourceArray={filteredNamespaces} sourceColumn="reserved" filter={filter} setFilter={setFilter}/></Td>
            <Td style={{padding: "0em"}}><FilterDropdown sourceArray={filteredNamespaces} sourceColumn="status" filter={filter} setFilter={setFilter}/></Td>
            <Td style={{padding: "0em"}}></Td>
            <Td style={{padding: "0em"}}><FilterDropdown sourceArray={filteredNamespaces} sourceColumn="requester" filter={filter} setFilter={setFilter}/></Td>
            <Td style={{padding: "0em"}}><FilterDropdown sourceArray={filteredNamespaces} sourceColumn="pool_type" filter={filter} setFilter={setFilter}/></Td>
            <Td style={{padding: "0em"}}></Td>
            </Tr>
            {filteredNamespaces.map(namespace => <Tr key={namespace.namespace}>
                <Td dataLabel={columnNames.name}>
                    <DescribeLink namespace={namespace.namespace}/>
                </Td>
                <Td dataLabel={columnNames.reserved}>{namespace.reserved.toString()}</Td>
                <Td dataLabel={columnNames.status}>{namespace.status}</Td>
                <Td dataLabel={columnNames.clowdapps}>{namespace.clowdapps}</Td>
                <Td dataLabel={columnNames.requester}>{namespace.requester}</Td>
                <Td dataLabel={columnNames.poolType}>{namespace.pool_type}</Td>
                <Td dataLabel={columnNames.expiresIn}>{namespace.expires_in}</Td>
                {namespace.requester === AppState.requester &&
                <Td isActionCell>
                    <ActionMenu showSpinner={releasingReserve} namespace={namespace} AppState={AppState} setShowSpinner={setReleasingReserve}/>
                </Td>}
                </Tr>)}
        </Tbody>
      </TableComposable>

    return <React.Fragment>
        {tableJSX}
    </React.Fragment>

}