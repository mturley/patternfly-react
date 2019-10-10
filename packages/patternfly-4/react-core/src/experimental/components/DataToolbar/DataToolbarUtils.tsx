import * as React from 'react';
import { RefObject } from 'react';

interface DataToolbarContextProps {
  isExpanded: boolean;
  toggleIsExpanded: () => void;
  expandableContentRef: RefObject<HTMLDivElement>;
  expandableContentId: string;
  chipGroupContentRef: RefObject<HTMLDivElement>;
  updateNumberFilters: (categoryName: string, numberOfFilters: number) => void;
}

export const DataToolbarContext = React.createContext<Partial<DataToolbarContextProps>>({
  isExpanded: false,
  toggleIsExpanded: () => {},
  expandableContentRef: null,
  expandableContentId: "",
  chipGroupContentRef: null,
  updateNumberFilters: (categoryName: string, numberOfFilters: number) => {},
});

export interface DataToolbarBreakpointMod {
  /** The attribute to modify  */
  modifier:
    | 'hidden'
    | 'visible'
    | 'align-right'
    | 'align-left'
    | 'spacer-none'
    | 'spacer-sm'
    | 'spacer-md'
    | 'spacer-lg'
    | 'space-items-none'
    | 'space-items-sm'
    | 'space-items-md'
    | 'space-items-lg';
  /** The breakpoint at which to apply the modifier */
  breakpoint: 'md' | 'lg' | 'xl' | '2xl';
}
