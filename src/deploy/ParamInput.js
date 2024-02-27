import React, { useState } from 'react';
import { StackItem, FormGroup, TextInputGroup, TextInput, Button } from '@patternfly/react-core';
import { useDispatch } from 'react-redux';
import { TimesCircleIcon } from '@patternfly/react-icons';
import {
    createStoreOptionsFromApps,
    addOrRemoveStoreSelectedParameter,
    setStoreOptions,
    getStoreOptions,
    getStoreSelectedParameters,
    setStoreSelectedParameters
} from "../store/ParamSelectorSlice";

const ParamInput = ({ param, onParamChange }) => {
    const paramPath = param.component + '/' + param.name;
    const [value, setValue] = useState(param.value);

    const dispatch = useDispatch();

    const addOrRemoveSelectedParameter = (param) => dispatch(addOrRemoveStoreSelectedParameter(param));

    const handleChange = (newValue) => {
        //Make a copy of param
        var newParam = {...param};
        newParam.value = newValue;
        setValue(newValue);
        // Send the new param to the parent
        onParamChange(newParam);
    };

    return (
        <StackItem>
            <FormGroup label={paramPath}>
                <TextInputGroup>
                    <TextInput
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        aria-label={param.component + '/' + param.name}
                    />
                    <Button variant="danger" size="sm" onClick={() => addOrRemoveSelectedParameter(param)}>
                        <TimesCircleIcon />
                    </Button>
                </TextInputGroup>
            </FormGroup>
            &nbsp;
        </StackItem>
    );
};

export default ParamInput;
