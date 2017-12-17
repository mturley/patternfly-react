import React from 'react';
import PropTypes from 'prop-types';
import { withContext, getContext, compose } from 'recompose';

const itemObjectTypes = {
  title: PropTypes.string,
  trackActiveState: PropTypes.bool,
  trackHoverState: PropTypes.bool,
  mobileItem: PropTypes.bool,
  iconStyleClass: PropTypes.string,
  badges: PropTypes.shape({
    badgeClass: PropTypes.string,
    tooltip: PropTypes.string,
    count: PropTypes.number,
    iconStyleClass: PropTypes.string,
  }),
  children: PropTypes.array,
};

const itemContextTypes = {
  depth: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
  primaryItem: PropTypes.shape(itemObjectTypes),
  secondaryItem: PropTypes.shape(itemObjectTypes),
  onItemHover: PropTypes.func,
  onItemBlur: PropTypes.func,
  onItemClick: PropTypes.func,
  // TODO more context?  inMobileState?
};

const getNextDepth = depth => {
  // If we have no depth already, we're at the top level.
  if (!depth) return 'primary';
  // Assume that if someone nests deeper than tertiary, it's just another tertiary-styled item.
  return depth === 'primary' ? 'secondary' : 'tertiary';
};

const deepestOf = (pri, sec, ter) => (pri && sec && ter) || (pri && sec) || pri;

const getItemProps = props => ({
  title: props.title,
  trackActiveState: props.trackActiveState,
  trackHoverState: props.trackHoverState,
  mobileItem: props.mobileItem,
  iconStyleClass: props.iconStyleClass,
  badges: props.badges,
  children:
    props.children &&
    React.Children.count(props.children) > 0 &&
    React.Children.map(props.children, child => getItemProps(child.props)),
});

const getChildItemContext = parentProps => {
  const {
    // * undefined if coming from top-level VerticalNavigation container parent
    depth, // *
    item, // *
    primaryItem, // *
    secondaryItem, // *
    onItemHover,
    onItemBlur,
    onItemClick,
  } = parentProps;
  const nextDepth = getNextDepth(depth); // returns primary if depth was undefined
  return {
    depth: nextDepth,
    primaryItem: nextDepth === 'secondary' ? item : primaryItem,
    secondaryItem: nextDepth === 'tertiary' ? item : secondaryItem,
    // tertiaryItem doesn't need to be in context.
    onItemHover,
    onItemBlur,
    onItemClick,
  };
};

const provideItemContext = withContext(itemContextTypes, getChildItemContext);
const consumeItemContext = getContext(itemContextTypes);
const consumeAndProvideItemContext = compose(
  consumeItemContext,
  provideItemContext,
);

export {
  getNextDepth,
  deepestOf,
  getItemProps,
  itemObjectTypes,
  itemContextTypes,
  provideItemContext,
  consumeItemContext,
  consumeAndProvideItemContext,
};
