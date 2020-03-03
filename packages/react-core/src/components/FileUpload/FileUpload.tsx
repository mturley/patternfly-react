import * as React from 'react';
import { BaseFileUpload } from './BaseFileUpload';
export class FileUpload extends React.Component {
  // TODO prop types
  render() {
    return <BaseFileUpload {...this.props} />;
  }
}
