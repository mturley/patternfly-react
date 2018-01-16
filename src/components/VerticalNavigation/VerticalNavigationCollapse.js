import React from 'react';
import PropTypes from 'prop-types';

const VerticalNavigationCollapse = props => (
  <nav className="collapse navbar-collapse">{props.children}</nav>
);

VerticalNavigationCollapse.propTypes = {
  children: PropTypes.node
};

VerticalNavigationCollapse.displayName = 'VerticalNavigation.Collapse';

export default VerticalNavigationCollapse;
