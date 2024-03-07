import React from 'react';
import { Card, CardBody, CardTitle, Stack, StackItem } from '@patternfly/react-core';
import ResourceUsageProgress from '../namespaces/ResourceUsageProgress';

const NamespaceResourcesCard = ({namespace}) => {

  return (<React.Fragment>
    { namespace ? <Card>
      <CardTitle>Resources</CardTitle>
      <CardBody>
        <Stack hasGutter>
            <StackItem>
                <ResourceUsageProgress namespace={namespace} resource="cpu" showDetails={true}/>
            </StackItem>
            <StackItem>
                <ResourceUsageProgress namespace={namespace} resource="memory" showDetails={true} />
            </StackItem>
        </Stack>
      </CardBody>
    </Card> : <div/> }
    </React.Fragment>
  );
};

export default NamespaceResourcesCard;
