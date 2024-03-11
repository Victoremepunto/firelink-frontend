import React, {useEffect, useState} from 'react';
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

const NamespaceDescriptionCard = ({namespace, onError = (error) => {}}) => {

  const [description, setDescription] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getNamespaceDescription();
  }, []);
  useEffect(() => {
    getNamespaceDescription();
  }, [namespace]);

  const getNamespaceDescription = async () => {
    const ns = namespace;
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching namespace description for:", ns);
      const response = await fetch(`/api/firelink/namespace/describe/${ns}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if ( data.completed === false ) {
        throw new Error(`Error fetching namespace description: ${data.message}`);
      }
      setDescription(data.message);
    } catch (error) {
      console.error("Error fetching namespace description:", error);
      console.log("Error state:", error); 
      onError(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const formatTitle = (title) => {
    return title.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (Object.keys(description).length === 0) {
    return (
      <Card>
        <CardTitle>Namespace Description</CardTitle>
        <CardBody>
          <Skeleton />
        </CardBody>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardTitle>Namespace Description</CardTitle>
        <CardBody>
          <Skeleton />
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardTitle>Namespace Description</CardTitle>
        <CardBody>
          <div>Error fetching namespace description: {error.message}</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
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
