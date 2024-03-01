import React from "react";
import { useSelector } from "react-redux";
import { getAppDeploySlice} from "../store/AppDeploySlice";
import {
    Stack,
    StackItem,
    Text,
    TextContent,
    TextVariants,
    Split,
    SplitItem,
} from '@patternfly/react-core';

import AppDeployModal from "./AppDeployModal";
import AppDeploySaveRecipeModal from "./AppDeploySaveRecipeModal";
import RecipeViewer from "../store/RecipieViewer";

export default function AppDeployReview()  {
    const appDeploySlice = useSelector(getAppDeploySlice);

    return (
        <Stack hasGutter>
            <StackItem>
                <Split>
                    <SplitItem>
                        <TextContent>
                            <Text component={TextVariants.h1}>
                                Review & Deploy
                            </Text>
                        </TextContent>
                    </SplitItem>
                    <SplitItem isFilled/>
                    <SplitItem>
                        <AppDeployModal />
                        &nbsp;
                    </SplitItem>
                    <SplitItem>
                        <AppDeploySaveRecipeModal />
                    </SplitItem>
                </Split>

            </StackItem>
            <StackItem>
                <RecipeViewer recipe={appDeploySlice}/>
            </StackItem>
        </Stack>
    );
}


