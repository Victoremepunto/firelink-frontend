import {
    QuestionCircleIcon,
} from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';
import React from 'react';

export default function HelpTip({content}) {
    return <Tooltip content={content}>
        <QuestionCircleIcon /> 
    </Tooltip>
}