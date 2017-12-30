import React from 'react';
import PropTypes from 'prop-types';
import { withContext, getContext, compose } from 'recompose';

const itemObjectTypes = {
  title: PropTypes.string,
  active: PropTypes.bool,
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
  depth: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
  primaryItem: PropTypes.shape(itemObjectTypes),
  secondaryItem: PropTypes.shape(itemObjectTypes),
  updateNavOnItemHover: PropTypes.func,
  updateNavOnItemBlur: PropTypes.func,
  updateNavOnItemClick: PropTypes.func,
  inMobileState: PropTypes.bool,
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
  active: props.active,
  mobileItem: props.mobileItem,
  iconStyleClass: props.iconStyleClass,
  badges: props.badges
  /* 8subItems:
    props.children &&
    React.Children.count(props.children) > 0 &&
    React.Children.map(props.children, child => getItemProps(child.props)) */
});

const getChildItemContext = parentProps => {
  const {
    // * undefined if coming from top-level VerticalNavigation container parent
    depth, // *
    item, // *
    primaryItem, // *
    secondaryItem, // *
    hiddenIcons,
    updateNavOnItemHover,
    updateNavOnItemBlur,
    updateNavOnItemClick,
    inMobileState,
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
    updateNavOnItemHover,
    updateNavOnItemBlur,
    updateNavOnItemClick,
    inMobileState,
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
  getBodyContentElement
};
