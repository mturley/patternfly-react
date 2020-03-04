import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/FileUpload/file-upload';
import { css } from '@patternfly/react-styles';
import { Omit, withInnerRef } from '../../helpers';
import { InputGroup } from '../InputGroup';
import { TextInput } from '../TextInput';
import { Button, ButtonVariant } from '../Button';
import { TextArea, TextAreResizeOrientation } from '../TextArea';

export interface FileUploadFieldProps extends Omit<React.HTMLProps<HTMLFormElement>, 'onChange'> {
  /** Additional classes added to the FileUpload container. */
  className?: string;
  /** Flag to show if the field is disabled. */
  isDisabled?: boolean;
  /** Flag to show if the field is read only. */
  isReadOnly?: boolean;
  /** Flag to show if the field is required. */
  isRequired?: boolean;
  /** Flag to show styles while a file is actively being dragged over the field */
  isDragActive?: boolean;
  /* Value to indicate if the field is modified to show that validation state.
   * If set to success, field will be modified to indicate valid state.
   * If set to error,  field will be modified to indicate error state.
   */
  validated?: 'success' | 'error' | 'default';
  /** A callback for when the field value changes. */
  onChange?: (
    value: string,
    filename: string,
    event:
      | React.DragEvent<HTMLElement> // User dragged/dropped a file
      | React.ChangeEvent<HTMLTextAreaElement> // User typed in the TextArea
      | React.MouseEvent<HTMLButtonElement, MouseEvent> // User clicked Clear button
  ) => void;
  /** Value to be shown in the read-only filename field */
  filename?: string;
  /** Value of the file's contents (TODO?) */
  value?: string; // TODO should this support non-string (custom) values?
  /** Aria-label. The field requires an associated id or aria-label. */
  'aria-label'?: string;
  /** id attribute for the TextArea, also used to generate ids for accessible labels */
  id: string;
  /** A reference object to attach to the <form> container element. */
  innerRef?: React.Ref<any>;
  /** Additional children to render after (or instead of) the TextArea. */
  children?: React.ReactNode;
  /** Flag to hide the TextArea. Use with children to add custom support for non-text files. */
  hideTextArea?: boolean;
  onBrowseButtonClick: (event: React.MouseEvent) => void;
  // TODO onClearButtonClick? just use onChange with empty value?
}

class FileUploadFieldBase extends React.Component<FileUploadFieldProps> {
  static defaultProps: FileUploadFieldProps = {
    id: null as string,
    'aria-label': 'File contents' as string,
    className: '',
    isRequired: false,
    validated: 'default' as 'success' | 'error' | 'default',
    isDisabled: false,
    isReadOnly: false,
    onChange: (): any => undefined,
    children: null,
    hideTextArea: false,
    onBrowseButtonClick: (): any => undefined
  };

  handleChange = (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { filename, onChange } = this.props;
    onChange(value, filename, event);
  };

  clear = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.props.onChange('', '', event);
  };

  render() {
    const {
      className,
      id,
      'aria-label': ariaLabel,
      filename,
      value,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onChange,
      validated,
      isReadOnly,
      isRequired,
      isDragActive,
      isDisabled,
      innerRef,
      children,
      hideTextArea,
      onBrowseButtonClick,
      ...props
    } = this.props;
    return (
      <form
        className={css(styles.fileUpload, isDragActive && styles.modifiers.dragHover, className)}
        ref={innerRef}
        {...props}
      >
        <div className={styles.fileUploadFileSelect}>
          <InputGroup>
            <TextInput
              isReadOnly // Always read-only regardless of isReadOnly prop (which is just for the TextArea)
              isDisabled={isDisabled}
              id={`${id}-filename`}
              name={`${id}-filename`} // TODO make this a prop? is it required?
              aria-label={filename ? 'Read only filename' : 'Drag a file here or browse to upload'} // TODO make this a prop for a11y
              placeholder="Drag a file here or browse to upload" // TODO make this a prop for a11y
              aria-describedby={`${id}-browse-button`}
              value={filename}
            />
            <Button id={`${id}-browse-button`} variant={ButtonVariant.control} onClick={onBrowseButtonClick}>
              Browse... {/* TODO make this a prop for a11y */}
            </Button>
            <Button variant={ButtonVariant.control} isDisabled={!value} onClick={this.clear}>
              Clear {/* TODO make this a prop for a11y */}
            </Button>
          </InputGroup>
        </div>
        <div className={styles.fileUploadFileDetails}>
          {!hideTextArea && (
            <TextArea
              readOnly={isReadOnly}
              disabled={isDisabled}
              isRequired={isRequired}
              resizeOrientation={TextAreResizeOrientation.vertical}
              validated={validated}
              id={id}
              name={id} // TODO make this a prop? is it based on top-level id/name?
              aria-label={ariaLabel}
              value={value}
              onChange={this.handleChange}
            />
          )}
          {children}
        </div>
      </form>
    );
  }
}

// TODO maybe we don't need withInnerRef if we use the refKey option in react-dropzone?
const FileUploadFieldFR = withInnerRef<HTMLFormElement, FileUploadFieldProps>(FileUploadFieldBase);
export { FileUploadFieldFR as FileUploadField, FileUploadFieldBase };
