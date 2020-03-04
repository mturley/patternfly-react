import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/FileUpload/file-upload';
import { css } from '@patternfly/react-styles';
import { Omit, withInnerRef } from '../../helpers';
import { InputGroup } from '../InputGroup';
import { TextInput, TextInputProps } from '../TextInput';
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
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void; // TODO, look at types
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
  /** Additional children to render inside the <form> container element. */
  children?: React.ReactNode;
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
    onBrowseButtonClick: (): any => undefined
  };

  handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      // TODO specifically the value of the textarea body? include filename?
      // this.props.onChange(event.currentTarget.value, event);
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
      isDragActive,
      isDisabled,
      innerRef,
      children,
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
        {children}
      </form>
    );
  }
}

const FileUploadFieldFR = withInnerRef<HTMLFormElement, FileUploadFieldProps>(FileUploadFieldBase);
export { FileUploadFieldFR as FileUploadField, FileUploadFieldBase };
