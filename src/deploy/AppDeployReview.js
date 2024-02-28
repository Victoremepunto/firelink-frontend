import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAppDeploySlice} from "../store/AppDeploySlice";
import SelectedAppsChips from "./SelectedAppsChips";
import {
    Stack,
    StackItem,
    Text,
    TextContent,
    TextList,
    TextListItem,
    TextVariants,
    Split,
    SplitItem,
    Chip,
    Button
} from '@patternfly/react-core';
import {
    CheckCircleIcon,
    TimesCircleIcon,
} from '@patternfly/react-icons';
import AppDeployModal from "./AppDeployModal";

export default function AppDeployReview()  {
    const dispatch = useDispatch();
    const appDeploySlice = useSelector(getAppDeploySlice);

    const monospaceStyle = {
        fontFamily: "monospace",
    }

    const Namespace = () => {
        if (appDeploySlice.namespace === "") {
            return "A new namespace will be reserved for you.";
        }
        return appDeploySlice.namespace;
    }

    const GreenCheck = () => {
        return <CheckCircleIcon style={{color: "green"}}/>
    }

    const RedX = () => {
        return <TimesCircleIcon style={{color: "red"}}/>
    }

    const PreserveResources = () => {
        if (appDeploySlice.no_remove_resources.length === 0) {
            return <TextListItem>
                    No apps or components selected for resource preservation.
            </TextListItem>
        }
        return appDeploySlice.no_remove_resources.map((resource) => {
            return <TextListItem key={resource}>
                    <Text style={monospaceStyle}>
                        {resource}
                    </Text>
            </TextListItem>
        });
    }

    const OmitDependencies = () => {
        if (appDeploySlice.remove_dependencies.length === 0) {
            return <TextListItem>
                    No apps or components selected to omit dependencies.
            </TextListItem>
        }
        return appDeploySlice.remove_dependencies.map((resource) => {
            return <TextListItem key={resource}>
                    <Text style={monospaceStyle}>
                        {resource}
                    </Text>
            </TextListItem>
        });
    }

    const SetParameters = () => {
        const setParameter = appDeploySlice.set_parameter; 
    
        if (Object.keys(setParameter).length === 0) {
            return <TextListItem>
                No template parameters overridden.
            </TextListItem>
        }
    
        return Object.entries(setParameter).map(([key, value]) => {
            return <TextListItem key={key}>
                <Text style={monospaceStyle}>
                    {key}={value}
                </Text>
                </TextListItem>
        });
    }
    

    return (
        <Stack hasGutter>
            <StackItem>
                <TextContent>
                    <Text component={TextVariants.h1}>
                        Review & Deploy
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem>
                <Split hasGutter>
                    <SplitItem isFilled/>
                    <SplitItem>
                        <Stack hasGutter>
                            <StackItem>
                                <TextContent>
                                    <Text component={TextVariants.h2}>
                                        Apps
                                    </Text>
                                </TextContent>
                                <SelectedAppsChips />
                            </StackItem>
                            <StackItem>
                                <TextContent>
                                    <Text component={TextVariants.h2}>
                                        Namespace
                                        
                                    </Text>
                                    <Namespace />
                                </TextContent>
                            </StackItem>
                            <StackItem>
                                <TextContent>
                                        <Text component={TextVariants.h2}>Options</Text>
                                        <TextList>
                                            <TextListItem>Deploy Frontends: {appDeploySlice.deployFrontends ? <GreenCheck/> : <RedX/>}</TextListItem>
                                            <TextListItem>Release on fail: { appDeploySlice.no_release_on_fail ? <RedX/> : <GreenCheck/> }</TextListItem>
                                            <TextListItem>Get dependencies: { appDeploySlice.remove_dependencies ? <RedX/> : <GreenCheck/> }</TextListItem>
                                            <TextListItem>Single replicas: { appDeploySlice.single_replicas ? <GreenCheck/> : <RedX/> }</TextListItem>
                                            <TextListItem>Pool: <Chip isReadOnly>{ appDeploySlice.pool }</Chip></TextListItem>
                                            <TextListItem>Duration: <Chip isReadOnly>{ appDeploySlice.duration }</Chip> </TextListItem>
                                            <TextListItem>Templates Parameter Value Source: <Chip isReadOnly>{ appDeploySlice.target_env }</Chip></TextListItem>
                                            <TextListItem>Deploy Version Source: <Chip isReadOnly>{ appDeploySlice.ref_env }</Chip></TextListItem>
                                            <TextListItem>Options Dependencies Method: <Chip isReadOnly>{ appDeploySlice.optional_deps_method }</Chip></TextListItem>
                                        </TextList>
                                </TextContent>
                            </StackItem>
                        </Stack>
                    </SplitItem>
                    <SplitItem>
                        <Stack hasGutter>
                            <StackItem>
                                <TextContent>
                                    <Text component={TextVariants.h2}>
                                        Preserve Resources
                                    </Text>
                                    <TextList >
                                        <PreserveResources/>
                                    </TextList>
                                </TextContent>
                            </StackItem>
                            <StackItem>
                                <TextContent>
                                    <Text component={TextVariants.h2}>
                                        Omit Dependencies
                                    </Text>
                                    <TextList >
                                        <OmitDependencies/>
                                    </TextList>
                                </TextContent>
                            </StackItem>
                            <StackItem>
                                <TextContent>
                                    <Text component={TextVariants.h2}>
                                        Set Parameters
                                    </Text>
                                    <TextList >
                                        <SetParameters/>
                                    </TextList>
                                </TextContent>
                            </StackItem>
                        </Stack>
                    </SplitItem>
                    <SplitItem isFilled/>
                </Split>
            </StackItem>
            <StackItem>
                <Split hasGutter>
                    <SplitItem isFilled/>
                    <SplitItem>
                        <Stack hasGutter>
                            <StackItem>
                               <AppDeployModal />
                            </StackItem>
                        </Stack>
                    </SplitItem>
                    <SplitItem isFilled/>
                </Split>
            </StackItem>

        </Stack>
    );
}


