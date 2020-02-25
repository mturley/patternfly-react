import * as React from 'react';
// import styles from '@patternfly/react-styles/css/components/FormControl/form-control';
import { css } from '@patternfly/react-styles';
import { Omit, withInnerRef } from '../../helpers';
import { ValidatedOptions } from '../../helpers/constants';

// What is the main element (Not HTMLDivElement?) Should props be spread?
export interface FileUploadProps extends Omit<React.HTMLProps<HTMLDivElement>, 'onChange'> {
  /** Additional classes added to the FileUpload container. */
  className?: string;
  /** Flag to show if the input is disabled. */
  isDisabled?: boolean; // TODO
  /** Flag to show if the input is read only. */
  isReadOnly?: boolean; // TODO
  /** Flag to show if the input is required. */
  isRequired?: boolean; // TODO
  /** Flag to show if the input is valid or invalid. This prop will be deprecated. You should use validated instead. */
  isValid?: boolean; // TODO
  /* Value to indicate if the input is modified to show that validation state.
   * If set to success, input will be modified to indicate valid state.
   * If set to error,  input will be modified to indicate error state.
   */
  validated?: 'success' | 'error' | 'default'; // TODO ?
  /** A callback for when the input value changes. */
  onChange?: (value: string, event: React.FormEvent<HTMLInputElement>) => void; // TODO, look at types
  /** Value of the input. */
  value?: string | number; // TODO
  /** Aria-label. The input requires an associated id or aria-label. */
  'aria-label'?: string; // TODO where does this go?
}

export class FileUpload extends React.Component<FileUploadProps> {
  static defaultProps: FileUploadProps = {
    'aria-label': null as string,
    className: '',
    isRequired: false,
    isValid: true,
    validated: 'default' as 'success' | 'error' | 'default',
    isDisabled: false,
    isReadOnly: false,
    onChange: (): any => undefined
  };

  constructor(props: FileUploadProps) {
    super(props);
    if (!props.id && !props['aria-label'] && !props['aria-labelledby']) {
      // eslint-disable-next-line no-console
      console.error('File upload:', 'File upload requires either an id or aria-label to be specified'); // TODO do we need this?
    }
  }

  handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      // TODO specifically the value of the textarea body
      this.props.onChange(event.currentTarget.value, event);
    }
  };

  render() {
    const {
      className,
      type,
      value,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onChange,
      isValid,
      validated,
      isReadOnly,
      isRequired,
      isDisabled,
      ...props
    } = this.props;
    return (
      <div>
        <h1>TODO: File upload component here</h1>
      </div>
      /* <input
        {...props}
        className={css(
          //styles.formControl, // TODO
          //validated === ValidatedOptions.success && styles.modifiers.success,  // TODO
          className
        )}
        onChange={this.handleChange}
        type={type}
        value={value}
        aria-invalid={!isValid || validated === ValidatedOptions.error}
        required={isRequired}
        disabled={isDisabled}
        readOnly={isReadOnly}
      /> */
    );
  }
}
