import React, { useState } from 'react';
import ImageTagInput from './ImageTagInput';
import { Stack, StackItem, Title, Text, TextContent, Split, SplitItem, Button } from '@patternfly/react-core';
import {
    setSetImageTag,
    getAppDeploySetImageTag
} from '../store/AppDeploySlice';
import { useSelector, useDispatch } from 'react-redux';

export default function ParentComponent() {

    const dispatch = useDispatch();

    const setImageTagOverrides = (imageTags) => dispatch(setSetImageTag(imageTags));
    const imageTagOverrides = useSelector(getAppDeploySetImageTag);

    const handleImageTagChange = (key, newValue) => {
        setImageTagOverrides({
        ...imageTagOverrides,
        [key]: newValue,
        });
    };

    const addImageTagOverride = () => {
        const newKey = `quay.io/org/repo${Object.keys(imageTagOverrides).length + 1}`;
        setImageTagOverrides({
        ...imageTagOverrides,
        [newKey]: 'new_tag',
        });
    };

    const removeImageTagOverride = (key) => {
        const updatedImageTags = { ...imageTagOverrides };
        delete updatedImageTags[key];
        setImageTagOverrides(updatedImageTags);
    };

    return (
        <Stack hasGutter>
        <StackItem>
            <Split hasGutter>
            <SplitItem>
                <Title headingLevel="h1">Image Tag Overrides</Title>
            </SplitItem>
            <SplitItem isFilled />
            <SplitItem>
                <Button variant="primary" onClick={addImageTagOverride}>Add</Button>
            </SplitItem>
            </Split>
        </StackItem>
        <StackItem>
            <TextContent>
            <Text>
            Update container image tags in your templates by specifying the image URI and the new tag. The system will automatically replace all occurrences of the image URI with the new tag. This optional feature is particularly beneficial for templates that do not parameterize their image tag. Utilize this functionality only if it is necessary for your use case.
            </Text>
            </TextContent>
        </StackItem>
        {Object.entries(imageTagOverrides).map(([key, value], index) => (
            <StackItem key={index}>
            <ImageTagInput
                imageTag={`${key}=${value}`}
                onImageTagChange={(newTag) => {
                const [newKey, newValue] = newTag.split('=');
                handleImageTagChange(newKey, newValue);
                }}
                onDelete={() => removeImageTagOverride(key)}
            />
            </StackItem>
        ))}
        </Stack>
    );
}
