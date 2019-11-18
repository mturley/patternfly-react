import * as React from 'react';

export interface TreeProps extends React.HTMLProps<HTMLTableElement> {
  /** Additional classes added to the Tree. */
  className?: string;
}

// TODO add basic expandable CSS
// TODO figure out how to indent additional rows inside the expanded content (same table though!)
// TODO what's the deal with tbody? only top-level containers?

export const Tree: React.FunctionComponent<TreeProps> = ({ className = '', ...props }) => (
  <table className="pf-c-table pf-m-grid-lg" role="grid" {...props}>
    <thead>
      <tr>
        <td />
        <th scope="col">Column 1</th>
        <th scope="col">Column 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="pf-c-table__check">
          <input type="checkbox" name="item-1" aria-labelledby="item-1-label" />
        </td>
        <th data-label="Item 1">
          <div id="item-1-label">Item 1</div>
        </th>
        <td data-label="Info">Info 1</td>
      </tr>
      <tr>
        <td className="pf-c-table__check">
          <input type="checkbox" name="item-2" aria-labelledby="item-2-label" />
        </td>
        <th data-label="Item 2">
          <div id="item-2-label">Item 2</div>
        </th>
        <td data-label="Info">Info 2</td>
      </tr>
    </tbody>
  </table>
);
