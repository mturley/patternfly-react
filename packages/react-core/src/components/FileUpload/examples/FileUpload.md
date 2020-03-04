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

```js title=Basic isBeta
import React from 'react';
import { FileUpload } from '@patternfly/react-core';

class SimpleFileUpload extends React.Component {
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
