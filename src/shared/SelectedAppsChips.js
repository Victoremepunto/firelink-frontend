import React from 'react';

import {
    Chip,
    ChipGroup,
} from '@patternfly/react-core';

import { useDispatch, useSelector } from 'react-redux';

import {
    getAppNames,
} from '../store/AppDeploySlice';

export default function SelectedAppsChips({appList}) {

    const apps = useSelector(getAppNames);

    const Chips = () => {
        if (apps.length === 0) {
            return <ChipGroup categoryName='Selected Apps'>
                <Chip key='empty' isReadOnly>
                    None
                </Chip>
            </ChipGroup>;
        }
        if (appList) {
            return <ChipGroup categoryName='Selected Apps'>
                {appList.map(currentChip => <Chip key={currentChip} isReadOnly>
                    {currentChip}
                </Chip>)}
            </ChipGroup>;
        }
        return <ChipGroup categoryName='Selected Apps'>
            {apps.map(currentChip => <Chip key={currentChip} isReadOnly>
                {currentChip}
            </Chip>)}
        </ChipGroup>;
    }

    return < Chips />;
}