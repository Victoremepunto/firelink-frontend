import React from "react";
import { useState} from "react";
import io from "socket.io-client";
import { 
    Button, 
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
import { Spinner } from "@patternfly/react-core";
import CheckCircle from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import TimesCircle from '@patternfly/react-icons/dist/js/icons/times-circle-icon';
import InfoCircle from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import AppDeployNamespaceSelector from "./AppDeployNamespaceSelector";
import { useSelector } from "react-redux";
import {
    getDeploymentOptions,
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
    
    const deploymentOptions = useSelector(getDeploymentOptions);
    const initialResponse = { message: "Initiating deployment connection..."};

    const [showModal, setShowModal] = useState(false);
    const [canCloseModal, setCanCloseModal] = useState(false);
    const [wsResponses, setWsResponses] = useState([initialResponse]);

    const Deploy = () => {
        setWsResponses([initialResponse]);
        const socket = io(SERVER, { path: '/api/firelink/socket.io', transports: ['polling'] });

        socket.on(MONITOR_EVENT, (response) => {
            setWsResponses(state => [...state, response]);
        });
    
        socket.on(ERROR_EVENT, (response) => {
            setWsResponses(state => [...state, response]);
        });
    
        socket.on(END_EVENT, (response) => {
            setWsResponses(state => [...state, response]);
            setCanCloseModal(true);
            socket.disconnect();
        });
        socket.emit(DEPLOY_EVENT, deploymentOptions);
        setShowModal(true);
    } 

    const StatusIcon = ({index, response}) => {
        if (index === wsResponses.length - 1 && !canCloseModal)  {
            return <Spinner  size="md"/>
        }
        if (response.error === true) {
            return <TimesCircle color="#FF0000"/>
        }
        if ( response.completed === true) {
            return <CheckCircle color="#00FF00"/>
        }   
        return <InfoCircle color="#00AAFF"/>
    }

    const DeployStatusModal = () => {
        const close = () => { setShowModal(false) }
        return <React.Fragment>
                <Modal
                variant={ModalVariant.small}
                title="Deploying..."
                isOpen={showModal}
                showClose={canCloseModal}
                onClose={close}
                actions={[
                    <Button key="cancel" onClick={close} >
                        Close
                    </Button>
                ]}>
                    <div style={{height: '14rem', overflow: 'auto'}}>
                        <ul>
                            {wsResponses.map((response, index) => {
                                return <li key={`response-id-${index}`}>
                                        &nbsp; &nbsp; &nbsp; <StatusIcon index={index} response={response}/> &nbsp; {response.message}
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