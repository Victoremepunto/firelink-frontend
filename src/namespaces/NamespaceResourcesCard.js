import React from 'react';
import { Card, CardBody, CardTitle, Split, SplitItem } from '@patternfly/react-core';
import ResourceUsageProgress from '../namespaces/ResourceUsageProgress';

const NamespaceResourcesCard = ({namespace}) => {

  return (<React.Fragment>
    { namespace ? <Card>
      <CardTitle>Resources</CardTitle>
      <CardBody>
        <Split hasGutter>
            <SplitItem isFilled>
                <ResourceUsageProgress namespace={namespace} resource="cpu" showDetails={true}/>
            </SplitItem>
            <SplitItem isFilled>
                <ResourceUsageProgress namespace={namespace} resource="memory" showDetails={true} />
            </SplitItem>
        </Split>
      </CardBody>
    </Card> : <div/> }
    </React.Fragment>
  );
};

export default NamespaceResourcesCard;
