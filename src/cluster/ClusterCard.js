import React from 'react';
import { Page, PageSection } from '@patternfly/react-core';
import TopNodesCard from './ClusterTopNodes';

const ClusterCard = () => {
    return <Page>
        <PageSection>
            <TopNodesCard />
        </PageSection>
    </Page>

};

export default ClusterCard;
