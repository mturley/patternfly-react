import React from 'react';
import PropTypes from 'prop-types';
import VerticalNavigationCollapse from './VerticalNavigationCollapse';

const VerticalNavigationIconBar = props => {
  const iconBar = (
    <ul className="nav navbar-nav navbar-right navbar-iconic">
      {props.children}
    </ul>
  );
  return props.collapse ? (
    <VerticalNavigationCollapse>{iconBar}</VerticalNavigationCollapse>
  ) : (
    iconBar
  );
};

VerticalNavigationIconBar.propTypes = {
  children: PropTypes.node,
  collapse: PropTypes.bool
};

VerticalNavigationIconBar.defaultProps = {
  collapse: true
};

export default VerticalNavigationIconBar;
