import React, {useState, useEffect} from 'react';
import Loading from '../shared/Loading';
import {
	Radio,
	Stack,
	StackItem,
    FormSelect,
    FormSelectOption,
} from '@patternfly/react-core';

import { useSelector, useDispatch } from 'react-redux';
import {
    getMyReservations,
} from '../store/ListSlice';
import { getRequester  } from '../store/AppSlice'
import { setNamespace } from '../store/AppDeploySlice';



export default function AppDeployNamespaceSelector() {

    const dispatch = useDispatch();

    const requester = useSelector(getRequester);
    const myReservations = useSelector(getMyReservations(requester));
    const [selectedReservation, setSelectedReservation] = useState("");

    const [showNamespaceSelect, setShowNamespaceSelect] = useState(false);

    // Set the namespace in the store when the selected reservation changes
    useEffect(() => {
        dispatch(setNamespace(selectedReservation));
    }, [selectedReservation])

    // If the namespace select is hidden, set the namespace to an empty string
    // If the namespace select is shown, set the namespace to the first reservation
    useEffect(() => {
        if ( showNamespaceSelect === false ) {
            dispatch(setNamespace(""));
            return;
        }
        if (myReservations.length > 0) {
            setSelectedReservation(myReservations[0].namespace);
        }
    }, [showNamespaceSelect])

    const MyReservationSelect = () => {
        if (showNamespaceSelect === false) {
            return null
        }
        return <FormSelect
            id="namespace-select"
            onChange={(_event, selection) => { setSelectedReservation(selection) } }
            value={selectedReservation}
            isDisabled={!showNamespaceSelect}>
                { myReservations.map((reservation, index) => <FormSelectOption key={`${reservation.namespace}-${index}`} value={reservation.namespace} label={reservation.namespace}/> )}
        </FormSelect>
    }

    const NamespaceSelection = () => {
        if ( myReservations.length === 0 ) {
            return <React.Fragment>
                <p>You have no namespaces reserved. A new namespace will be reserved for you.</p>
            </React.Fragment>
        } else {
            return <Stack hasGutter>
                <StackItem>
                    <Radio
                        isChecked={!showNamespaceSelect}
                        name="radio-request-namespace"
                        onChange={() => { setShowNamespaceSelect(false) } }
                        label="Request New Namespace"
                        id="radio-request-namespace"/> 
                </StackItem>
                <StackItem>
                    <Radio
                    isChecked={showNamespaceSelect}
                    name="radio-use-namespace"
                    onChange={() => { setShowNamespaceSelect(true) } }
                    label="Use Existing Namespace"
                    id="radio-use-namespace"
                    isDisabled={myReservations.length === 0}/>
                </StackItem>
                <StackItem>
                    <MyReservationSelect />
                </StackItem>
            </Stack>
        }
    }

    return <NamespaceSelection />

}