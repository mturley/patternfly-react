import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ListGroup from '../ListGroup/ListGroup';
import VerticalNavigationItem from './VerticalNavigationItem';
import VerticalNavigationMasthead from './VerticalNavigationMasthead';
import {
  deepestOf,
  itemObjectTypes,
  itemContextTypes,
  provideItemContext
} from './constants';

// TODO compare with
// http://www.patternfly.org/pattern-library/navigation/vertical-navigation/

// TODO -- the rest of the handler problems
// TODO -- break things out into PrimaryItem, SecondaryItem, TertiaryItem? inheritance??
// TODO -- figure out controlled vs uncontrolled, and what props/state this involves

// TODO react-router support?
// TODO all the other TODOs....

const ItemContextProvider = provideItemContext(props => (
  <div>{props.children}</div>
));

/**
 * VerticalNavigation - The Vertical Navigation pattern
 */
class VerticalNavigation extends React.Component {
  constructor() {
    super();
    this.state = {
      showMobileNav: false, // TODO allow controlled override with prop?
      navCollapsed: false, // TODO allow controlled override with prop?
      explicitCollapse: false, // TODO do we need this?
      hoverSecondaryNav: false,
      hoverTertiaryNav: false,
      collapsedSecondaryNav: false,
      collapsedTertiaryNav: false
    };
    this.onNavBarToggleClick = this.onNavBarToggleClick.bind(this);
    this.expandMenu = this.expandMenu.bind(this);
    this.collapseMenu = this.collapseMenu.bind(this);
    this.updateHoverState = this.updateHoverState.bind(this);
    this.updateNavOnItemHover = this.updateNavOnItemHover.bind(this);
    this.updateNavOnItemBlur = this.updateNavOnItemBlur.bind(this);
    this.updateNavOnItemClick = this.updateNavOnItemClick.bind(this);
    this.updateMobileMenu = this.updateMobileMenu.bind(this);
    this.navigateToItem = this.navigateToItem.bind(this);
  }

  onNavBarToggleClick() {
    const { inMobileState } = this.props;
    const { showMobileNav, navCollapsed } = this.state;
    if (inMobileState) {
      if (showMobileNav) {
        this.setState({ showMobileNav: false });
      } else {
        this.updateMobileMenu();
        this.setState({ showMobileNav: true });
      }
    } else if (navCollapsed) {
      this.expandMenu();
    } else {
      this.collapseMenu();
    }
  }

  expandMenu() {
    this.setState({
      navCollapsed: false,
      explicitCollapse: false
    });
    // TODO collapsed-nav body class? only in uncontrolled mode.

    // Dispatch a resize event when showing the expanding then menu to
    // allow content to adjust to the menu sizing
    // TODO FIXME -- do we need this, and wouldn't we want it after the re-render?
    // this.windowRef.nativeWindow.dispatchEvent(new Event('resize'));
  }

  collapseMenu() {
    this.setState({
      navCollapsed: true,
      explicitCollapse: true
    });
    // TODO collapsed-nav body class?
  }

  updateHoverState(hovering, primary, secondary, tertiary) {
    if (primary && secondary) {
      if (tertiary) {
        this.setState({ hoverTertiaryNav: hovering });
      } else {
        this.setState({ hoverSecondaryNav: hovering });
      }
    }
  }

  updateNavOnItemHover(primary, secondary, tertiary) {
    const { onItemHover } = this.props;
    this.updateHoverState(true, primary, secondary, tertiary);
    if (onItemHover) {
      onItemHover(primary, secondary, tertiary);
    }
  }

  updateNavOnItemBlur(primary, secondary, tertiary) {
    const { onItemBlur } = this.props;
    // if (!this.primaryHover()) hoverSecondaryNav: false ? from ng, is it necessary?
    this.updateHoverState(false, primary, secondary, tertiary);
    if (onItemBlur) {
      onItemBlur(primary, secondary, tertiary);
    }
  }

  updateNavOnItemClick(primary, secondary, tertiary) {
    const { inMobileState, onItemClick } = this.props;
    const item = deepestOf(primary, secondary, tertiary);
    if (inMobileState) {
      if (item.children && item.children.length > 0) {
        this.updateMobileMenu(primary, secondary, tertiary); // TODO figure out what this did in ng
      } else {
        this.updateMobileMenu(); // TODO figure out what this did in ng (expanded states?)
      }
    }
    if (!inMobileState || !item.children || item.children.length === 0) {
      this.navigateToItem(item);
    }
    if (onItemClick) {
      onItemClick(primary, secondary, tertiary);
    }
  }

