import React, { useEffect } from "react";
import { useState} from "react";
import io from "socket.io-client";
import { Button, Checkbox, Modal, ModalVariant, Stack, StackItem} from '@patternfly/react-core';
import { PoolSelectList, DurationSelectList, DefaultPool, DefaultDuration } from "../shared/CustomSelects";
import { Spinner } from "@patternfly/react-core";
import CheckCircle from '@patternfly/react-icons/dist/js/icons/check-circle-icon';

import { useSelector} from "react-redux";
import {
    getRequester
} from "../store/AppSlice";

const DEPLOY_EVENT = 'deploy-app';
const ERROR_EVENT = 'error-deploy-app';
const MONITOR_EVENT = 'monitor-deploy-app';
const END_EVENT = 'end-deploy-app';

// Construct the WebSocket URL based on the current location
const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
const host = window.location.host;
const path = '/api/firelink/socket.io'; // Updated path
//const SERVER = `${protocol}${host}${path}`;
const SERVER = `${protocol}${host}`;

export default function AppDeployController(appname, reservation) {

    const [frontends , setFrontends] = useState(false);
    const [pool, setPool] = useState(DefaultPool);
    const [duration, setDuration] = useState(DefaultDuration);
    const [releaseOnFail, setReleaseOnFail] = useState(false);
    
    const [showModal, setShowModal] = useState(false);
    const [canCloseModal, setCanCloseModal] = useState(false);
    const [socket, setSocket] = useState(null);

    const requester = useSelector(getRequester);

    const deploymentOptions = () => { return {
        //Options exposed in the UI
        app_names: [appname.appname],
        requester: requester,
        duration: duration,
        no_release_on_fail: !releaseOnFail,
        frontends: frontends,
        pool: pool,
        namespace: reservation,
        //Options not exposed in the UI
        timeout: 600,
        source: 'appsre',
        get_dependencies: true,
        optional_deps_method: 'hybrid',
        set_image_tag: {},
        ref_env: null,
        target_env: 'insights-ephemeral',
        set_template_ref: {},
        set_parameter: {},
        clowd_env: null,
        local_config_path: null,
        remove_resources: [],
        no_remove_resources: [],
        remove_dependencies: [],
        no_remove_dependencies: [],
        single_replicas: true,
        name: null,
        component_filter: [],
        import_secrets: false,
        secrets_dir: '',
        local: true}
    }

    const [wsResponses, setWsResponses] = useState(["Initiating deployment connection..."]);

    useEffect(() => {

        return () => {
            //Disconnect socket on unmount
            if (socket !== null) {
                socket.disconnect();
                setSocket(null);
            }
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
            tmpSocket.disconnect();
            setSocket(null);
        });
        setSocket(tmpSocket);
        tmpSocket.emit(DEPLOY_EVENT, deploymentOptions());
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
            <Modal variant={ModalVariant.small} title="Deployment Status" isOpen={showModal} actions={[
                <Button key="close" variant="primary" onClick={close} isDisabled={!canCloseModal}> 
                    Close
                </Button>
            ]}>
                {wsResponses.map((response, index) => {
                    return <ul key={`deploy-response-${index}`}>
                        <li key={`response-id-${index}`}>
                            &nbsp; &nbsp; &nbsp; <StatusIcon index={index}/> &nbsp; {response}
                        </li>
                    </ul>})
                }
            </Modal>
        </React.Fragment> 
    }


    return <React.Fragment>
        <Stack hasGutter>
            <StackItem>
                <Checkbox label="Deploy Frontend" isChecked={frontends} onChange={() => { setFrontends(!frontends) }} id="deploy-app-frontends-checkbox" name="deploy-app-frontends-checkbox" />
            </StackItem>
            <StackItem>
                <Checkbox label="Release Reservation on Fail" isChecked={releaseOnFail} onChange={() => { setReleaseOnFail(!releaseOnFail) }} id="deploy-app-release-checkbox" name="deploy-app-release-checkbox" />
            </StackItem>
            <StackItem>
                <PoolSelectList value={pool}  setValue={setPool}/>
            </StackItem>
            <StackItem>
                <DurationSelectList value={duration}  setValue={setDuration}/>
            </StackItem>
            <StackItem>
                <Button onClick={Deploy}>
                    Deploy
                </Button>
            </StackItem>
        </Stack>
        { DeployStatusModal() }
    </React.Fragment>
}