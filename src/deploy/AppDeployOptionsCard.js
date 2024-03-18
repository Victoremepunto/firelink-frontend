import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Stack,
  StackItem,
  Switch,
  Text,
  TextContent,
  TextVariants,
  Tooltip,
} from "@patternfly/react-core";
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
  setFallbackRefEnv,
  getAppDeployTargetEnv,
  getAppDeployRefEnv,
  setRefEnv,
  getAppDeployGetDependencies,
  setGetDependencies,
  getAppDeployOptionalDepsMethod,
  setOptionalDepsMethod,
  getAppDeploySingleReplicas,
  setSingleReplicas,
} from "../store/AppDeploySlice";
import {
  PoolSelectList,
  DurationSelectList,
  OptionalDepsMethodSelectList,
  ReferenceEnvironmentSelectList,
  TargetEnvironmentSelectList,
} from "../shared/CustomSelects";
import HelpTip from "../shared/HelpTip";

export default function AppDeployoptionsCard() {
  const dispatch = useDispatch();

  // Use redux for all the state we're going to send for deploy
  const frontends = useSelector(getAppDeployFrontends);
  const setStoreFrontends = (value) => {
    dispatch(setFrontends(value));
  };

  const noReleaseOnFail = useSelector(getAppDeployNoReleaseOnFail);
  const setStoreNoReleaseOnFail = (value) => {
    dispatch(setNoReleaseOnFail(value));
  };
  const pool = useSelector(getAppDeployPool);
  const setStorePool = (value) => {
    dispatch(setPool(value));
  };
  const duration = useSelector(getAppDeployDuration);
  const setStoreDuration = (value) => {
    dispatch(setDuration(value));
  };
  const targetEnvironment = useSelector(getAppDeployTargetEnv);
  const setStoreTargetEnvironment = (value) => {
    dispatch(setTargetEnv(value));
  };
  const refEnv = useSelector(getAppDeployRefEnv);
  const setStoreRefEnv = (value) => {
    dispatch(setRefEnv(value));
  };
  const fallbackRefEnv = useSelector(getAppDeployRefEnv);
  const setStoreFallbackRefEnv = (value) => {
    dispatch(setFallbackRefEnv(value));
  };
  const getDependencies = useSelector(getAppDeployGetDependencies);
  const setStoreGetDependencies = (value) => {
    dispatch(setGetDependencies(value));
  };
  const optionDepsMethod = useSelector(getAppDeployOptionalDepsMethod);
  const setStoreOptionDepsMethod = (value) => {
    dispatch(setOptionalDepsMethod(value));
  };
  const singleReplicas = useSelector(getAppDeploySingleReplicas);
  const setStoreSingleReplicas = (value) => {
    dispatch(setSingleReplicas(value));
  };

  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Text component={TextVariants.h1}>Set Deployment Options</Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <Tooltip
          content={
            <div>
              Frontend deploys are currently disabled due to a cluster networking issue. We are working with IT on a solution and will enable the feature as soon as possible.
            </div>
          }
        >
          <span>
            <Switch
              label="Deploy Frontends"
              isDisabled
              isChecked={frontends}
              onChange={() => {
                setStoreFrontends(!frontends);
              }}
              id="deploy-app-frontends-checkbox"
              name="deploy-app-frontends-checkbox"
            />
            &nbsp;{" "}
            <HelpTip content="By default, frontends are not deployed. Check to deploy frontends." />
          </span>
        </Tooltip>
      </StackItem>
      <StackItem>
        <Switch
          label="Release Reservation on Fail"
          isChecked={!noReleaseOnFail}
          onChange={() => {
            setStoreNoReleaseOnFail(!noReleaseOnFail);
          }}
          id="deploy-app-release-checkbox"
          name="deploy-app-release-checkbox"
        />
        &nbsp;{" "}
        <HelpTip content="By default, a reservation will be released if the deployment fails. Uncheck to keep the reservation." />
      </StackItem>
      <StackItem>
        <Switch
          label="Get Dependencies"
          isChecked={getDependencies}
          onChange={() => {
            setStoreGetDependencies(!getDependencies);
          }}
          id="deploy-app-get-deps-checkbox"
          name="deploy-app-get-deps-checkbox"
        />
        &nbsp;{" "}
        <HelpTip content="Recursively fetch dependencies listed in ClowdApps. Default is True." />
      </StackItem>
      <StackItem>
        <Switch
          label="Single Replicas"
          isChecked={singleReplicas}
          onChange={() => {
            setStoreSingleReplicas(!singleReplicas);
          }}
          id="deploy-app-single-replicas-checkbox"
          name="deploy-app-single-replicas-checkbox"
        />
        &nbsp;{" "}
        <HelpTip content="Be default replicas are set to '1' for all deployments." />
      </StackItem>
      <StackItem>
        <PoolSelectList value={pool} setValue={setStorePool} />
      </StackItem>
      <StackItem>
        <HelpTip content="Choose how long until the deployment is automatically released." />{" "}
        &nbsp;
        <DurationSelectList value={duration} setValue={setStoreDuration} />
      </StackItem>
      <StackItem>
        <HelpTip content="Choose the environment in app-interface that the ResourceTemplate parameter values should be pulled from." />{" "}
        &nbsp;
        <TargetEnvironmentSelectList
          value={targetEnvironment}
          setValue={setStoreTargetEnvironment}
        />
      </StackItem>
      <StackItem>
        <HelpTip content="Choose the environment in app-interface that the git refs / image tag to deploy should be pulled from. Choose Main Branch to pull the HEAD of main or master." />{" "}
        &nbsp;
        <ReferenceEnvironmentSelectList
          label={"Deploy Version Source"}
          value={refEnv}
          setValue={setStoreRefEnv}
        />
      </StackItem>
      <StackItem>
        <HelpTip content="See Deploy Version Source. Fallback is the app-interface deploy target to pull git refs / image tag if there's no target found in Deploy Version Source." />{" "}
        &nbsp;
        <ReferenceEnvironmentSelectList
          label={"Fallback Deploy Version Source"}
          value={fallbackRefEnv}
          setValue={setStoreRefEnv}
        />
      </StackItem>
      <StackItem>
        <HelpTip content="Chose how ClowdApp Optional Dependencies are processed. 'Hybrid', the default behavior, will deploy optional depencies for ClowdApps you explicitely deploy. 'All' will deploy optional dependencies for all ClowdApps." />{" "}
        &nbsp;
        <OptionalDepsMethodSelectList
          value={optionDepsMethod}
          setValue={setStoreOptionDepsMethod}
        />
      </StackItem>
    </Stack>
  );
}
