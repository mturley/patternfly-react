import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/DataToolbar/data-toolbar';
import { css } from '@patternfly/react-styles';

export interface DataToolbarProps extends React.HTMLProps<HTMLDivElement> {
  /** Classes applied to root element of the Data toolbar */
  className?: string;
  /** Content to be rendered as rows in the Data toolbar */
  children?: React.ReactNode;
  /** Id of the Data toolbar */
  id: string;
}

export class DataToolbar extends React.Component<DataToolbarProps> {

  render() {
    const {
      className,
      children,
      id,
      ...props
    } = this.props;

    return (
      <div className={css(styles.dataToolbar, className)} id={id} {...props}>
        {children}
      </div>
    );
  }
}
