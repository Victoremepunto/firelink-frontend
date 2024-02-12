import React, { useEffect } from "react";
import { useState} from "react";
import io from "socket.io-client";
import { 
    Button, 
    Checkbox, 
    Modal, 
    ModalVariant, 
    Stack, 
    StackItem,
    Card,
    CardTitle,
    CardBody,
    Title,
    TitleSizes,
} from '@patternfly/react-core';
import { PoolSelectList, DurationSelectList, DefaultPool, DefaultDuration } from "../shared/CustomSelects";
import { Spinner } from "@patternfly/react-core";
import CheckCircle from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import AppDeployNamespaceSelector from "./AppDeployNamespaceSelector";


import { useSelector, useDispatch} from "react-redux";
import {
    getRequester
} from "../store/AppSlice";
import {
    clearNamespaces,
} from "../store/ListSlice";
import {
    getAppDeployFrontends,
    getAppDeployNoReleaseOnFail,
    getAppDeployPool,
    getDeploymentOptions,
    getAppDeployDuration,
    setFrontends,
    setNoReleaseOnFail,
    setPool,
    setDuration,
} from "../store/AppDeploySlice";

const DEPLOY_EVENT = 'deploy-app';
const ERROR_EVENT = 'error-deploy-app';
const MONITOR_EVENT = 'monitor-deploy-app';
const END_EVENT = 'end-deploy-app';

// Construct the WebSocket URL based on the current location
const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
const host = window.location.host;
const SERVER = `${protocol}${host}`;

export default function AppDeployController() {

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

    
    const [showModal, setShowModal] = useState(false);
    const [canCloseModal, setCanCloseModal] = useState(false);
    const [socket, setSocket] = useState(null);
    const deploymentOptions = useSelector(getDeploymentOptions);

    const [wsResponses, setWsResponses] = useState(["Initiating deployment connection..."]);

    useEffect(() => {
        return () => {
            //Disconnect socket on unmount
            if (socket !== null) {
                socket.disconnect();
                setSocket(null);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }},[])

    const Deploy = () => {
        const tmpSocket = io(SERVER, { path: '/api/firelink/socket.io', transports: ['polling'] });

        tmpSocket.on(MONITOR_EVENT, (response) => {
            setWsResponses(state => [...state, response.message]);
        });
    
        tmpSocket.on(ERROR_EVENT, (response) => {
            setWsResponses(state => [...state, response.message]);
        });
    
        tmpSocket.on(END_EVENT, (response) => {
            setCanCloseModal(true);
            dispatch(clearNamespaces());
            tmpSocket.disconnect();
            setSocket(null);
        });
        setSocket(tmpSocket);
        tmpSocket.emit(DEPLOY_EVENT, deploymentOptions);
        setShowModal(true);
    } 

    const StatusIcon = ({index}) => {
        if (index === wsResponses.length - 1 && !canCloseModal)  {
            return <Spinner  size="md"/>
        } else {
            return <CheckCircle color="#00FF00"/>
        }
    }

    const DeployStatusModal = () => {
        const close = () => { setShowModal(false) }
        return <React.Fragment>
                <Modal
                variant={ModalVariant.small}
                title="Deploying..."
                isOpen={showModal}
                showClose={false}
                actions={[
                    <Button key="cancel" variant="primary" onClick={close}>
                    Close
                    </Button>
                ]}>
                    <div style={{height: '9rem', overflow: 'auto'}}>
                        <ul>
                            {wsResponses.map((response, index) => {
                                return <li key={`response-id-${index}`}>
                                        &nbsp; &nbsp; &nbsp; <StatusIcon index={index}/> &nbsp; {response}
                                    </li>})
                            }
                        </ul>
                    </div>
                </Modal>
      </React.Fragment>
    }


    return <Card>
        <CardTitle>
            <Title headingLevel="h3" size={TitleSizes['3x1']}>
                Deploy Controller
            </Title>
        </CardTitle>
        <CardBody >
            <Stack hasGutter>
                <StackItem>
                    <AppDeployNamespaceSelector/>
                </StackItem>
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
                <StackItem>
                    <Button onClick={Deploy}>
                        Deploy
                    </Button>
                </StackItem>
            </Stack>
            { DeployStatusModal() }
        </CardBody>
    </Card>
}