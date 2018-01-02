import React from 'react';
import PropTypes from 'prop-types';

/**
 * VerticalNavigationMastHead - the first child of a VerticalNavigation component
 */
const VerticalNavigationMastHead = props => {
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

VerticalNavigationMastHead.propTypes = {
  iconImg: PropTypes.string,
  titleImg: PropTypes.string,
  title: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.node
};

VerticalNavigationMastHead.defaultProps = {
  iconImg: null,
  titleImg: null,
  title: '',
  href: null,
  children: null
};

VerticalNavigationMastHead.displayName = 'VerticalNavigationMastHead';

export default VerticalNavigationMastHead;
