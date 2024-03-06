import React, { useEffect } from "react";
import { useState} from "react";
import { 
    Button, 
    Modal, 
    ModalVariant, 
    InputGroup,
    TextInput,
    Stack,
    StackItem,
    TextContent,
    Text
} from '@patternfly/react-core';
import {
    getAppDeploySlice
} from '../store/AppDeploySlice';
import {
    addDeployRecipe
} from '../store/AppSlice';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';


export default function AppDeploySaveRecipeModal({buttonLabel, disabled, buttonVariant}) {
    
    const defaultRecipeName = "New Deploy Recipe";

    const [showModal, setShowModal] = useState(false);

    const canCloseModal = false;

    const close = () => { setShowModal(false) }

    const [recipeName, setRecipeName] = useState(defaultRecipeName);

    const appDeploySlice = useSelector(getAppDeploySlice);

    const dispatch = useDispatch();
    const addNewDeployRecipe = (recipe) => dispatch(addDeployRecipe(recipe));

    useEffect(() => {
        setRecipeName(defaultRecipeName);
    }, [showModal]);

    const getButtonLabel = () => {
        if (buttonLabel) {
            return buttonLabel;
        }
        return "Save";
    }

    const getButtonVariant = () => {
        if (buttonVariant) {
            return buttonVariant;
        }
        return "secondary";
    }

    const save = () => {
        console.log("Saving recipe: " + recipeName);
        //uuid as id
        addNewDeployRecipe({id: uuidv4(), name: recipeName, deployOptions: appDeploySlice});
        setShowModal(false);
    }

    const modalActions = [
        <Button key="cancel" onClick={close} variant="secondary">
            Cancel
        </Button>,
        <Button key="save" onClick={save} >
            Save
        </Button>
    ];

    return <React.Fragment> 
        <Modal
        variant={ModalVariant.small}
        title="Save Deploy Recipe"
        isOpen={showModal}
        showClose={canCloseModal}
        onClose={close}
        actions={modalActions}>
            <Stack hasGutter>
                <StackItem>
                    <TextContent>
                        <Text>
                            Save the deployment options as a recipe for future use.
                        </Text>
                    </TextContent>
                </StackItem>
                <StackItem>
                    <InputGroup>
                        <TextInput id="recipe-name-input" type="text" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} />
                    </InputGroup>
                </StackItem>
            </Stack>

        </Modal>
        <Button onClick={() => setShowModal(true)} isDisabled={disabled} variant={getButtonVariant()}>
            {getButtonLabel()}
        </Button>
    </React.Fragment>

}