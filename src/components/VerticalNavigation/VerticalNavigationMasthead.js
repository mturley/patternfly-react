import React from 'react';
import PropTypes from 'prop-types';
import VerticalNavigationBrand from './VerticalNavigationBrand';
import { consumeItemContext } from './constants';

// TODO -- all the items you can place in the right side of the masthead should be children components here

/**
 * VerticalNavigationMasthead - the first child of a VerticalNavigation component
 */
const BaseVerticalNavigationMasthead = props => {
  const { children, href, iconImg, titleImg, title } = props;

  const childrenArray =
    children &&
    React.Children.count(children) > 0 &&
    React.Children.toArray(children);
  const brandChildren =
    childrenArray &&
    childrenArray.filter(child => child.type === VerticalNavigationBrand);
  const otherChildren =
    childrenArray &&
    childrenArray.filter(child => child.type !== VerticalNavigationBrand);

  const brand =
    brandChildren && brandChildren.length > 0 ? (
      brandChildren
    ) : (
      <span>
        {iconImg && (
          <img className="navbar-brand-icon" src={iconImg} alt={title} />
        )}
        {titleImg && (
          <img className="navbar-brand-name" src={titleImg} alt={title} />
        )}
        {!titleImg &&
          title && <span className="navbar-brand-txt">{title}</span>}
      </span>
    );

  return (
    <React.Fragment>
      <div className="navbar-header">
        <button
          type="button"
          className="navbar-toggle"
          onClick={props.updateNavOnMenuToggleClick}
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar" />
          <span className="icon-bar" />
          <span className="icon-bar" />
        </button>
        {href ? (
          <a href={href} className="navbar-brand">
            {brand}
          </a>
        ) : (
          <span className="navbar-brand">{brand}</span>
        )}
      </div>
      {otherChildren}
    </React.Fragment>
  );
};

BaseVerticalNavigationMasthead.propTypes = {
  iconImg: PropTypes.string,
  titleImg: PropTypes.string,
  title: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.node,
  updateNavOnMenuToggleClick: PropTypes.func
};

BaseVerticalNavigationMasthead.defaultProps = {
  iconImg: null,
  titleImg: null,
  title: '',
  href: null,
  children: null,
  updateNavOnMenuToggleClick: () => {}
};

const VerticalNavigationMasthead = consumeItemContext(
  BaseVerticalNavigationMasthead
);

VerticalNavigationMasthead.displayName = 'VerticalNavigationMasthead';

export default VerticalNavigationMasthead;
