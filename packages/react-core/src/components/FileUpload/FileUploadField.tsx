import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/FileUpload/file-upload';
import { css } from '@patternfly/react-styles';
import { Omit } from '../../helpers';
import { InputGroup } from '../InputGroup';
import { TextInput } from '../TextInput';
import { Button, ButtonVariant } from '../Button';
import { TextArea, TextAreResizeOrientation } from '../TextArea';
import { Spinner, spinnerSize } from '../Spinner';

export interface FileUploadFieldProps extends Omit<React.HTMLProps<HTMLDivElement>, 'onChange'> {
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
  /** Flag to show if a file is being loaded. */
  isLoading?: boolean;
  /** Aria-valuetext for the loading spinner */
  spinnerAriaValueText?: string;
  /** Flag to show if the field is required. */
  isRequired?: boolean;
  /* Value to indicate if the field is modified to show that validation state.
   * If set to success, field will be modified to indicate valid state.
   * If set to error,  field will be modified to indicate error state.
   */
  validated?: 'success' | 'error' | 'default';
  /** Aria-label for the TextArea. */
  'aria-label'?: string;
  /** Placeholder string to display in the empty filename field */
  filenamePlaceholder?: string;
  /** Aria-label for the read-only filename field */
  filenameAriaLabel?: string;
  /** Text for the Browse button */
  browseButtonText?: string;
  /** Text for the Clear button */
  clearButtonText?: string;
  /** Flag to disable the Clear button */
  clearButtonDisabled?: boolean;
  /** Flag to hide the TextArea. Use with children to add custom support for non-text files. */
  hideTextArea?: boolean;
  /** Additional children to render after (or instead of) the TextArea. */
  children?: React.ReactNode;
  /** A callback for when the Browse button is clicked. */
  onBrowseButtonClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /** A callback for when the Clear button is clicked. */
  onClearButtonClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
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
  onClearButtonClick = (): any => undefined,
  className = '',
  isDisabled = false,
  isReadOnly = false,
  isLoading = false,
  spinnerAriaValueText,
  isRequired = false,
  isDragActive = false,
  validated = 'default' as 'success' | 'error' | 'default',
  'aria-label': ariaLabel = 'File upload',
  filenamePlaceholder = 'Drag a file here or browse to upload',
  filenameAriaLabel = filename ? 'Read only filename' : filenamePlaceholder,
  browseButtonText = 'Browse...',
  clearButtonText = 'Clear',
  clearButtonDisabled = !filename && !value,
  containerRef = null as React.Ref<any>,
  children = null,
  hideTextArea = false,
  ...props
}: FileUploadFieldProps) => {
  const onTextAreaChange = (newValue: string, event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(newValue, filename, event);
  };

  return (
    <div
      className={css(
        styles.fileUpload,
        isDragActive && styles.modifiers.dragHover,
        isLoading && styles.modifiers.loading,
        className
      )}
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
            aria-label={filenameAriaLabel}
            placeholder={filenamePlaceholder}
            aria-describedby={`${id}-browse-button`}
            value={filename}
          />
          <Button
            id={`${id}-browse-button`}
            variant={ButtonVariant.control}
            onClick={onBrowseButtonClick}
            isDisabled={isDisabled}
          >
            {browseButtonText}
          </Button>
          <Button
            variant={ButtonVariant.control}
            isDisabled={isDisabled || clearButtonDisabled}
            onClick={onClearButtonClick}
          >
            {clearButtonText}
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
            name={id}
            aria-label={ariaLabel}
            value={value}
            onChange={onTextAreaChange}
          />
        )}
        {isLoading && (
          <div className={styles.fileUploadFileDetailsSpinner}>
            <Spinner size={spinnerSize.lg} aria-valuetext={spinnerAriaValueText} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
