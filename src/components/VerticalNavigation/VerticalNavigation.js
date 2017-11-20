import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ListGroup from '../ListGroup/ListGroup';
import VerticalNavigationItem from './VerticalNavigationItem';

// TODO compare with
// http://www.patternfly.org/pattern-library/navigation/vertical-navigation/
// TODO fix errors and get it working on storybook

/**
 * VerticalNavigation - The Vertical Navigation pattern
 */
export default class VerticalNavigation extends React.Component {
  // NOTE: For convenience, ALL PROPS of VerticalNavigation will be passed to all VerticalNavigationItem children.
  // EXCEPTIONS:
  // - The children prop, for obvious reasons.
  // - The depth prop will automatically be set to the currently nested depth (primary, secondary or tertiary).
  // - Any props passed explicitly to VerticalNavigationItem children will take precendence over inherited props.
  static renderChildren(props) {
    const { children, ...parentProps } = props; // TODO maybe take specific props instead of passing all of them?
    const depth = VerticalNavigation.getNextDepth(props.depth || 'primary');
    return React.Children.map(children, child => {
      if (child.type === VerticalNavigationItem) {
        return React.cloneElement(child, {
          ...parentProps,
          depth,
          ...child.props, // We include this to allow overriding these props inline on a VerticalNavigationItem.
        });
      } else {
        return child;
      }
    });
  }

  static getNextDepth(depth) {
    return depth === 'primary' ? 'secondary' : 'tertiary';
  }

  constructor() {
    super();
    this.state = {
      hoverSecondaryNav: false,
      hoverTertiaryNav: false,
      collapsedSecondaryNav: false,
      collapsedTertiaryNav: false,
    };
    this.handleNavBarToggleClick = this.handleNavBarToggleClick.bind(this);
  }

  handleNavBarToggleClick() {
    const { hideTopBanner } = this.state;
    this.setState({
      hideTopBanner: !hideTopBanner,
    });
  }

  handlePrimaryClick(item) {
    // TODO
  }

  handlePrimaryHover(item) {
    // TODO
  }

  handlePrimaryBlur(item) {
    // TODO
  }

  handleSecondaryClick(item) {
    // TODO
  }

  handleSecondaryHover(item) {
    // TODO
  }

  handleSecondaryBlur(item) {
    // TODO
  }

  handleTertiaryClick(item) {
    // TODO
  }

  handleTertiaryHover(item) {
    // TODO
  }

  handleTertiaryBlur(item) {
    // TODO
  }

  render() {
    const {
      items,
      hidden,
      persistentSecondary,
      pinnableMenus,
      hiddenIcons,
      brandSrc,
      brandAlt,
      showBadges,
      showMobileNav,
      showMobileSecondary,
      showMobileTertiary,
      forceHidden,
      hideTopBanner,
      navCollapsed,
      inMobileState,
      activeSecondary,
      children,
      topBannerContents,
      notificationDrawer /* TODO notification drawer components? */,
    } = this.props;
    const {
      hoverSecondaryNav,
      hoverTertiaryNav,
      collapsedSecondaryNav,
      collapsedTertiaryNav
    } = this.state;

    // Nav items may be passed either as nested VerticalNavigationItem children, or as nested items in a prop.
    // If we have the items prop, and we don't have any children, render as if it were passed as children.
    if (items && !children)
      return (
        <VerticalNavigation>
          {items.map((primaryItem, i) => (
            <VerticalNavigationItem {...primaryItem}>
              {primaryItem.children &&
                primaryItem.children.map((secondaryItem, j) => (
                  <VerticalNavigationItem {...secondaryItem}>
                    {secondaryItem.children &&
                      secondaryItem.children.map((tertiaryItem, j) => (
                        <VerticalNavigationItem {...tertiaryItem} />
                      ))}
                  </VerticalNavigationItem>
                ))}
            </VerticalNavigationItem>
          ))}
        </VerticalNavigation>
      );

    const topBanner = (
      <div>
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle"
            onClick={this.handleNavBarToggleClick}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />{' '}
            {/* TODO make props for these icons! */}
          </button>
          <span className="navbar-brand">
            {brandSrc ? (
              <img
                className="navbar-brand-icon"
                src={brandSrc}
                alt={brandAlt}
              />
            ) : (
                <span className="navbar-brand-txt">{brandAlt}</span>
              )}
            {/* TODO in the reference markup there is also a:
              <img class="navbar-brand-name" src="/assets/img/brand-alt.svg" alt="PatternFly Enterprise Application" /> */}
          </span>
        </div>
        <nav className="collapse navbar-collapse">{topBannerContents}</nav>
        {notificationDrawer}
      </div>
    );

    return (
      <div>
        <nav // TODO do we need classes like the commented out ones here?
          className={cx(
            'navbar navbar-pf-vertical' /* 'pf-vertical-container', hideTopBanner && 'pfng-vertical-hide-nav' */,
          )}
        >
          {!hideTopBanner && topBanner}
          <div
            className={cx('nav-pf-vertical nav-pf-vertical-with-sub-menus', {
              'nav-pf-vertical-collapsible-menus': pinnableMenus,
              'hidden-icons-pf': hiddenIcons,
              'nav-pf-vertical-with-badges': showBadges,
              'secondary-visible-pf': activeSecondary,
              'show-mobile-secondary': showMobileSecondary,
              'show-mobile-tertiary': showMobileTertiary,
              'hover-secondary-nav-pf': hoverSecondaryNav,
              'hover-tertiary-nav-pf': hoverTertiaryNav,
              'collapsed-secondary-nav-pf': collapsedSecondaryNav,
              'collapsed-tertiary-nav-pf': collapsedTertiaryNav,
              hidden: inMobileState,
              collapsed: navCollapsed,
              'force-hide-secondary-nav-pf': forceHidden,
              'show-mobile-nav': showMobileNav,
            })}
          >
            <ListGroup componentClass="ul">
              {children && VerticalNavigation.renderChildren(this.props)}
            </ListGroup>
          </div>
        </nav>
      </div>
    );
  }
}

VerticalNavigation.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object), // TODO shape of item objects?
  hidden: PropTypes.bool,
  persistentSecondary: PropTypes.bool,
  pinnableMenus: PropTypes.bool,
  hiddenIcons: PropTypes.bool,
  brandSrc: PropTypes.string,
  brandAlt: PropTypes.string,
  showBadges: PropTypes.bool,
  showMobileNav: PropTypes.bool,
  showMobileSecondary: PropTypes.bool,
  showMobileTertiary: PropTypes.bool,
  forceHidden: PropTypes.bool,
  hideTopBanner: PropTypes.bool,
  topBannerContents: PropTypes.node,
  navCollapsed: PropTypes.bool,
  inMobileState: PropTypes.bool,
  activeSecondary: PropTypes.bool,
  children: PropTypes.node,
};

VerticalNavigation.defaultProps = {
  items: null,
  hidden: false,
  persistentSecondary: false,
  pinnableMenus: false,
  hiddenIcons: false,
  brandSrc: null,
  brandAlt: '',
  showBadges: true,
  showMobileNav: true,
  showMobileSecondary: false,
  showMobileTertiary: false,
  forceHidden: false,
  hideTopBanner: false,
  topBannerContents: null,
  navCollapsed: false,
  inMobileState: false,
  activeSecondary: false,
};
