import React from 'react';
import PropTypes from 'prop-types';
import VerticalNavigationBrand from './VerticalNavigationBrand';
import { consumeNavContext, navContextTypes } from './constants';

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
        {brandChildren && brandChildren.length > 0 ? (
          brandChildren
        ) : (
          <VerticalNavigationBrand
            title={title}
            href={href}
            iconImg={iconImg}
            titleImg={titleImg}
          />
        )}
      </div>
      {otherChildren}
    </React.Fragment>
  );
};

BaseVerticalNavigationMasthead.propTypes = {
  ...navContextTypes,
  iconImg: PropTypes.string,
  titleImg: PropTypes.string,
  title: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.node,
  updateNavOnMenuToggleClick: PropTypes.func
};

const VerticalNavigationMasthead = consumeNavContext(
  BaseVerticalNavigationMasthead
);

VerticalNavigationMasthead.displayName = 'VerticalNavigationMasthead';

export default VerticalNavigationMasthead;
