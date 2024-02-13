import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Stack,
    StackItem,
    Card,
    CardTitle,
    CardBody,
    Title,
    TitleSizes,
    Checkbox,
    Switch,
    TextInput,
} from '@patternfly/react-core';
import { 
    getAppDeployFrontends, 
    getAppDeployNoReleaseOnFail, 
    getAppDeployPool, 
    getAppDeployDuration, 
    setFrontends, 
    setNoReleaseOnFail, 
    setPool, 
    setDuration,
    setTargetEnv,
    getAppDeployTargetEnv,
    getAppDeployRefEnv,
    setRefEnv,
    getAppDeployGetDependencies,
    setGetDependencies,
    getAppDeployOptionalDepsMethod,
    setOptionalDepsMethod,
    getAppDeploySingleReplicas,
    setSingleReplicas,
    getAppDeployRemoveResources,
    deleteRemoveResources,
    getAppDeployNoRemoveResources,
    deleteNoRemoveResources,
    setRemoveResources,
    setNoRemoveResources
} from "../store/AppDeploySlice";
import { PoolSelectList, DurationSelectList, OptionalDepsMethodSelectList, DefaultPool, DefaultDuration } from "../shared/CustomSelects";
import AppDeployRemoveSelector  from "./AppDeployRemoveSelector";

export default function AppDeployoptionsCard() {

    const dispatch = useDispatch();

    // Use redux for all the state we're going to send for deploy
    const frontends = useSelector(getAppDeployFrontends);
    const setStoreFrontends = (value) => { dispatch(setFrontends(value)) }
    const noReleaseOnFail = useSelector(getAppDeployNoReleaseOnFail);
    const setStoreNoReleaseOnFail = (value) => { dispatch(setNoReleaseOnFail(value)) }
    const pool = useSelector(getAppDeployPool);
    const setStorePool = (value) => { dispatch(setPool(value)) }
    const duration = useSelector(getAppDeployDuration);
    const setStoreDuration = (value) => { dispatch(setDuration(value)) }
    const targetEnvironment = useSelector(getAppDeployTargetEnv);
    const setStoreTargetEnvironment = (value) => { dispatch(setTargetEnv(value)) }
    const refEnv = useSelector(getAppDeployRefEnv);
    const setStoreRefEnv = (value) => { dispatch(setRefEnv(value)) }
    const getDependencies = useSelector(getAppDeployGetDependencies);
    const setStoreGetDependencies = (value) => { dispatch(setGetDependencies(value)) }
    const optionDepsMethod = useSelector(getAppDeployOptionalDepsMethod);
    const setStoreOptionDepsMethod = (value) => { dispatch(setOptionalDepsMethod(value)) }
    const singleReplicas = useSelector(getAppDeploySingleReplicas);
    const setStoreSingleReplicas = (value) => { dispatch(setSingleReplicas(value)) }

    const removeResources = useSelector(getAppDeployRemoveResources);
    const setStoreRemoveResources = (value) => { dispatch(setRemoveResources(value)) }
    const noRemoveResources = useSelector(getAppDeployNoRemoveResources);
    const setStoreNoRemoveResources = (value) => { dispatch(setNoRemoveResources(value)) }

    const optionalDepsMethods = ["hyrbid", "all", "none"];

    return <Card isFullHeight>
        <CardTitle>
            <Title headingLevel="h3" size={TitleSizes.lg}>Options</Title>
        </CardTitle>
        <CardBody>
            <Stack hasGutter>
                <StackItem>
                    <Switch label="Deploy Frontends" isChecked={frontends} onChange={() => { setStoreFrontends(!frontends) }} id="deploy-app-frontends-checkbox" name="deploy-app-frontends-checkbox" />
                </StackItem>
                <StackItem>
                    <Switch label="Release Reservation on Fail" isChecked={!noReleaseOnFail} onChange={() => { setStoreNoReleaseOnFail(!noReleaseOnFail) }} id="deploy-app-release-checkbox" name="deploy-app-release-checkbox" />
                </StackItem>
                <StackItem>
                    <Switch label="Get Dependencies" isChecked={getDependencies} onChange={() => { setStoreGetDependencies(!getDependencies) }} id="deploy-app-get-deps-checkbox" name="deploy-app-get-deps-checkbox" />
                </StackItem>
                <StackItem>
                    <Switch label="Single Replicas" isChecked={singleReplicas} onChange={() => { setStoreSingleReplicas(!singleReplicas) }} id="deploy-app-single-replicas-checkbox" name="deploy-app-single-replicas-checkbox" />
                </StackItem>
                <StackItem>
                    <PoolSelectList value={pool}  setValue={setStorePool}/>
                </StackItem>
                <StackItem>
                    <DurationSelectList value={duration}  setValue={setStoreDuration}/>
                </StackItem>
                <StackItem>
                    Target Environment
                    <TextInput value={targetEnvironment} onChange={(_event, value) => setStoreTargetEnvironment(value)} type="text" id="deploy-app-target-env"/>
                </StackItem>
                <StackItem>
                    Reference Environment
                    <TextInput value={refEnv} onChange={(_event, value) => setStoreRefEnv(value)} type="text" id="deploy-app-ref-env"/>
                </StackItem>
                <StackItem>
                    <OptionalDepsMethodSelectList value={optionDepsMethod}  setValue={setStoreOptionDepsMethod}/>
                </StackItem>
                <StackItem>
                    <AppDeployRemoveSelector title="Remove Resources" value={removeResources} onSelect={setStoreRemoveResources} defaultValue={"all"}/>  
                </StackItem>
                <StackItem>
                    <AppDeployRemoveSelector title="No Remove Resources" value={noRemoveResources} onSelect={setStoreNoRemoveResources} defaultValue={"none"}/>  
                </StackItem>
            </Stack>
        </CardBody>
    </Card>
}