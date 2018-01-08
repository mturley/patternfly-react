import React from 'react';
import PropTypes from 'prop-types';
import { withContext, getContext, compose } from 'recompose';

const itemObjectTypes = {
  title: PropTypes.string,
  mobileItem: PropTypes.bool,
  iconStyleClass: PropTypes.string,
  badges: PropTypes.shape({
    badgeClass: PropTypes.string,
    tooltip: PropTypes.string,
    count: PropTypes.number,
    iconStyleClass: PropTypes.string
  }),
  subItems: PropTypes.array
};

const itemContextTypes = {
  hiddenIcons: PropTypes.bool,
  pinnableMenus: PropTypes.bool,
  depth: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
  primaryItem: PropTypes.shape(itemObjectTypes),
  secondaryItem: PropTypes.shape(itemObjectTypes),
  updateNavOnItemHover: PropTypes.func,
  updateNavOnItemBlur: PropTypes.func,
  updateNavOnItemClick: PropTypes.func,
  mobileLayout: PropTypes.bool,
  navCollapsed: PropTypes.bool,
  pinnedSecondaryNav: PropTypes.bool,
  pinnedTertiaryNav: PropTypes.bool,
  updateNavOnPinSecondary: PropTypes.func,
  updateNavOnPinTertiary: PropTypes.func,
  forceHideSecondaryMenu: PropTypes.func,
  setAncestorsActive: PropTypes.func,
  hoverDelay: PropTypes.number,
  hideDelay: PropTypes.number
};

const getNextDepth = depth => {
  return (
    (depth === 'primary' && 'secondary') ||
    (depth === 'secondary' && 'tertiary') ||
    'primary'
  );
};

const deepestOf = (pri, sec, ter) => (pri && sec && ter) || (pri && sec) || pri;

const getItemProps = props => ({
  title: props.title,
  mobileItem: props.mobileItem,
  iconStyleClass: props.iconStyleClass,
  badges: props.badges,
  subItems:
    props.children &&
    React.Children.count(props.children) > 0 &&
    React.Children.map(props.children, child => getItemProps(child.props))
});

const getChildItemContext = parentProps => {
  const {
    // * undefined if coming from top-level VerticalNavigation container parent
    depth, // *
    item, // *
    primaryItem, // *
    secondaryItem, // *
    hiddenIcons,
    pinnableMenus,
    updateNavOnItemHover,
    updateNavOnItemBlur,
    updateNavOnItemClick,
    mobileLayout,
    navCollapsed,
    pinnedSecondaryNav,
    pinnedTertiaryNav,
    updateNavOnPinSecondary,
    updateNavOnPinTertiary,
    forceHideSecondaryMenu,
    setAncestorsActive,
    hoverDelay,
    hideDelay
  } = parentProps;
  const nextDepth = getNextDepth(depth); // returns primary if depth was undefined
  return {
    depth: nextDepth,
    primaryItem: nextDepth === 'secondary' ? item : primaryItem,
    secondaryItem: nextDepth === 'tertiary' ? item : secondaryItem,
    // tertiaryItem doesn't need to be in context (see VerticalNavigationItem.getContextNavItems)
    hiddenIcons,
    pinnableMenus,
    updateNavOnItemHover,
    updateNavOnItemBlur,
    updateNavOnItemClick,
    mobileLayout,
    navCollapsed,
    pinnedSecondaryNav,
    pinnedTertiaryNav,
    updateNavOnPinSecondary,
    updateNavOnPinTertiary,
    forceHideSecondaryMenu,
    setAncestorsActive,
    hoverDelay,
    hideDelay
  };
};

const provideItemContext = withContext(itemContextTypes, getChildItemContext);
const consumeItemContext = getContext(itemContextTypes);
const consumeAndProvideItemContext = compose(
  consumeItemContext,
  provideItemContext
);

const ItemContextProvider = provideItemContext(props => (
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
  itemContextTypes,
  provideItemContext,
  consumeItemContext,
  consumeAndProvideItemContext,
  ItemContextProvider,
  getBodyContentElement
};
