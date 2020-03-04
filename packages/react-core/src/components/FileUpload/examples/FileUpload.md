---
title: 'File upload'
cssPrefix: 'pf-c-file-upload'
typescript: true
propComponents: ['FileUpload', 'FileUploadField']
section: 'components'
beta: true
---

import { FileUpload } from '@patternfly/react-core';

## Examples

The basic `FileUpload` component can handle simple text files. It uses the `react-dropzone` library to provide the file browse dialog and drag/drop behavior. Any props accepted by `react-dropzone` can be passed as a `dropzoneProps` object in order to customize the behavior of the Dropzone.

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
    return <FileUpload value={value} filename={filename} onChange={this.handleFileChange} />;
  }
}
```

`FileUpload` is a thin wrapper around the `FileUploadField` presentational component. If you need to implement your own logic for reading or displaying a file, you can instead render a `FileUploadField` directly, which requires additional props (you must implement your own `onBrowseButtonClick` handler, etc).
