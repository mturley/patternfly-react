import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ListGroup from '../ListGroup/ListGroup';
import VerticalNavigationItem from './VerticalNavigationItem';
import VerticalNavigationMastHead from './VerticalNavigationMastHead';
import { bindMethods } from '../../common/helpers';
import {
  deepestOf,
  itemObjectTypes,
  itemContextTypes,
  provideItemContext,
  getBodyContentElement
} from './constants';

// TODO -- figure out controlled vs uncontrolled, and what props/state this involves
// TODO -- break things out into PrimaryItem, SecondaryItem, TertiaryItem

// TODO react-router support?
// TODO all the other TODOs....

const ContextProvider = provideItemContext(props => (
  <div className={props.className}>{props.children}</div>
));

/**
 * VerticalNavigation - The Vertical Navigation pattern
 * http://www.patternfly.org/pattern-library/navigation/vertical-navigation/
 */
class VerticalNavigation extends React.Component {
  constructor() {
    super();
    this.state = {
      showMobileNav: false,
      navCollapsed: false,
      explicitCollapse: false, // TODO do we need this?
      hoverSecondaryNav: false,
      hoverTertiaryNav: false,
      collapsedSecondaryNav: false,
      collapsedTertiaryNav: false
    };
    bindMethods(this, [
      'getControlledState',
      'onMenuToggleClick',
      'collapseMenu',
      'expandMenu',
      'updateHoverState',
      'updateNavOnItemHover',
      'updateNavOnItemBlur',
      'updateNavOnItemClick',
      'updateMobileMenu',
      'navigateToItem'
    ]);
  }

  // This is a prop-by-prop implementation of the controlled component pattern.
  // If you pass any of these props, the component will render with your value instead of
  // the automatic internal state value of the same name. If you use one of these props,
  // be sure to also use the corresponding handlers to keep them updated.
  getControlledState() {
    return [
      'showMobileNav',
      'navCollapsed',
      'hoverSecondaryNav',
      'hoverTertiaryNav'
    ].reduce((values, key) => {
      return {
        ...values,
        [key]:
          this.props.hasOwnProperty(key) && this.props[key] !== null
            ? this.props[key]
            : this.state[key]
      };
    }, {});
  }

