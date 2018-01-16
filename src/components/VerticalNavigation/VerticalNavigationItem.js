import React from 'react';
import { wrongDepth, correctDepth, consumeNavContext } from './constants';
import VerticalNavigationItemHelper from './VerticalNavigationItemHelper';

/**
 * VerticalNavigation.Item - a child component for primary nav items under VerticalNavigation
 * TODO - FIXME - THIS IS A PLACEHOLDER
 */
const BaseVerticalNavigationItem = props => {
  // if (wrongDepth(props, 'primary')) return correctDepth(props);
  return <VerticalNavigationItemHelper {...props} />;
};

BaseVerticalNavigationItem.propTypes = VerticalNavigationItemHelper.propTypes;

// const VerticalNavigationItem = consumeNavContext(BaseVerticalNavigationItem);
const VerticalNavigationItem = BaseVerticalNavigationItem;

VerticalNavigationItem.displayName = 'VerticalNavigation.Item';

export default VerticalNavigationItem;
