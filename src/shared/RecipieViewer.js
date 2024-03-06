import React, { useEffect, useState } from 'react';
import {
    Grid,
    GridItem,
    Stack,
    StackItem,
    Text,
    TextContent,
    TextList,
    TextListItem,
    TextVariants,
    Chip
} from '@patternfly/react-core';
import {
    CheckCircleIcon,
    TimesCircleIcon,
} from '@patternfly/react-icons';
import SelectedAppsChips from "./SelectedAppsChips";

const Namespace = ({ namespace }) => {
    if (namespace === "") {
        return "A new namespace will be reserved for you.";
    }
    return namespace;
};

const GreenCheck = () => <CheckCircleIcon style={{ color: "green" }} />;
const RedX = () => <TimesCircleIcon style={{ color: "red" }} />;

const PreserveResources = ({ resources }) => {
    if (resources.length === 0) {
        return "No apps or components selected for resource preservation.";
    }
    return resources.map((resource) => (
        <TextListItem key={resource}>
            <Text style={{ fontFamily: "monospace" }}>
                {resource}
            </Text>
        </TextListItem>
    ));
};

const OmitDependencies = ({ dependencies }) => {
    if (dependencies.length === 0) {
        return "No apps or components selected to omit dependencies.";
    }
    return dependencies.map((resource) => (
        <TextListItem key={resource}>
            <Text style={{ fontFamily: "monospace" }}>
                {resource}
            </Text>
        </TextListItem>
    ));
};

const SetParameters = ({ parameters }) => {
    if (Object.keys(parameters).length === 0) {
        return "No template parameters overridden.";
    }
    return Object.entries(parameters).map(([key, value]) => (
        <TextListItem key={key}>
            <Text style={{ fontFamily: "monospace" }}>
                {key}={value}
            </Text>
        </TextListItem>
    ));
};

const ImageTagOverrides = ({ overrides }) => {
    if (Object.keys(overrides).length === 0) {
        return "No image tags overridden.";
    }
    return Object.entries(overrides).map(([key, value]) => (
        <TextListItem key={key}>
            <Text style={{ fontFamily: "monospace" }}>
                {key}={value}
            </Text>
        </TextListItem>
    ));
};

const AppDeployOptions = ({ recipe }) => (
    <TextList>
        <TextListItem>Deploy Frontends: {recipe.frontends ? <GreenCheck /> : <RedX />}</TextListItem>
        <TextListItem>Release on fail: {recipe.no_release_on_fail ? <RedX /> : <GreenCheck />}</TextListItem>
        <TextListItem>Get dependencies: {recipe.get_dependencies ? <GreenCheck /> : <RedX/>}</TextListItem>
        <TextListItem>Single replicas: {recipe.single_replicas ? <GreenCheck /> : <RedX />}</TextListItem>
        <TextListItem>Pool: <Chip isReadOnly>{recipe.pool}</Chip></TextListItem>
        <TextListItem>Duration: <Chip isReadOnly>{recipe.duration}</Chip> </TextListItem>
        <TextListItem>Templates Parameter Value Source: <Chip isReadOnly>{recipe.target_env}</Chip></TextListItem>
        <TextListItem>Deploy Version Source: <Chip isReadOnly>{recipe.ref_env}</Chip></TextListItem>
        <TextListItem>Options Dependencies Method: <Chip isReadOnly>{recipe.optional_deps_method}</Chip></TextListItem>
    </TextList>
);

export default function RecipeViewer({ recipe }) {

    return (
        <Grid hasGutter>
            <GridItem span={1} />
            <GridItem span={5}>
                <Stack hasGutter>
                    <StackItem>
                        <TextContent>
                            <Text component={TextVariants.h2}>
                                Apps
                            </Text>
                        </TextContent>
                        <SelectedAppsChips appList={recipe.app_names}/>
                    </StackItem>
                    <StackItem>
                        <TextContent>
                            <Text component={TextVariants.h2}>
                                Namespace
                            </Text>
                            <Namespace namespace={recipe.namespace} />
                        </TextContent>
                    </StackItem>
                    <StackItem>
                        <TextContent>
                            <Text component={TextVariants.h2}>Options</Text>
                            <AppDeployOptions recipe={recipe} />
                        </TextContent>
                    </StackItem>
                </Stack>
            </GridItem>
            <GridItem span={5}>
                <Stack hasGutter>
                    <StackItem>
                        <TextContent>
                            <Text component={TextVariants.h2}>
                                Preserve Resources
                            </Text>
                            <TextList>
                                <PreserveResources resources={recipe.no_remove_resources} />
                            </TextList>
                        </TextContent>
                    </StackItem>
                    <StackItem>
                        <TextContent>
                            <Text component={TextVariants.h2}>
                                Omit Dependencies
                            </Text>
                            <TextList>
                                <OmitDependencies dependencies={recipe.remove_dependencies} />
                            </TextList>
                        </TextContent>
                    </StackItem>
                    <StackItem>
                        <TextContent>
                            <Text component={TextVariants.h2}>
                                Set Parameters
                            </Text>
                            <TextList>
                                <SetParameters parameters={recipe.set_parameter} />
                            </TextList>
                        </TextContent>
                    </StackItem>
                    <StackItem>
                        <TextContent>
                            <Text component={TextVariants.h2}>
                                Image Tag Overrides
                            </Text>
                            <TextList>
                                <ImageTagOverrides overrides={recipe.set_image_tag} />
                            </TextList>
                        </TextContent>
                    </StackItem>
                </Stack>
            </GridItem>
            <GridItem span={1} />
        </Grid>
    );
}
