---
title: 'File upload'
cssPrefix: 'pf-c-file-upload'
typescript: true
propComponents: ['FileUpload']
section: 'components'
beta: true
---

import { FileUpload } from '@patternfly/react-core';

## Examples

```js title=Basic isBeta
import React from 'react';
import { FileUpload } from '@patternfly/react-core';

class SimpleFileUpload extends React.Component {
  /* constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
    this.handleTextInputChange = value => {
      this.setState({ value });
    };
  } */

  render() {
    return <FileUpload />;
  }
}
```
