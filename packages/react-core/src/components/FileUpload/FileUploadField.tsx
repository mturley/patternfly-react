import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/FileUpload/file-upload';
import { css } from '@patternfly/react-styles';
import { Omit } from '../../helpers';
import { InputGroup } from '../InputGroup';
import { TextInput } from '../TextInput';
import { Button, ButtonVariant } from '../Button';
import { TextArea, TextAreResizeOrientation } from '../TextArea';

export interface FileUploadFieldProps extends Omit<React.HTMLProps<HTMLFormElement>, 'onChange'> {
  /** Unique id for the TextArea, also used to generate ids for accessible labels */
  id: string;
  /** Value of the file's contents */
  value?: string;
  /** Value to be shown in the read-only filename field. */
  filename?: string;
  /** A callback for when the field value changes. */
  onChange?: (
    value: string,
    filename: string,
    event:
      | React.ChangeEvent<HTMLTextAreaElement> // User typed in the TextArea
      | React.MouseEvent<HTMLButtonElement, MouseEvent> // User clicked Clear button
  ) => void;
  /** Additional classes added to the FileUploadField container element. */
  className?: string;
  /** Flag to show if the field is disabled. */
  isDisabled?: boolean;
  /** Flag to show if the field is read only. */
  isReadOnly?: boolean;
  /** Flag to show if the field is required. */
  isRequired?: boolean;
  /* Value to indicate if the field is modified to show that validation state.
   * If set to success, field will be modified to indicate valid state.
   * If set to error,  field will be modified to indicate error state.
   */
  validated?: 'success' | 'error' | 'default';
  /** Aria-label for the TextArea. */
  'aria-label'?: string;
  /** Flag to hide the TextArea. Use with children to add custom support for non-text files. */
  hideTextArea?: boolean;
  /** Additional children to render after (or instead of) the TextArea. */
  children?: React.ReactNode;
  /** A callback for when the Browse button is clicked. */
  onBrowseButtonClick?: (event: React.MouseEvent) => void;
  /** Flag to show if a file is being dragged over the field */
  isDragActive?: boolean;
  /** A reference object to attach to the FileUploadField container element. */
  containerRef?: React.Ref<any>;
}

export const FileUploadField: React.FunctionComponent<FileUploadFieldProps> = ({
  id,
  value = '',
  filename = '',
  onChange = (): any => undefined,
  onBrowseButtonClick = (): any => undefined,
  className = '',
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  isDragActive = false,
  validated = 'default' as 'success' | 'error' | 'default',
  'aria-label': ariaLabel = 'File contents',
  containerRef = null as React.Ref<any>,
  children = null,
  hideTextArea = false,
  ...props
}: FileUploadFieldProps) => {
  const onTextAreaChange = (newValue: string, event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(newValue, filename, event);
  };

  const onClearButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onChange('', '', event);
  };

  return (
    <form
      className={css(styles.fileUpload, isDragActive && styles.modifiers.dragHover, className)}
      ref={containerRef}
      {...props}
    >
      <div className={styles.fileUploadFileSelect}>
        <InputGroup>
          <TextInput
            isReadOnly // Always read-only regardless of isReadOnly prop (which is just for the TextArea)
            isDisabled={isDisabled}
            id={`${id}-filename`}
            name={`${id}-filename`}
            aria-label={filename ? 'Read only filename' : 'Drag a file here or browse to upload'} // TODO make this a prop for a11y
            placeholder="Drag a file here or browse to upload" // TODO make this a prop for a11y
            aria-describedby={`${id}-browse-button`}
            value={filename}
          />
          <Button id={`${id}-browse-button`} variant={ButtonVariant.control} onClick={onBrowseButtonClick}>
            Browse... {/* TODO make this a prop for a11y */}
          </Button>
          <Button variant={ButtonVariant.control} isDisabled={!value} onClick={onClearButtonClick}>
            Clear {/* TODO make this a prop for a11y */}
          </Button>
        </InputGroup>
      </div>
      <div className={styles.fileUploadFileDetails}>
        {!hideTextArea && (
          <TextArea
            readOnly={isReadOnly || !!filename} // A truthy filename means a real file, so no editing
            disabled={isDisabled}
            isRequired={isRequired}
            resizeOrientation={TextAreResizeOrientation.vertical}
            validated={validated}
            id={id}
            name={id} // TODO make this a prop? is it based on top-level id/name?
            aria-label={ariaLabel}
            value={value}
            onChange={onTextAreaChange}
          />
        )}
        {children}
      </div>
    </form>
  );
};
