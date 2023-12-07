import React, {useContext } from 'react';
import {Title, TitleSizes, TextInput} from '@patternfly/react-core';
import { AppContext } from "./shared/ContextProvider";

export default function Settings() {
    const [AppState] = useContext(AppContext);

    return <div>
        <Title headingLevel="h1" size={TitleSizes['3xl']}>
            <TextInput id="requester-input" value={AppState.requester} onChange={(e) => {
                AppState.update({requester: e})
            }} />
        </Title>
    </div>
}