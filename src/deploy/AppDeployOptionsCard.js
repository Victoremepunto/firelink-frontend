import React from "react";
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
} from '@patternfly/react-core';
import { getAppDeployFrontends, getAppDeployNoReleaseOnFail, getAppDeployPool, getAppDeployDuration, setFrontends, setNoReleaseOnFail, setPool, setDuration } from "../store/AppDeploySlice";
import { PoolSelectList, DurationSelectList, DefaultPool, DefaultDuration } from "../shared/CustomSelects";


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

    return <Card isFullHeight>
        <CardTitle>
            <Title headingLevel="h3" size={TitleSizes.lg}>Options</Title>
        </CardTitle>
        <CardBody>
            <Stack hasGutter>
                <StackItem>
                    <Checkbox label="Deploy Frontend" isChecked={frontends} onChange={() => { setStoreFrontends(!frontends) }} id="deploy-app-frontends-checkbox" name="deploy-app-frontends-checkbox" />
                </StackItem>
                <StackItem>
                    <Checkbox label="Release Reservation on Fail" isChecked={!noReleaseOnFail} onChange={() => { setStoreNoReleaseOnFail(!noReleaseOnFail) }} id="deploy-app-release-checkbox" name="deploy-app-release-checkbox" />
                </StackItem>
                <StackItem>
                    <PoolSelectList value={pool}  setValue={setStorePool}/>
                </StackItem>
                <StackItem>
                    <DurationSelectList value={duration}  setValue={setStoreDuration}/>
                </StackItem>
            </Stack>
        </CardBody>
    </Card>
}