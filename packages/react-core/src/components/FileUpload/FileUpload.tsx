import * as React from 'react';
import Dropzone from 'react-dropzone';
import { FileUploadField, FileUploadFieldProps } from './FileUploadField';

export interface FileUploadProps extends FileUploadFieldProps {
  foo?: string; // TODO omit some props from the inner field?
}

export class FileUpload extends React.Component<FileUploadProps> {
  onDrop = (acceptedFiles: any, rejectedFiles: any) => {
    // TODO
    console.log({ acceptedFiles, rejectedFiles }); // eslint-disable-line no-console
  };

  render() {
    const { id, ...props } = this.props;
    return (
      <Dropzone onDrop={this.onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <FileUploadField id={id} {...getRootProps({ ...props, inputProps: getInputProps(), isDragActive })} />
        )}
      </Dropzone>
    );
  }
}
