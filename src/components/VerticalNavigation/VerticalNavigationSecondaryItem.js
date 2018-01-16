import React from 'react';
import { wrongDepth, correctDepth, consumeNavContext } from './constants';
import VerticalNavigationItemHelper from './VerticalNavigationItemHelper';

/**
 * VerticalNavigation.SecondaryItem - a child component for secondary nav items under VerticalNavigation
 * TODO - FIXME - THIS IS A PLACEHOLDER
 */
const BaseVerticalNavigationSecondaryItem = props => {
  if (wrongDepth(props, 'secondary')) return correctDepth(props);
  return <VerticalNavigationItemHelper {...props} />;
};

BaseVerticalNavigationSecondaryItem.propTypes =
  VerticalNavigationItemHelper.propTypes;

const VerticalNavigationSecondaryItem = consumeNavContext(
  BaseVerticalNavigationSecondaryItem
);

VerticalNavigationSecondaryItem.displayName =
  'VerticalNavigation.SecondaryItem';

export default VerticalNavigationSecondaryItem;
