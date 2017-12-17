import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ListGroup from '../ListGroup/ListGroup';
import VerticalNavigationItem from './VerticalNavigationItem';
import {
  deepestOf,
  itemObjectTypes,
  itemContextTypes,
  provideItemContext,
} from './constants';

// TODO compare with
// http://www.patternfly.org/pattern-library/navigation/vertical-navigation/

// TODO -- get back to how items are stored? still need item ids...

// TODO react-router support?

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
      hoverSecondaryNav: false,
      hoverTertiaryNav: false,
      collapsedSecondaryNav: false,
      collapsedTertiaryNav: false,
      itemBlurTimers: {},
      itemHoverTimers: {},
      itemHoverStates: {},
    };
    this.handleNavBarToggleClick = this.handleNavBarToggleClick.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.onItemHover = this.onItemHover.bind(this);
    this.onItemBlur = this.onItemBlur.bind(this);
    this.updateMobileMenu = this.updateMobileMenu.bind(this);
    this.navigateToItem = this.navigateToItem.bind(this);
  }

  handleNavBarToggleClick() {
    // TODO differentiate between onNavBarToggleClick and handle, like we have for handleItemClick
    const { hideTopBanner } = this.state;
    this.setState({
      hideTopBanner: !hideTopBanner,
    });
  }

  onItemClick(primary, secondary, tertiary) {
    const { inMobileState, handleItemClick } = this.props;
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
    if (handleItemClick) {
      handleItemClick(primary, secondary, tertiary);
    }
  }

  onItemHover(primary, secondary, tertiary) {
    const { inMobileState, handleItemHover, hoverDelay } = this.props;
    const { itemHoverTimers, itemBlurTimers, itemHoverStates } = this.state;
    const that = this; // In case state changes before the setTimeout callback (we can't use this.state in that callback) we need a reference for future state
    const item = deepestOf(primary, secondary, tertiary);
    if (item.children && item.children.length > 0) {
      if (!inMobileState) {
        if (itemBlurTimers[item.id]) {
          clearTimeout(itemBlurTimers[item.id]);
          this.setState({
            itemBlurTimers: { ...itemBlurTimers, [item.id]: null },
          });
        } else if (!itemHoverTimers[item.id] && !itemHoverStates[item.id]) {
          this.setState({
            itemHoverTimers: {
              ...itemHoverTimers,
              [item.id]: setTimeout(() => {
                const hoverTimers = that.state.itemHoverTimers;
                const hoverStates = that.state.itemHoverStates;
                that.setState({
                  hoverSecondaryNav: true,
                  itemHoverTimers: { ...hoverTimers, [item.id]: null },
                  itemHoverStates: { ...hoverStates, [item.id]: true }, // TODO we need an item.id ??? // TODO maybe this instead should be in the item's own state??
                });
                if (handleItemHover) {
                  handleItemHover(primary, secondary, tertiary);
                }
              }, hoverDelay),
            },
          });
        }
      }
    }
  }

  onItemBlur(primary, secondary, tertiary) {
    const { inMobileState, handleItemHover, hideDelay } = this.props;
    const { itemHoverTimers, itemBlurTimers, itemHoverStates } = this.state;
    const that = this; // In case state changes before the setTimeout callback (we can't use this.state in that callback) we need a reference for future state
    const item = deepestOf(primary, secondary, tertiary);
    if (item.children && item.children.length > 0) {
      if (itemHoverTimers[item.id]) {
        clearTimeout(itemHoverTimers[item.id]);
        this.setState({
          itemHoverTimers: { ...itemHoverTimers, [item.id]: null },
        });
      } else if (!itemBlurTimers[item.id] && itemHoverStates[item.id]) {
        this.setState({
          itemBlurTimers: {
            ...itemBlurTimers,
            [item.id]: setTimeout(() => {
              const blurTimers = that.state.itemBlurTimers;
              const hoverStates = that.state.itemHoverStates;
              that.setState({
                /*
                if (!this.primaryHover()) {
                  this.hoverSecondaryNav = false;
                }
                */
                hoverSecondaryNav: false, // TODO FIXME based on above? TODO fixme all these need to have their hoverXNav stuff set right
                itemBlurTimers: { ...blurTimers, [item.id]: null },
                itemHoverStates: { ...hoverStates, [item.id]: false },
              });
            }, hideDelay),
          },
        });
      }
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
    const nonItemChildren =
      childrenArray &&
      childrenArray.filter(child => child.type !== VerticalNavigationItem);
    const itemsFromProps =
      items &&
      items.length > 0 &&
      items.map((primaryItem, i) => (
        <VerticalNavigationItem {...primaryItem}>
          {/* TODO do we need keys in this mapped array of nodes? */}
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
      ));

    const itemComponents = itemsFromProps || itemsFromChildren || [];

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
            <span className="icon-bar" />
          </button>
          <span className="navbar-brand">
            {nonItemChildren || // TODO revisit this? how to best default when they don't have children?
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
        onItemHover={this.onItemHover}
        onItemBlur={this.onItemBlur}
        onItemClick={this.onItemClick}
      >
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
  handleItemClick: PropTypes.func, // Optional, will be called in addition to the component's own this.onItemClick
  handleItemHover: PropTypes.func, // Optional, will be called in addition to the component's own this.onItemHover
  handleItemBlur: PropTypes.func, // Optional, will be called in addition to the component's own this.onItemBlur
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
  hoverDelay: 500,
  hideDelay: 700,
  handleItemClick: () => {},
  handleItemHover: () => {},
  handleItemBlur: () => {},
};

export default VerticalNavigation;
