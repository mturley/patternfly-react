import * as React from 'react';

export interface TreeProps extends React.HTMLProps<HTMLDivElement> {
  /** Additional classes added to the Tree. */
  className?: string;
}

export const Tree: React.FunctionComponent<TreeProps> = ({ className = '', ...props }) => (
  <div {...props}>
    <h1>TODO: implement a tree here</h1>
  </div>
);
