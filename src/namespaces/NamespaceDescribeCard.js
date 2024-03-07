import React from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Skeleton
} from '@patternfly/react-core';

const NamespaceDescriptionCard = ({ description }) => {
  const formatTitle = (title) => {
    return title.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (Object.keys(description).length === 0) {
    return (
      <Card isfullHeight>
        <CardTitle>Namespace Description</CardTitle>
        <CardBody>
          <Skeleton />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card isfullHeight>
      <CardTitle>Namespace Description</CardTitle>
      <CardBody>
        <DescriptionList>
          {Object.keys(description).map((key) => {
            if (key === 'logins') {
              return description[key].map((login, index) => (
                <DescriptionListGroup key={`${key}-login-${index}`}>
                  <DescriptionListTerm>{formatTitle(key)} {index + 1}</DescriptionListTerm>
                  <DescriptionListDescription>
                    Username: {login.username}, Password: {login.password}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              ));
            } else if (typeof description[key] === 'object') {
              return (
                <DescriptionListGroup key={key}>
                  <DescriptionListTerm>{formatTitle(key)}</DescriptionListTerm>
                  <DescriptionListDescription>
                    <a href={description[key].route} target="_blank" rel="noopener noreferrer">
                      {description[key].route}
                    </a>
                    <div>Username: {description[key].login.username}, Password: {description[key].login.password}</div>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              );
            } else {
              return (
                <DescriptionListGroup key={key}>
                  <DescriptionListTerm>{formatTitle(key)}</DescriptionListTerm>
                  <DescriptionListDescription>
                    {key === 'project_url' ? (
                      <a href={description[key]} target="_blank" rel="noopener noreferrer">
                        {description[key]}
                      </a>
                    ) : (
                      description[key]
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              );
            }
          })}
        </DescriptionList>
      </CardBody>
    </Card>
  );
};

export default NamespaceDescriptionCard;
