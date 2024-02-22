import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    TreeView,
    Grid,
    GridItem,
    TextInput,
    Card,
    CardTitle,
    CardBody,
    Form,
    FormGroup,
} from '@patternfly/react-core';
import { v4 as uuidv4 } from 'uuid';
import {
    getAppDeployApps
} from "../store/AppDeploySlice";
import {
    getDarkMode
} from "../store/AppSlice";
import {
    createStoreOptionsFromApps,
    addOrRemoveStoreSelectedParameter,
    setStoreOptions,
    getStoreOptions,
    getStoreSelectedParameters,
    setStoreSelectedParameters
} from "../store/ParamSelectorSlice";

export default function SetParameters() {

    // Redux
    const dispatch = useDispatch();
    const options = useSelector(getStoreOptions);
    const selectedParameters = useSelector(getStoreSelectedParameters);
    const addOrRemoveSelectedParameter = (param) => dispatch(addOrRemoveSelectedParameter(param));
    const createOptionsFromApps = (apps) => dispatch(createStoreOptionsFromApps(apps));
    const setOptions = (options) => dispatch(setStoreOptions(options));
    const setSelectedParameters = (params) => dispatch(setStoreSelectedParameters(params));

    const apps = useSelector(getAppDeployApps);

    const darkMode = useSelector(getDarkMode);
    const [cardBodyStyle, setCardBodyStyle] = useState({height: "30rem", overflow: "auto", backgroundColor: "#FFFFFF"})

    useEffect(() => {
        console.log("Dark mode effect")
        const color = darkMode ? "#26292d" : "#FFFFFF"
        setCardBodyStyle({height: "30rem", overflow: "auto", backgroundColor: color})
    }, [darkMode])

    useEffect(() => {
        console.log("Apps effect")
        if (apps.length > 0) {
            createOptionsFromApps(apps)
        }
    }, [apps])

    const onSelect = (_event, treeViewItem) => {
        if (treeViewItem && !treeViewItem.children) {
            //First see if we have to remove it
            const index = selectedParameters.findIndex((param) => param.id === treeViewItem.id)
            if (index !== -1) {
                const newParams = selectedParameters.filter((param) => param.id !== treeViewItem.id)
                setSelectedParameters(newParams)
            } else {
                setSelectedParameters([...selectedParameters, treeViewItem])
            }
        }
    }

    const ParamInput = ({param}) => {
        return <Form>
            <FormGroup label={param.component+'/'+param.name} fieldId={param.id}>
                <TextInput type="text" value={param.value} onChange={(newValue) => param.value = newValue} aria-label={param.component+"/"+param.name}/>
            </FormGroup>
        </Form>
    }

    return <Grid hasGutter isFullHeight>
        <GridItem isFilled span={6}>
            <Card isFullHeight >
                <CardTitle>
                    <h3>Available Parameters</h3>
                </CardTitle>
                <CardBody style={cardBodyStyle}>
                    <TreeView data={options} activeItems={selectedParameters} onSelect={onSelect} hasGuides={true} useMemo={true} />
                </CardBody>
            </Card>
        </GridItem>
        <GridItem isFilled span={6}>
            <Card isFullHeight >
                <CardTitle>
                    <h3>Selected Parameters</h3>
                </CardTitle>
                <CardBody style={cardBodyStyle}>
                        {selectedParameters.map((param) => {
                            return <ParamInput key={param.id} param={param}/>
                        })}                    
                </CardBody>
            </Card>
        </GridItem>
    </Grid>
}