import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ListGroup from '../ListGroup/ListGroup';
import VerticalNavigationItem from './VerticalNavigationItem';

// TODO compare with
// http://www.patternfly.org/pattern-library/navigation/vertical-navigation/
// TODO fix errors and get it working on storybook
// TODO react-router support?

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
    const { primaryItem, secondaryItem, tertiaryItem } = props;
    const childDepth = VerticalNavigation.getNextDepth(props.depth);
    return React.Children.map(children, child => {
      if (child.type === VerticalNavigationItem) {
        const item = VerticalNavigation.getItemObject(child.props);
        const primary = childDepth === 'primary' ? item : primaryItem;
        const secondary = childDepth === 'secondary' ? item : secondaryItem;
        const tertiary = childDepth === 'tertiary' ? item : tertiaryItem;
        const childProps = {
          ...parentProps,
          depth: childDepth,
          primaryItem: primary,
          secondaryItem: secondary,
          tertiaryItem: tertiary,
          ...child.props, // We include this to allow overriding these props inline on a VerticalNavigationItem.
        };
        return <VerticalNavigationItem {...childProps} />;
      } else {
        return child;
      }
    });
  }

  static handleItemClick(primary, secondary, tertiary, inMobileState) {
    const item =
      (primary && secondary && tertiary) || (primary && secondary) || primary;
    if (inMobileState) {
      if (item.children && item.children.length > 0) {
        this.updateMobileMenu(primary, secondary, tertiary); // TODO figure out what this did in ng
      } else {
        this.updateMobileMenu(); // TODO figure out what this did in ng (expanded states?)
      }
    }
    if (!inMobileState || !item.children || item.children.length === 0) {
      VerticalNavigation.navigateToItem(item);
    }
  }

  static getNextDepth(depth) {
    if (!depth) return 'primary';
    return depth === 'primary' ? 'secondary' : 'tertiary';
  }

  static getItemObject(props) {
    return {
      title: props.title,
      trackActiveState: props.trackActiveState,
      trackHoverState: props.trackHoverState,
      mobileItem: props.mobileItem,
      iconStyleClass: props.iconStyleClass,
      badges: props.badges,
      children:
        props.children &&
        props.children.length > 0 &&
        React.Children.map(props.children, child =>
          VerticalNavigation.getItemObject(child.props),
        ),
    };
  }

  static navigateToItem(item) {
    console.log('TODO NAVIGATE!', item); // TODO
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
    this.handlePrimaryHover = this.handlePrimaryHover.bind(this);
    this.handlePrimaryBlur = this.handlePrimaryBlur.bind(this);
    this.handleSecondaryHover = this.handleSecondaryHover.bind(this);
    this.handleSecondaryBlur = this.handleSecondaryBlur.bind(this);
    this.handleTertiaryHover = this.handleTertiaryHover.bind(this);
    this.handleTertiaryBlur = this.handleTertiaryBlur.bind(this);
  }

  handleNavBarToggleClick() {
    const { hideTopBanner } = this.state;
    this.setState({
      hideTopBanner: !hideTopBanner,
    });
  }

  handlePrimaryHover(item) {
    // TODO give hover and blur the same treatment as the static click handler
  }

  handlePrimaryBlur(item) {
    // TODO
  }

  handleSecondaryHover(item) {
    // TODO
  }

  handleSecondaryBlur(item) {
    // TODO
  }

  handleTertiaryHover(item) {
    // TODO
  }

  handleTertiaryBlur(item) {
    // TODO
  }

  render() {
    const { items, children } = this.props;
    // Nav items may be passed either as nested VerticalNavigationItem children, or as nested items in a prop.
    // If we have the items prop, and we don't have any children, render as if it were passed as children.
    if (items && !children) {
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
    }

    const {
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
      inMobileState, // TODO maybe this should be local state?
      activeSecondary,
      topBannerContents,
      notificationDrawer /* TODO notification drawer components? */,
    } = this.props;
    const {
      hoverSecondaryNav,
      hoverTertiaryNav,
      collapsedSecondaryNav,
      collapsedTertiaryNav,
    } = this.state;

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
              {children &&
                children.length > 0 &&
                VerticalNavigation.renderChildren(this.props)}
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
  handlePrimaryHover: PropTypes.func,
  handleSecondaryHover: PropTypes.func,
  handleTertiaryHover: PropTypes.func,
  handlePrimaryBlur: PropTypes.func,
  handleSecondaryBlur: PropTypes.func,
  handleTertiaryBlur: PropTypes.func,
  handlePrimaryClick: PropTypes.func,
  handleSecondaryClick: PropTypes.func,
  handleTertiaryClick: PropTypes.func,
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
  handlePrimaryHover: () => {},
  handleSecondaryHover: () => {},
  handleTertiaryHover: () => {},
  handlePrimaryBlur: () => {},
  handleSecondaryBlur: () => {},
  handleTertiaryBlur: () => {},
  handlePrimaryClick: () => {},
  handleSecondaryClick: () => {},
  handleTertiaryClick: () => {},
};
