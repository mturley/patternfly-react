import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from './index';

const VerticalNavigationIconBar = props => {
  const iconBar = (
    <ul className="nav navbar-nav navbar-right navbar-iconic">
      {props.children}
    </ul>
  );
  return props.collapse ? <Collapse>{iconBar}</Collapse> : iconBar;
};

VerticalNavigationIconBar.propTypes = {
  children: PropTypes.node,
  collapse: PropTypes.bool
};

VerticalNavigationIconBar.defaultProps = {
  collapse: true
};

export default VerticalNavigationIconBar;
