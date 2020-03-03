import * as React from 'react';
import Dropzone from 'react-dropzone';
import { BaseFileUpload } from './BaseFileUpload';
export class FileUpload extends React.Component {
  onDrop = (acceptedFiles, rejectedFiles) => {
    // TODO
    console.log({ acceptedFiles, rejectedFiles });
  };

  // TODO prop types
  render() {
    return (
      <Dropzone onDrop={this.onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => {
          console.log({ rootProps: getRootProps(), inputProps: getInputProps() });
          return null;
          // <BaseFileUpload {...getRootProps({ ...this.props, inputProps: getInputProps(), isDragActive })} />
        }}
      </Dropzone>
    );
  }
}
