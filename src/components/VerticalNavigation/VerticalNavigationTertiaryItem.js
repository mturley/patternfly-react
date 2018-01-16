import React from 'react';
import { wrongDepth, correctDepth, consumeNavContext } from './constants';
import VerticalNavigationItemHelper from './VerticalNavigationItemHelper';

/**
 * VerticalNavigation.TertiaryItem - a child component for tertiary nav items under VerticalNavigation
 * TODO - FIXME - THIS IS A PLACEHOLDER
 */
const BaseVerticalNavigationTertiaryItem = props => {
  if (wrongDepth(props, 'tertiary')) return correctDepth(props);
  return <VerticalNavigationItemHelper {...props} />;
};

BaseVerticalNavigationTertiaryItem.propTypes =
  VerticalNavigationItemHelper.propTypes;

const VerticalNavigationTertiaryItem = consumeNavContext(
  BaseVerticalNavigationTertiaryItem
);

VerticalNavigationTertiaryItem.displayName = 'VerticalNavigation.TertiaryItem';

export default VerticalNavigationTertiaryItem;
