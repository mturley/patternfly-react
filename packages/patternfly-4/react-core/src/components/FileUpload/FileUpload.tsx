import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/FileUpload/file-upload';
import { css } from '@patternfly/react-styles';
import { Omit } from '../../helpers';
import { InputGroup } from '../InputGroup';
import { TextInput } from '../TextInput';
import { Button, ButtonVariant } from '../Button';
import { TextArea, TextAreResizeOrientation } from '../TextArea';

export interface FileUploadProps extends Omit<React.HTMLProps<HTMLFormElement>, 'onChange'> {
  /** Additional classes added to the FileUpload container. */
  className?: string;
  /** Flag to show if the input is disabled. */
  isDisabled?: boolean;
  /** Flag to show if the input is read only. */
  isReadOnly?: boolean;
  /** Flag to show if the input is required. */
  isRequired?: boolean;
  /* Value to indicate if the input is modified to show that validation state.
   * If set to success, input will be modified to indicate valid state.
   * If set to error,  input will be modified to indicate error state.
   */
  validated?: 'success' | 'error' | 'default';
  /** A callback for when the input value changes. */
  onChange?: (value: string, event: React.FormEvent<HTMLInputElement>) => void; // TODO, look at types
  /** Value to be shown in the read-only filename field */
  filename?: string;
  /** Value of the file's contents (TODO?) */
  value?: string; // TODO should this support non-string (custom) values?
  /** Aria-label. The input requires an associated id or aria-label. */
  'aria-label'?: string;
  /** id attribute for the TextArea, also used to generate ids for accessible labels */
  id: string;
  // TODO onBrowseButtonClick? should dropzone be a part of this? probably only in a wrapper
  // TODO onClearButtonClick? just use onChange with empty value?
}

// TODO there should be a presentational component and a Dropzone component.
// TODO make sure the Dropzone version is compatible with our minimum React version (no hooks)
// TODO maybe call the presentational one "FileUploadField" and the Dropzone one "FileUpload"?
//      this should be FileUploadField, and should take an onBrowseButtonClick button and drag/drop state props etc.
//      FileUpload should be a thin wrapper which adds Dropzone to define the onBrowseButtonClick etc.

export class FileUpload extends React.Component<FileUploadProps> {
  static defaultProps: FileUploadProps = {
    id: null as string,
    'aria-label': 'File contents' as string,
    className: '',
    isRequired: false,
    validated: 'default' as 'success' | 'error' | 'default',
    isDisabled: false,
    isReadOnly: false,
    onChange: (): any => undefined
  };

  handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      // TODO specifically the value of the textarea body? include filename?
      this.props.onChange(event.currentTarget.value, event);
    }
  };

  render() {
    const {
      className,
      id,
      'aria-label': ariaLabel,
      filename,
      value,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onChange, // TODO actually call onChange!
      validated,
      isReadOnly,
      isRequired,
      isDisabled,
      ...props
    } = this.props;
    return (
      <form className={css(styles.fileUpload, className)} {...props}>
        <div className={styles.fileUploadFileSelect}>
          <InputGroup>
            <TextInput
              isReadOnly // Always read-only regardless of isReadyOnly prop (that prop is for the TextArea)
              isDisabled={isDisabled}
              id={`${id}-filename`}
              name={`${id}-filename`} // TODO make this a prop? is it required? use id?
              aria-label={filename ? 'Read only filename' : 'Drag a file here or browse to upload'} // TODO make this a prop for a11y
              placeholder="Drag a file here or browse to upload" // TODO make this a prop for a11y
              aria-describedby={`${id}-browse-button`}
              value={filename}
            />
            <Button id={`${id}-browse-button`} variant={ButtonVariant.control}>
              Browse... {/* TODO make this a prop for a11y */}
            </Button>
            <Button variant={ButtonVariant.control} isDisabled>
              Clear {/* TODO make this a prop for a11y */}
            </Button>
          </InputGroup>
        </div>
        <div className={styles.fileUploadFileDetails}>
          <TextArea // TODO do we want to provide an alternate way to render something else for file contents?
            readOnly={isReadOnly} // TODO how does this work with drop state stuff?
            disabled={isDisabled}
            isRequired={isRequired}
            resizeOrientation={TextAreResizeOrientation.vertical}
            validated={validated}
            id={id}
            name={id} // TODO make this a prop? is it based on top-level id/name?
            aria-label={ariaLabel}
            value={value}
          />
        </div>
      </form>
    );
  }
}
