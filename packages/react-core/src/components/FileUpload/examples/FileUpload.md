---
title: 'File upload'
cssPrefix: 'pf-c-file-upload'
typescript: true
propComponents: ['FileUpload', 'FileUploadField']
section: 'components'
beta: true
---

import { FileUpload, Form, FormGroup, FileUploadField, Checkbox } from '@patternfly/react-core';
import FileUploadIcon from '@patternfly/react-icons/dist/js/icons/file-upload-icon';

## Examples

The basic `FileUpload` component can accept a file via browse or drag-and-drop, and behaves like a standard form field with its `value` and `onChange` props. The `type` prop determines how the `FileUpload` component behaves upon accepting a file, what type of value it passes to its `onChange` prop, and what type it expects for its `value` prop.

### Text files

If `type="text"` is passed, a `TextArea` preview will be rendered underneath the filename bar. When a file is selected, its contents will be read into memory and passed to the `onChange` prop as a string (along with its filename). Typing/pasting text in the box will also call `onChange` with a string, and a string value is expected for the `value` prop.

```js title=Simple-text-file
import React from 'react';
import { FileUpload } from '@patternfly/react-core';

class SimpleTextFileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', filename: '', isLoading: false };
    this.handleFileChange = (value, filename, event) => this.setState({ value, filename });
    this.handleFileReadStarted = fileHandle => this.setState({ isLoading: true });
    this.handleFileReadFinished = fileHandle => this.setState({ isLoading: false });
  }

  render() {
    const { value, filename, isLoading } = this.state;
    return (
      <FileUpload
        id="simple-text-file"
        type="text"
        value={value}
        filename={filename}
        onChange={this.handleFileChange}
        onReadStarted={this.handleFileReadStarted}
        onReadFinished={this.handleFileReadFinished}
        isLoading={isLoading}
      />
    );
  }
}
```

Any [props accepted by `react-dropzone`'s `Dropzone` component](https://react-dropzone.js.org/#!/Dropzone) can be passed as a `dropzoneProps` object in order to customize the behavior of the Dropzone, such as restricting the size and type of files allowed. This example will only accept CSV files smaller than 1 KB:

```js title=Simple-text-file-with-restrictions
import React from 'react';
import { FileUpload, Form, FormGroup } from '@patternfly/react-core';

class SimpleTextFileUploadWithRestrictions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', filename: '', isLoading: false, isRejected: false };
    this.handleFileChange = (value, filename, event) => {
      this.setState({ value, filename, isRejected: false });
    };
    this.handleFileRejected = (rejectedFiles, event) => this.setState({ isRejected: true });
    this.handleFileReadStarted = fileHandle => this.setState({ isLoading: true });
    this.handleFileReadFinished = fileHandle => this.setState({ isLoading: false });
  }

  render() {
    const { value, filename, isLoading, isRejected } = this.state;
    return (
      <FileUpload
        id="simple-text-file-with-restrictions"
        type="text"
        value={value}
        filename={filename}
        onChange={this.handleFileChange}
        onReadStarted={this.handleFileReadStarted}
        onReadFinished={this.handleFileReadFinished}
        isLoading={isLoading}
        dropzoneProps={{
          accept: '.csv',
          maxSize: 1024,
          onDropRejected: this.handleFileRejected
        }}
        validated={isRejected ? 'error' : 'default'}
        message={isRejected ? 'Must be a CSV file no larger than 1 KB' : 'Upload a CSV file'}
      />
    );
  }
}
```

### Other file types

If no `type` prop is specified, the component will not read files directly. When a file is selected, a [`File` object](https://developer.mozilla.org/en-US/docs/Web/API/File) will be passed to `onChange` and your application will be responsible for reading from it (e.g. by using the [FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader) or attaching it to a [FormData object](https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects)). A `File` object will also be expected for the `value` prop instead of a string, and no preview of the file contents will be shown by default. The `onReadStarted` and `onReadFinished` callbacks will also not be called since the component is not reading the file.

```js title=Simple-file-of-any-format
import React from 'react';
import { FileUpload } from '@patternfly/react-core';

class SimpleFileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: null, filename: '' };
    this.handleFileChange = (value, filename, event) => this.setState({ value, filename });
  }

  render() {
    const { value, filename } = this.state;
    return <FileUpload id="simple-file" value={value} filename={filename} onChange={this.handleFileChange} />;
  }
}
```

### Customizing the file preview

Regardless of `type`, the preview area (the TextArea, or any future implementations of default previews for other types) can be removed by passing `hideDefaultPreview`, and a custom one can be rendered by passing `children`.

```js title=Custom-file-preview
import React from 'react';
import { FileUpload } from '@patternfly/react-core';
import FileUploadIcon from '@patternfly/react-icons/dist/js/icons/file-upload-icon';

class SimpleFileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: null, filename: '' };
    this.handleFileChange = (value, filename, event) => this.setState({ value, filename });
  }

  render() {
    const { value, filename, isLoading } = this.state;
    return (
      <FileUpload
        id="simple-file"
        value={value}
        filename={filename}
        onChange={this.handleFileChange}
        hideDefaultPreview
      >
        {value && (
          <h1>
            <FileUploadIcon size="lg" />
            Custom preview here for your {value.size}-byte file named {value.name}
          </h1>
        )}
      </FileUpload>
    );
  }
}
```

### Bringing your own file browse logic

`FileUpload` is a thin wrapper around the `FileUploadField` presentational component. If you need to implement your own logic for accepting files, you can instead render a `FileUploadField` directly, which does not include `react-dropzone` and requires additional props (e.g. `onBrowseButtonClick`, `onClearButtonClick`, `isDragActive`).

```js title=Custom-file-upload
import React from 'react';
import { FileUploadField, Checkbox } from '@patternfly/react-core';

class CustomFileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      filename: false,
      isClearButtonDisabled: true,
      isLoading: false,
      isDragActive: false,
      hideDefaultPreview: false,
      children: false
    };
    this.handleTextAreaChange = value => {
      this.setState({ value });
    };
  }

  render() {
    const {
      value,
      filename,
      isClearButtonDisabled,
      isLoading,
      isDragActive,
      hideDefaultPreview,
      children
    } = this.state;
    return (
      <div>
        {['filename', 'isClearButtonDisabled', 'isLoading', 'isDragActive', 'hideDefaultPreview', 'children'].map(
          stateKey => (
            <Checkbox
              key={stateKey}
              id={stateKey}
              label={stateKey}
              aria-label={stateKey}
              isChecked={this.state[stateKey]}
              onChange={checked => this.setState({ [stateKey]: checked })}
            />
          )
        )}
        <br />
        <FileUploadField
          id="custom-file-upload"
          type="text"
          value={value}
          filename={filename ? 'example-filename.txt' : ''}
          onChange={this.handleTextAreaChange}
          filenamePlaceholder="Do something custom with this!"
          onBrowseButtonClick={() => alert('Browse button clicked!')}
          onClearButtonClick={() => alert('Clear button clicked!')}
          isClearButtonDisabled={isClearButtonDisabled}
          isLoading={isLoading}
          isDragActive={isDragActive}
          hideDefaultPreview={hideDefaultPreview}
        >
          {children && <p>(A custom preview of the uploaded file can be passed as children)</p>}
        </FileUploadField>
      </div>
    );
  }
}
```
