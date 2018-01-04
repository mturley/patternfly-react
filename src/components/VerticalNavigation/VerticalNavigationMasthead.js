import React from 'react';
import PropTypes from 'prop-types';

/**
 * VerticalNavigationMasthead - the first child of a VerticalNavigation component
 */
const VerticalNavigationMasthead = props => {
  const { children, href, iconImg, titleImg, title } = props;
  if (children) return <span className="navbar-brand">{children}</span>;
  const brand = (
    <span>
      {iconImg && (
        <img className="navbar-brand-icon" src={iconImg} alt={title} />
      )}
      {titleImg && (
        <img className="navbar-brand-name" src={titleImg} alt={title} />
      )}
      {!titleImg && title && <span className="navbar-brand-txt">{title}</span>}
    </span>
  );
  if (href) {
    return (
      <a href={href} className="navbar-brand">
        {brand}
      </a>
    );
  }
  return <span className="navbar-brand">{brand}</span>;
};

VerticalNavigationMasthead.propTypes = {
  iconImg: PropTypes.string,
  titleImg: PropTypes.string,
  title: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.node
};

VerticalNavigationMasthead.defaultProps = {
  iconImg: null,
  titleImg: null,
  title: '',
  href: null,
  children: null
};

VerticalNavigationMasthead.displayName = 'VerticalNavigationMasthead';

export default VerticalNavigationMasthead;
