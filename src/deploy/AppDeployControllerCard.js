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
    Split,
    SplitItem,
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


    return <Card isFullHeight>
        <CardTitle>
            <Title headingLevel="h3" size={TitleSizes['3x1']}>
                Deploy
            </Title>
        </CardTitle>
        <CardBody >
            <Stack hasGutter>
                <StackItem>
                    <AppDeployNamespaceSelector/>
                </StackItem>
                <StackItem >
                    <Split hasGutter>
                        <SplitItem isFilled/>
                        <SplitItem>
                            <Button onClick={Deploy}>
                                Go
                            </Button>
                        </SplitItem>
                    </Split>
                </StackItem>
            </Stack>
            { DeployStatusModal() }
        </CardBody>
    </Card>
}