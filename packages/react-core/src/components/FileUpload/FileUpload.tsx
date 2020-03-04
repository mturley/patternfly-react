import * as React from 'react';
import Dropzone, { DropzoneProps } from 'react-dropzone';
import { FileUploadField, FileUploadFieldProps } from './FileUploadField';
import { readTextFile } from '../../helpers/fileUtils';

export interface FileUploadProps extends FileUploadFieldProps {
  /** Optional extra props to customize react-dropzone */
  dropzoneProps?: DropzoneProps;
}

export class FileUpload extends React.Component<FileUploadProps> {
  static defaultProps: FileUploadProps = {
    dropzoneProps: {},
    id: null as string,
    onChange: (): any => undefined,
    onBrowseButtonClick: (): any => undefined
  };

  onDropAccepted = async (acceptedFiles: File[], event: React.DragEvent<HTMLElement>) => {
    const { onChange, dropzoneProps } = this.props;
    if (acceptedFiles.length > 0) {
      const result = (await readTextFile(acceptedFiles[0])) as string;
      onChange(result, acceptedFiles[0].name, event);
    }
    dropzoneProps.onDropAccepted && dropzoneProps.onDropAccepted(acceptedFiles, event);
  };

  onDropRejected = (rejectedFiles: File[], event: React.DragEvent<HTMLElement>) => {
    const { onChange, dropzoneProps } = this.props;
    onChange('', '', event);
    dropzoneProps.onDropRejected && dropzoneProps.onDropRejected(rejectedFiles, event);
  };

  render() {
    const { id, dropzoneProps, filename, value, onChange, isReadOnly, ...props } = this.props;
    return (
      <Dropzone multiple={false} {...dropzoneProps} onDropAccepted={this.onDropAccepted}>
        {({ getRootProps, getInputProps, isDragActive, open }) => (
          <FileUploadField
            {...getRootProps({ ...props, onClick: evt => evt.preventDefault() })}
            id={id}
            filename={filename}
            value={value}
            onChange={onChange}
            isReadOnly={isReadOnly || !!filename} // A truthy filename means a real file, so no editing
            isDragActive={isDragActive}
            onBrowseButtonClick={open}
          >
            <input {...getInputProps()} /* hidden, necessary for react-dropzone */ />
          </FileUploadField>
        )}
      </Dropzone>
    );
  }
}