  onMenuToggleClick() {
    const { inMobileState, onMenuToggleClick } = this.props;
    const { showMobileNav, navCollapsed } = this.getControlledState();
    if (inMobileState) {
      // TODO can/should we detect internally that it is mobile mode?
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
    onMenuToggleClick && onMenuToggleClick();
  }

  collapseMenu() {
    const { onCollapse } = this.props;
    this.setState({
      navCollapsed: true,
      explicitCollapse: true
    });
    onCollapse && onCollapse();
    // TODO only in uncontrolled mode / with a specific prop
    getBodyContentElement().classList.add('collapsed-nav');
  }

  expandMenu() {
    const { onExpand } = this.props;
    this.setState({
      navCollapsed: false,
      explicitCollapse: false
    });
    onExpand && onExpand();
    // TODO only in uncontrolled mode
    getBodyContentElement().classList.remove('collapsed-nav');

    // Dispatch a resize event when showing the expanding then menu to
    // allow content to adjust to the menu sizing
    // TODO FIXME -- do we need this, and wouldn't we want it after the re-render?
    // this.windowRef.nativeWindow.dispatchEvent(new Event('resize'));
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
      if (item.subItems && item.subItems.length > 0) {
        this.updateMobileMenu(primary, secondary, tertiary); // TODO figure out what this did in ng
      } else {
        this.updateMobileMenu(); // TODO figure out what this did in ng (expanded states?)
      }
    }
    if (!inMobileState || !item.subItems || item.subItems.length === 0) {
      this.navigateToItem(item);
    }
    onItemClick && onItemClick(primary, secondary, tertiary);
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

    // Nav items may be passed either as nested VerticalNavigationitem.subItems, or as nested items in a prop.
    // The items prop will take priority, if present, and must be an array of item objects (not React components).
    // If the items prop is not present, items must be expressed as VerticalNavigationitem.subItems instead.
    // Any non-VerticalNavigationitem.subItems will be rendered in the masthead.
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
          {primaryItem.subItems &&
            primaryItem.subItems.map((secondaryItem, j) => (
              <VerticalNavigationItem
                item={secondaryItem}
                key={`secondary_${secondaryItem.title}`}
              >
                {secondaryItem.subItems &&
                  secondaryItem.subItems.map((tertiaryItem, j) => (
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

    const mastHead =
      childrenArray &&
      childrenArray.find(child => child.type === VerticalNavigationMastHead);
    const mastHeadChildren = mastHead && mastHead.props.children;

    const {
      hidden,
      hiddenIcons,
      persistentSecondary,
      pinnableMenus,
      brandSrc,
      brandAlt,
      showBadges,
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
    const { collapsedSecondaryNav, collapsedTertiaryNav } = this.state; // ???? TODO
    const {
      showMobileNav,
      navCollapsed,
      hoverSecondaryNav,
      hoverTertiaryNav
    } = this.getControlledState();

    const topBanner = (
      <div>
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle"
            onClick={this.onMenuToggleClick}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <span className="navbar-brand">
            {mastHeadChildren || // TODO revisit this? how to best default when they don't have children?
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
      <nav // TODO do we need classes like the commented out ones here?
        className={cx(
          'navbar navbar-pf-vertical' /* 'pf-vertical-container', hideTopBanner && 'pfng-vertical-hide-nav' */
        )}
      >
        {!hideTopBanner && topBanner}
        <ContextProvider
          updateNavOnItemHover={this.updateNavOnItemHover}
          updateNavOnItemBlur={this.updateNavOnItemBlur}
          updateNavOnItemClick={this.updateNavOnItemClick}
          hiddenIcons={hiddenIcons}
          inMobileState={inMobileState}
          navCollapsed={navCollapsed}
          hoverDelay={hoverDelay}
          hideDelay={hideDelay}
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
            // TODO nav-pf-persistent-secondary? check pf core for other classes?
            // TODO open an issue on pf-ng for the missing classes?
          })}
        >
          <ListGroup componentClass="ul">{itemComponents}</ListGroup>
        </ContextProvider>
      </nav>
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
  showMobileSecondary: PropTypes.bool,
  showMobileTertiary: PropTypes.bool,
  forceHidden: PropTypes.bool,
  hideTopBanner: PropTypes.bool,
  topBannerContents: PropTypes.node,
  inMobileState: PropTypes.bool,
  activeSecondary: PropTypes.bool,
  hoverDelay: PropTypes.number, // ms
  hideDelay: PropTypes.number, // ms
  // * = Optional, will be called in addition to the component handlers
  onMenuToggleClick: PropTypes.func, // *
  onCollapse: PropTypes.func, // *
  onExpand: PropTypes.func, // *
  onItemClick: PropTypes.func, // *
  onItemHover: PropTypes.func, // *
  onItemBlur: PropTypes.func, // *
  // ** = overrides a this.state value of the same name (see getControlledState())
  showMobileNav: PropTypes.bool, // ** (must also use onCollapse and onExpand to maintain app state)
  navCollapsed: PropTypes.bool, // ** (must also use onCollapse and onExpand to maintain app state)
  hoverSecondaryNav: PropTypes.bool, // ** (must also use onItemHover and onItemBlur to maintain app state)
  hoverTertiaryNav: PropTypes.bool, // ** (must also use onItemHover and onItemBlur to maintain app state)
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
  navCollapsed: null,
  inMobileState: false,
  activeSecondary: false,
  hoverDelay: 500,
  hideDelay: 700,
  onMenuToggleClick: null,
  onCollapse: null,
  onExpand: null,
  onItemClick: null,
  onItemHover: null,
  onItemBlur: null
};

export default VerticalNavigation;
