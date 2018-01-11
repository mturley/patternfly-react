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
  subItems: PropTypes.array
};

// * undefined if coming from top-level VerticalNavigation container parent
const itemContextTypes = {
  depth: PropTypes.oneOf(['primary', 'secondary', 'tertiary']), // *
  primaryItem: PropTypes.shape(itemObjectTypes), // *
  secondaryItem: PropTypes.shape(itemObjectTypes), // *
  hiddenIcons: PropTypes.bool,
  pinnableMenus: PropTypes.bool,
  isMobile: PropTypes.bool,
  selectedMobileDepth: PropTypes.bool,
  navCollapsed: PropTypes.bool,
  pinnedSecondaryNav: PropTypes.bool,
  pinnedTertiaryNav: PropTypes.bool,
  updateNavOnItemHover: PropTypes.func,
  updateNavOnItemBlur: PropTypes.func,
  updateNavOnItemClick: PropTypes.func,
  updateNavOnPinSecondary: PropTypes.func,
  updateNavOnPinTertiary: PropTypes.func,
  updateNavOnMobileSelection: PropTypes.func,
  forceHideSecondaryMenu: PropTypes.func,
  setAncestorsActive: PropTypes.func,
  hoverDelay: PropTypes.number,
  hideDelay: PropTypes.number
};

const getNextDepth = depth =>
  (depth === 'primary' && 'secondary') ||
  (depth === 'secondary' && 'tertiary') ||
  'primary';

const deepestOf = (pri, sec, ter) => (pri && sec && ter) || (pri && sec) || pri;

const getItemProps = props => ({
  title: props.title,
  iconStyleClass: props.iconStyleClass,
  badges: props.badges,
  subItems:
    props.children &&
    React.Children.count(props.children) > 0 &&
    React.Children.map(props.children, child => getItemProps(child.props))
});

const getChildItemContext = providerProps => {
  // The item prop doesn't get included in context, but must be passed to the provider
  // In order to properly include primaryItem and secondaryItem in context.
  const { item, primaryItem, secondaryItem } = providerProps;
  const nextDepth = getNextDepth(providerProps.depth);
  return {
    // Only the keys that should be in context are included,
    // so it is safe to spread extra props into the provider component.
    ...selectKeys(providerProps, Object.keys(itemContextTypes)),
    depth: nextDepth,
    primaryItem: nextDepth === 'secondary' ? item : primaryItem,
    secondaryItem: nextDepth === 'tertiary' ? item : secondaryItem
    // We don't need a tertiaryItem in context (see VerticalNavigationItem.getContextNavItems)
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
