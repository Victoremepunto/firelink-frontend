import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
    getAppNames,
    getAppDeployComponents,
} from "../store/AppDeploySlice";
import { 
    DualListSelector
} from "@patternfly/react-core";

export default function ResourceSelector({setSelection, getSelection}) {

    // Get the apps and components from the store
    // These are arrays of strings like ["app:rbac", "app:automation-analytics"] and ["rbac-frontend", "some-other-component"]
    const apps = useSelector(getAppNames);
    const components = useSelector(getAppDeployComponents);

    // Set the initial state of the available and chosen options to the apps and components
    const [availableOptions, setAvailableOptions] = useState([...apps.map(app => "app:" + app), ...components]);
    const [chosenOptions, setChosenOptions] = useState([...getSelection]);

    // When the list changes, update the available and chosen options
    // Also update the selection state
    const onListChange = (_, newAvailableOptions, newChosenOptions) => {
        setAvailableOptions(newAvailableOptions);
        setChosenOptions(newChosenOptions);
        setSelection(newChosenOptions);
    }

    // Remove the chosen options from the available options
    const removeChosenOptionsFromAvailable = () => {
        setAvailableOptions(availableOptions.filter(option => !chosenOptions.includes(option)));
    }

    // When the selection changes, update the chosen options and remove them from the available options
    useEffect(() => {
        setChosenOptions(getSelection);
        removeChosenOptionsFromAvailable();
    }, [getSelection]);

    return <DualListSelector
        id="resource-selector"
        availableOptions={availableOptions}
        chosenOptions={chosenOptions}
        onListChange={onListChange}
        availableOptionsTitle="Available ClowdApps and Resource Templates"
        chosenOptionsTitle="Selected ClowdApps and Resource Templates"
    />
}