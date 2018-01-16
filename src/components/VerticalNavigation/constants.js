import React from 'react';
import PropTypes from 'prop-types';
import { withContext, getContext, compose } from 'recompose';
import { selectKeys } from '../../common/helpers';

const itemObjectTypes = {
  title: PropTypes.string,
  iconStyleClass: PropTypes.string,
  badges: PropTypes.shape({
    badgeClass: PropTypes.string,
    tooltip: PropTypes.string,
    count: PropTypes.number,
    iconStyleClass: PropTypes.string
  }),
  subItems: PropTypes.array,
  active: PropTypes.bool,
  // You can use initialActive if you don't want to use controlled active props,
  // but you want to set the initial state of the activePath.
  initialActive: PropTypes.bool
};

// * undefined (** or '/') if coming from top-level VerticalNavigation parent
const navContextTypes = {
  idPath: PropTypes.string, // **
  depth: PropTypes.oneOf(['primary', 'secondary', 'tertiary']), // *
  primaryItem: PropTypes.shape(itemObjectTypes), // *
  secondaryItem: PropTypes.shape(itemObjectTypes), // *
  hiddenIcons: PropTypes.bool,
  pinnableMenus: PropTypes.bool,
  isMobile: PropTypes.bool,
  selectedMobileDepth: PropTypes.oneOf([null, 'primary', 'secondary']),
  activePath: PropTypes.string,
  mobilePath: PropTypes.string,
  navCollapsed: PropTypes.bool,
  pinnedSecondaryNav: PropTypes.bool,
  pinnedTertiaryNav: PropTypes.bool,
  updateNavOnMenuToggleClick: PropTypes.func,
  updateNavOnItemHover: PropTypes.func,
  updateNavOnItemBlur: PropTypes.func,
  updateNavOnItemClick: PropTypes.func,
  updateNavOnPinSecondary: PropTypes.func,
  updateNavOnPinTertiary: PropTypes.func,
  updateNavOnMobileSelection: PropTypes.func,
  clearMobileSelection: PropTypes.func,
  setActivePath: PropTypes.func,
  setMobilePath: PropTypes.func,
  forceHideSecondaryMenu: PropTypes.func,
  hoverDelay: PropTypes.number,
  hideDelay: PropTypes.number
};

const getNextDepth = depth =>
  (depth === 'primary' && 'secondary') ||
  (depth === 'secondary' && 'tertiary') ||
  'primary';

const deepestOf = (pri, sec, ter) => (pri && sec && ter) || (pri && sec) || pri;

const getItemProps = props => ({
  ...selectKeys(props, Object.keys(itemObjectTypes)),
  subItems:
    props.children &&
    React.Children.count(props.children) > 0 &&
    React.Children.map(props.children, child => getItemProps(child.props))
});

const provideNavContext = withContext(navContextTypes, providerProps => {
  // The item prop doesn't get included in context, but must be passed to the provider
  // In order to properly include primaryItem and secondaryItem in context.
  const { item, primaryItem, secondaryItem } = providerProps;
  const nextDepth = getNextDepth(providerProps.depth);
  return {
    // Only the keys that should be in context are included,
    // so it is safe to spread extra props into the provider component.
    ...selectKeys(providerProps, Object.keys(navContextTypes)),
    depth: nextDepth,
    primaryItem: nextDepth === 'secondary' ? item : primaryItem,
    secondaryItem: nextDepth === 'tertiary' ? item : secondaryItem
    // We don't need a tertiaryItem in context (see VerticalNavigationItem.getContextNavItems)
  };
});
const consumeNavContext = getContext(navContextTypes);

const NavContextProvider = provideNavContext(props => (
  <React.Fragment>{props.children}</React.Fragment>
));

// WARNING: HACK! HAAAACK HACK HACK HACK WARNING THIS IS A HACK.
// We only use this to apply magic body classes when the component is used in uncontrolled mode. TODO it's a prop now
// And only for consistency-- the better solution is to manage these classes yourself in the application.
const getBodyContentElement = () => {
  return document.querySelector('.container-pf-nav-pf-vertical');
};

export {
  getNextDepth,
  deepestOf,
  getItemProps,
  itemObjectTypes,
  navContextTypes,
  provideNavContext,
  consumeNavContext,
  NavContextProvider,
  getBodyContentElement
};
