import React, { useState, useEffect } from 'react';
import { TextInput, FormGroup, FormHelperText, Button } from '@patternfly/react-core';
import { TimesCircleIcon } from '@patternfly/react-icons';

export default function ImageTagInput({ imageTag, onImageTagChange, onDelete }) {
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    validateImageTag(imageTag);
  }, [imageTag]);

  const validateImageTag = (tag) => {
    const pattern = /^quay\.io\/[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+=[a-zA-Z0-9._\-:]+$/;
    setIsValid(pattern.test(tag));
  };

  const handleInputChange = (_event, value) => {
    onImageTagChange(value);
    validateImageTag(value);
  };

  return (
    <FormGroup
      label=""
      fieldId="image-tag-input"
      helperTextInvalid="Image tag override is malformed."
      validated={isValid ? 'default' : 'error'}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextInput
          id="image-tag-input"
          value={imageTag}
          onChange={handleInputChange}
          validated={isValid ? 'default' : 'error'}
          style={{ flex: 1 }}
        />
        <Button variant="danger" onClick={onDelete} style={{ marginLeft: '8px' }}>
          <TimesCircleIcon />
        </Button>
      </div>
      {!isValid && <FormHelperText isError>Image tag override is malformed.</FormHelperText>}
    </FormGroup>
  );
}
