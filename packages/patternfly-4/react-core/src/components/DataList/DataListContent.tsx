import * as React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/DataList/data-list';

export interface DataListContentProps extends React.HTMLProps<HTMLElement> {
  /** Content rendered inside the DataList item */
  children?: React.ReactNode;
  /** Additional classes added to the DataList cell */
  className?: string;
  /** Identify the DataListContent item */
  id?: string;
  /** Id for the row */
  rowid?: string;
  /** Flag to show if the expanded content of the DataList item is visible */
  isHidden?: boolean;
  /** Flag to remove padding from the expandable content */
  noPadding?: boolean;
  /** Adds accessible text to the DataList toggle */
  'aria-label': string;
}

export const DataListContent: React.FunctionComponent<DataListContentProps> = ({
  className = '',
  children = null,
  id = '',
  isHidden = false,
  'aria-label': ariaLabel,
  noPadding = false,
  rowid = '',
  ...props
}: DataListContentProps) => (
  <section
    id={id}
    className={css(styles.dataListExpandableContent, className)}
    hidden={isHidden}
    aria-label={ariaLabel}
    {...props}
  >
    <div className={css(styles.dataListExpandableContentBody, noPadding && styles.modifiers.noPadding)}>{children}</div>
  </section>
);
