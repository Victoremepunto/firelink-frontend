import React, { useEffect, useState } from 'react';
import {
    Chip,
    ChipGroup,
    Stack,
    StackItem,
    Button,
    Split,
    SplitItem,
    Modal,
    ModalVariant,
    DualListSelector,

} from '@patternfly/react-core';
import { useDispatch, useSelector } from 'react-redux';
import { 
    getAppDeployComponents, 
    getAppNames 
} from '../store/AppDeploySlice';

export default function AppDeployRemoveSelector({title, value, onSelect}) {
    const dispatch = useDispatch();

    const apps = useSelector(getAppNames);
    const components = useSelector(getAppDeployComponents);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    }

    const [availableOptions, setAvailableOptions] = useState([]);
    const [chosenOptions, setChosenOptions] = useState([]);

    const generateOptions = () => {
        return [
            {
                id: 'apps',
                text: 'Apps',
                isChecked: false,
                checkProps: {
                'aria-label': 'Apps'
                },
                hasBadge: true,
                badgeProps: {
                isRead: true
                },
                children: apps.map((app, index) => (
                    {
                        id: crypto.randomUUID(),
                        text: "app:" + app,
                        isChecked: false,
                        checkProps: {
                          'aria-label': 'app:' + app
                        }
                      }
                ))
            },
            {
                id: 'components',
                text: 'Components',
                isChecked: false,
                checkProps: {
                'aria-label': 'Components'
                },
                hasBadge: true,
                badgeProps: {
                isRead: true
                },
                children: components.map((component, index) => (
                    {
                        id: crypto.randomUUID(),
                        text: component,
                        isChecked: false,
                        checkProps: {
                          'aria-label': component
                        }
                    }
                ))
            },    
        ]
    }   

    useEffect(() => {
        setAvailableOptions(generateOptions());
    }, [apps, components]);

    const onListChange = (event, newAvailableOptions, newChosenOptions) => {
        setAvailableOptions(newAvailableOptions.sort());
        setChosenOptions(newChosenOptions.sort());
    };

    useEffect(() => {
        // first we need to get the .children from each object in chosenOptions
        // then we need to get the .text from each of those children
        // then we need to call onSelect with the result
        const children = chosenOptions.map((option) => option.children);
        const childrenText = children.map((child) => child.map((option) => option.text));
        const flattened = childrenText.flat();
        onSelect(flattened);
    }, [chosenOptions]);


    const OptionSelectModal = () => {
        return <Modal
        variant={ModalVariant.medium}
        title={title}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        ouiaId="BasicModal">
           <Stack hasGutter>
                <StackItem>
                    <DualListSelector isSearchable isTree availableOptions={availableOptions} chosenOptions={chosenOptions} onListChange={onListChange} id="dual-list-selector-tree" />
                </StackItem>
           </Stack>
      </Modal>
    }

    const reset = () => {
        setChosenOptions([]);
        setAvailableOptions(generateOptions());
    }

    return <React.Fragment>
        <OptionSelectModal />
        <Stack>
            <StackItem>
                {title}
            </StackItem>
            <StackItem>
                <ChipGroup>
                    {value.map((currentChip) => (
                        <Chip key={currentChip} >
                            {currentChip}
                        </Chip>
                    ))}
                </ChipGroup>
            </StackItem>
            <StackItem>
                <Split>
                    <SplitItem isFilled>
                    </SplitItem>
                    <SplitItem>
                        <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>Modify</Button>
                    </SplitItem>
                    <SplitItem>
                        <Button size="sm" variant="primary" onClick={reset}>Reset</Button>
                    </SplitItem>
                </Split>
            </StackItem>
        </Stack>
    </React.Fragment>
}