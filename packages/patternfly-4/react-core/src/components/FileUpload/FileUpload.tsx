import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/FileUpload/file-upload';
import { css } from '@patternfly/react-styles';
import { Omit, withInnerRef } from '../../helpers';
import { ValidatedOptions } from '../../helpers/constants';
import { InputGroup } from '../InputGroup';
import { TextInput } from '../TextInput';
import { Button, ButtonVariant } from '../Button';
import { TextArea, TextAreResizeOrientation } from '../TextArea';

// What is the main element (Not HTMLDivElement?) Should props be spread?
export interface FileUploadProps extends Omit<React.HTMLProps<HTMLDivElement>, 'onChange'> {
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
  /** Value of the input. */
  value?: string | number; // TODO do we want to include filename in the value, or use two props?
  /** Aria-label. The input requires an associated id or aria-label. */
  'aria-label'?: string;
  /** id attribute for the TextArea, also used to generate ids for accessible labels */
  id: string;
}

// TODO there should be a stateless presentational component and a stateful Dropzone component.
// TODO make sure the Dropzone version is compatible with our minimum React version (no hooks)
// TODO maybe call the stateless one "FileUploadField" and the stateful one "FileUpload"?
//      or stateless "FileUpload" and stateful "StatefulFileUpload"?

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
      // TODO specifically the value of the textarea body
      this.props.onChange(event.currentTarget.value, event);
    }
  };

  render() {
    const {
      className,
      id,
      'aria-label': ariaLabel,
      value,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onChange,
      validated,
      isReadOnly,
      isRequired,
      isDisabled,
      ...props // TODO where do we spread these? form? textarea?
    } = this.props;
    return (
      <form className={css(styles.fileUpload, className)}>
        <div className={styles.fileUploadFileSelect}>
          <InputGroup>
            <TextInput
              isReadOnly // Always read-only regardless of isReadyOnly prop
              isDisabled={isDisabled}
              id={`${id}-filename`}
              name={`${id}-filename`} // TODO make this a prop? is it required? use id?
              aria-label="Drag a file here or browse to upload" // TODO use placeholder, or 'Read only filename' after browse?
              placeholder="Drag a file here or browse to upload" // TODO make this a prop
              aria-describedby={`${id}-browse-button`} // TODO
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
            value="Foo text contents here"
          />
        </div>
      </form>
    );
  }
}
