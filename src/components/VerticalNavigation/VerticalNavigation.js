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

  static deepestOf(pri, sec, ter) {
    return (pri && sec && ter) || (pri && sec) || pri;
  }

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
    const item = VerticalNavigation.deepestOf(primary, secondary, tertiary);
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
    const item = VerticalNavigation.deepestOf(primary, secondary, tertiary);
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
    const item = VerticalNavigation.deepestOf(primary, secondary, tertiary);
    if (item.children && itme.children.length > 0) {
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

  getChildContext() {
    return {
      primaryItem,
      secondaryItem,
      tertiaryItem,
      onItemHover,
      onItemBlur,
      onItemClick,
    };
  }

  render() {
    // TODO refactor to accept children for the masthead TODO FIXME THIS IS NEXT MIKE
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

VerticalNavigation.childContextTypes = VerticalNavigationItem.contextTypes;
