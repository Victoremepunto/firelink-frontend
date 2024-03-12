import React, { useEffect, useRef } from "react";
import { useState } from "react";
import io from "socket.io-client";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import { Spinner } from "@patternfly/react-core";
import CheckCircle from "@patternfly/react-icons/dist/js/icons/check-circle-icon";
import TimesCircle from "@patternfly/react-icons/dist/js/icons/times-circle-icon";
import InfoCircle from "@patternfly/react-icons/dist/js/icons/info-circle-icon";
import { useSelector } from "react-redux";
import { getDeploymentOptions } from "../store/AppDeploySlice";

const DEPLOY_EVENT = "deploy-app";
const ERROR_EVENT = "error-deploy-app";
const MONITOR_EVENT = "monitor-deploy-app";
const END_EVENT = "end-deploy-app";
const TIMEOUT = 60000; // 60 seconds timeout

// Construct the WebSocket URL based on the current location
const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
const host = window.location.host;
const SERVER = `${protocol}${host}`;

export default function AppDeployModal({
  buttonLabel,
  disabled,
  buttonVariant,
}) {
  const deploymentOptions = useSelector(getDeploymentOptions);
  const initialResponse = { message: "Initiating deployment connection..." };

  const [showModal, setShowModal] = useState(false);
  const [canCloseModal, setCanCloseModal] = useState(false);
  const [wsResponses, setWsResponses] = useState([initialResponse]);
  let timeoutActive = useRef(false);
  let socket = useRef(null);

  useEffect(() => {
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [socket]);

  const Deploy = () => {
    setWsResponses([initialResponse]);
    timeoutActive.current = true;

    if (socket.current) {
      socket.current.disconnect();
    }

    socket.current = io(SERVER, {
      path: "/api/firelink/socket.io",
      transports: ["polling"],
    });

    const timeout = setTimeout(() => {
      if (timeoutActive.current) {
        setWsResponses((state) => [
          ...state,
          {
            message:
              "Error: Server is unresponsive. Try again or contact DevProd.",
          },
        ]);
        setCanCloseModal(true);
        socket.current.disconnect();
      }
    }, TIMEOUT);

    socket.current.on(MONITOR_EVENT, (response) => {
      timeoutActive.current = false;
      setWsResponses((state) => [...state, response]);
    });

    socket.current.on(ERROR_EVENT, (response) => {
      timeoutActive.current = false;
      setWsResponses((state) => [...state, response]);
      setCanCloseModal(true);
      socket.disconnect();
    });

    socket.current.on(END_EVENT, (response) => {
      timeoutActive.current = false;
      setWsResponses((state) => [...state, response]);
      setCanCloseModal(true);
      socket.current.disconnect();
    });

    socket.current.on("disconnect", () => {
      clearTimeout(timeout); // Ensure the timeout is cleared when the socket disconnects
    });

    console.log(deploymentOptions);
    socket.current.emit(DEPLOY_EVENT, deploymentOptions);
    setShowModal(true);
  };

  const StatusIcon = ({ index, response }) => {
    if (index === wsResponses.length - 1 && !canCloseModal) {
      return <Spinner size="md" />;
    }
    if (response.error === true) {
      return <TimesCircle color="#FF0000" />;
    }
    if (response.completed === true) {
      return <CheckCircle color="#00FF00" />;
    }
    return <InfoCircle color="#00AAFF" />;
  };

  const close = () => {
    setShowModal(false);
    timeoutActive.current = false; // Ensure the timeout is disabled when the modal is closed
  };

  const getButtonLabel = () => {
    return buttonLabel || "Deploy";
  };

  const getButtonVariant = () => {
    return buttonVariant || "primary";
  };

  return (
    <React.Fragment>
      <Modal
        variant={ModalVariant.small}
        title="Deploying..."
        isOpen={showModal}
        showClose={canCloseModal}
        onClose={close}
        actions={[
          <Button key="cancel" onClick={close}>
            Close
          </Button>,
        ]}
      >
        <div style={{ height: "14rem", overflow: "auto" }}>
          <ul>
            {wsResponses.map((response, index) => (
              <li key={`response-id-${index}`}>
                &nbsp; &nbsp; &nbsp;{" "}
                <StatusIcon index={index} response={response} /> &nbsp;{" "}
                {response.message}
              </li>
            ))}
          </ul>
        </div>
      </Modal>
      <Button
        onClick={Deploy}
        isDisabled={disabled}
        variant={getButtonVariant()}
      >
        {getButtonLabel()}
      </Button>
    </React.Fragment>
  );
}