  updateMobileMenu() {
    console.log('TODO update menu', arguments); // TODO
  }

  navigateToItem(item) {
    console.log('TODO NAVIGATE!', item); // TODO
  }

  render() {
    const { items, children } = this.props;

    // TODO include more stories examples!

    // Nav items may be passed either as nested VerticalNavigationItem children, or as nested items in a prop.
    // The items prop will take priority, if present, and must be an array of item objects (not React components).
    // If the items prop is not present, items must be expressed as VerticalNavigationItem children instead.
    // Any non-VerticalNavigationItem children will be rendered in the masthead.
    const childrenArray =
      children &&
      React.Children.count(children) > 0 &&
      React.Children.toArray(children);
    const itemsFromChildren =
      childrenArray &&
      childrenArray.filter(child => child.type === VerticalNavigationItem);
    // TODO maybe rely on the item render method to recurse, and just do one map here?
    const itemsFromProps =
      items &&
      items.length > 0 &&
      items.map((primaryItem, i) => (
        <VerticalNavigationItem
          item={primaryItem}
          key={`primary_${primaryItem.title}`}
        >
          {primaryItem.children &&
            primaryItem.children.map((secondaryItem, j) => (
              <VerticalNavigationItem
                item={secondaryItem}
                key={`secondary_${secondaryItem.title}`}
              >
                {secondaryItem.children &&
                  secondaryItem.children.map((tertiaryItem, j) => (
                    <VerticalNavigationItem
                      item={tertiaryItem}
                      key={`tertiary_${tertiaryItem.title}`}
                    />
                  ))}
              </VerticalNavigationItem>
            ))}
        </VerticalNavigationItem>
      ));
    const itemComponents = itemsFromProps || itemsFromChildren || [];

    const masthead =
      childrenArray &&
      childrenArray.find(child => child.type === VerticalNavigationMasthead);
    const mastheadChildren = masthead && masthead.props.children;

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
      inMobileState,
      hoverDelay,
      hideDelay,
      activeSecondary, // ???
      topBannerContents,
      notificationDrawer /* TODO notification drawer components? */
    } = this.props;
    const {
      navCollapsed, // TODO should this also be overrideable with a prop? TODO burger button needs a prop handler too then.
      hoverSecondaryNav,
      hoverTertiaryNav,
      collapsedSecondaryNav,
      collapsedTertiaryNav
    } = this.state;

    const topBanner = (
      <div>
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle"
            onClick={this.onNavBarToggleClick}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <span className="navbar-brand">
            {mastheadChildren || // TODO revisit this? how to best default when they don't have children?
              (brandSrc ? (
                <img
                  className="navbar-brand-icon"
                  src={brandSrc}
                  alt={brandAlt}
                />
              ) : (
                <span className="navbar-brand-txt">{brandAlt}</span>
              ))}
            {/* TODO in the reference markup there is also a:
              <img class="navbar-brand-name" src="/assets/img/brand-alt.svg" alt="PatternFly Enterprise Application" /> */}
          </span>
        </div>
        <nav className="collapse navbar-collapse">{topBannerContents}</nav>
        {notificationDrawer}
      </div>
    );

    return (
      <ItemContextProvider
        updateNavOnItemHover={this.updateNavOnItemHover}
        updateNavOnItemBlur={this.updateNavOnItemBlur}
        updateNavOnItemClick={this.updateNavOnItemClick}
        inMobileState={inMobileState}
        hoverDelay={hoverDelay}
        hideDelay={hideDelay}
      >
        <nav // TODO do we need classes like the commented out ones here?
          className={cx(
            'navbar navbar-pf-vertical' /* 'pf-vertical-container', hideTopBanner && 'pfng-vertical-hide-nav' */
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
              'show-mobile-nav': showMobileNav
            })}
          >
            <ListGroup componentClass="ul">{itemComponents}</ListGroup>
          </div>
        </nav>
      </ItemContextProvider>
    );
  }
}

VerticalNavigation.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape(itemObjectTypes)),
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
  hoverDelay: PropTypes.number, // ms
  hideDelay: PropTypes.number, // ms
  onItemClick: PropTypes.func, // Optional, will be called in addition to the component handlers
  onItemHover: PropTypes.func, // Optional, will be called in addition to the component handlers
  onItemBlur: PropTypes.func, // Optional, will be called in addition to the component handlers
  children: PropTypes.node
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
  hoverDelay: 500,
  hideDelay: 700,
  onItemClick: () => {},
  onItemHover: () => {},
  onItemBlur: () => {}
};

export default VerticalNavigation;
