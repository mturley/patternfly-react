---
title: 'File upload'
cssPrefix: 'pf-c-file-upload'
typescript: true
propComponents: ['FileUpload', 'FileUploadField']
section: 'components'
beta: true
---

import { FileUpload, Form, FormGroup, FileUploadField, Checkbox } from '@patternfly/react-core';

## Examples

The basic `FileUpload` component can handle simple text files via browse or drag-and-drop, loading them into memory and passing their contents as a string to an `onChange` prop.

```js title=Simple-text-file isBeta
import React from 'react';
import { FileUpload } from '@patternfly/react-core';

class SimpleTextFileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', filename: '' };
    this.handleFileChange = (value, filename, event) => {
      this.setState({ value, filename });
    };
  }

  render() {
    const { value, filename } = this.state;
    return <FileUpload id="simple-text-file" value={value} filename={filename} onChange={this.handleFileChange} />;
  }
}
```

Any [props accepted by `react-dropzone`'s `Dropzone` component](https://react-dropzone.js.org/#!/Dropzone) can be passed as a `dropzoneProps` object in order to customize the behavior of the Dropzone, such as restricting the size and type of files allowed. This example will only accept CSV files smaller than 1 KB.

```js title=Simple-text-file-with-restrictions isBeta
import React from 'react';
import { FileUpload, Form, FormGroup } from '@patternfly/react-core';

class SimpleTextFileUploadWithRestrictions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', filename: '', rejected: false };
    this.handleFileChange = (value, filename, event) => {
      this.setState({ value, filename, rejected: false });
    };
    this.handleFileRejected = (rejectedFiles, event) => {
      this.setState({ rejected: true });
    };
  }

  render() {
    const { value, filename, rejected } = this.state;
    return (
      <Form>
        <FormGroup
          fieldId="simple-text-file-with-restrictions"
          helperText="Upload a CSV file"
          helperTextInvalid="Must be a CSV file no larger than 1 KB"
          validated={rejected ? 'error' : 'default'}
        >
          <FileUpload
            id="simple-text-file-with-restrictions"
            value={value}
            filename={filename}
            onChange={this.handleFileChange}
            dropzoneProps={{
              accept: '.csv',
              maxSize: 1024,
              onDropRejected: this.handleFileRejected
            }}
            validated={rejected ? 'error' : 'default'}
          />
        </FormGroup>
      </Form>
    );
  }
}
```

`FileUpload` is a thin wrapper around the `FileUploadField` presentational component. If you need to implement your own logic for accepting, reading or displaying files, you can instead render a `FileUploadField` directly, which does not include `react-dropzone` and requires additional props (e.g. `onBrowseButtonClick`, `onClearButtonClick`, `isDragActive`).

```js title=Custom-file-upload isBeta
import React from 'react';
import { FileUploadField, Checkbox } from '@patternfly/react-core';

class CustomFileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      clearButtonDisabled: true,
      isLoading: false,
      isDragActive: false,
      hideTextArea: false,
      children: false
    };
    this.handleTextAreaChange = value => {
      this.setState({ value });
    };
  }

  render() {
    const { value, clearButtonDisabled, isLoading, isDragActive, hideTextArea, children } = this.state;
    return (
      <div>
        {['clearButtonDisabled', 'isLoading', 'isDragActive', 'hideTextArea', 'children'].map(stateKey => (
          <Checkbox
            key={stateKey}
            id={stateKey}
            label={stateKey}
            aria-label={stateKey}
            isChecked={this.state[stateKey]}
            onChange={checked => this.setState({ [stateKey]: checked })}
          />
        ))}
        <br />
        <FileUploadField
          id="custom-file-upload"
          value={value}
          filename=""
          onChange={this.handleTextAreaChange}
          filenamePlaceholder="Do something custom with this!"
          onBrowseButtonClick={() => alert('Browse button clicked!')}
          onClearButtonClick={() => alert('Clear button clicked!')}
          clearButtonDisabled={clearButtonDisabled}
          isLoading={isLoading}
          isDragActive={isDragActive}
          hideTextArea={hideTextArea}
        >
          {children && <p>(A custom preview of the uploaded file can be passed as children)</p>}
        </FileUploadField>
      </div>
    );
  }
}
```
