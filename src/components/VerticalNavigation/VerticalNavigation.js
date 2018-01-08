import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ListGroup from '../ListGroup/ListGroup';
import VerticalNavigationItem from './VerticalNavigationItem';
import VerticalNavigationMasthead from './VerticalNavigationMasthead';
import { bindMethods, getControlledState } from '../../common/helpers';
import { layout } from '../../common/patternfly';
import {
  ItemContextProvider,
  deepestOf,
  itemObjectTypes,
  itemContextTypes,
  provideItemContext,
  getBodyContentElement
} from './constants';

// TODO -- mobile friendly! ---- reimplement updateMobileMenu stuff
// TODO -- break things out into PrimaryItem, SecondaryItem, TertiaryItem
// TODO -- what else is implemented in the ng version that I'm missing?
// TODO react-router support?
// TODO all the other TODOs....

// TODO build it into the demo app!

/**
 * VerticalNavigation - The Vertical Navigation pattern
 * http://www.patternfly.org/pattern-library/navigation/vertical-navigation/
 */
class VerticalNavigation extends React.Component {
  constructor(props) {
    super();
    this.state = {
      mobileLayout: layout.is('mobile'),
      showMobileNav: false,
      navCollapsed: false,
      explicitCollapse: false, // TODO do we need this?
      numHoveredPrimary: 0,
      numHoveredSecondary: 0,
      hoverSecondaryNav: false,
      hoverTertiaryNav: false,
      pinnedSecondaryNav: false,
      pinnedTertiaryNav: false
    };
    bindMethods(this, [
      'controlledState',
      'onLayoutChange',
      'onMenuToggleClick',
      'collapseMenu',
      'expandMenu',
      'updateHoverState',
      'updateNavOnItemHover',
      'updateNavOnItemBlur',
      'updateNavOnItemClick',
      'updateMobileMenu',
      'updateNavOnPinSecondary',
      'updateNavOnPinTertiary',
      'forceHideSecondaryMenu',
      'navigateToItem'
    ]);
  }

  componentDidMount() {
    // If the mobileLayout prop is being used, we don't bother listening for layout changes here.
    const { mobileLayout } = this.props;
    if (mobileLayout !== true && mobileLayout !== false) {
      layout.addChangeListener(this.onLayoutChange);
    }
  }

  componentWillUnmount() {
    layout.removeChangeListener(this.onLayoutChange);
  }

  onLayoutChange(layout) {
    this.setState({ mobileLayout: layout === 'mobile' });
  }

  // NOTE: If you use any of these props, be sure to also use the corresponding callbacks/handlers.
  controlledState() {
    return getControlledState(this.props, this.state, [
      'mobileLayout',
      'showMobileNav',
      'navCollapsed',
      'hoverSecondaryNav',
      'hoverTertiaryNav',
      'pinnedSecondaryNav',
      'pinnedTertiaryNav'
    ]);
  }

  onMenuToggleClick() {
    const { onMenuToggleClick } = this.props;
    const {
      mobileLayout,
      showMobileNav,
      navCollapsed
    } = this.controlledState();
    if (mobileLayout) {
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
    // Since the hideTimer can be longer than the hoverTimer, it is possible for two items to be "hovering" at a time.
    // We must guard against this race condition, or a long-running hideTimer can undo a hover triggered later.
    // We keep a count and only remove the hover styles if there are really no more hovered items in that tier.
    const { numHoveredPrimary, numHoveredSecondary } = this.state;
    const doUpdate = (numHoveredKey, hoverStateKey) => {
      const newNumHovered = this.state[numHoveredKey] + (hovering ? 1 : -1);
      this.setState({ [numHoveredKey]: newNumHovered });
      if (hovering || newNumHovered < 1) {
        this.setState({ [hoverStateKey]: hovering });
      }
      return newNumHovered;
    };
    if (primary) {
      if (secondary) {
        const newNum = doUpdate('numHoveredSecondary', 'hoverTertiaryNav');
        return {
          numHoveredPrimary,
          numHoveredSecondary: newNum
        };
      } else {
        const newNum = doUpdate('numHoveredPrimary', 'hoverSecondaryNav');
        return {
          numHoveredPrimary: newNum,
          numHoveredSecondary
        };
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
    const { numHoveredPrimary, numHoveredSecondary } = this.updateHoverState(
      false,
      primary,
      secondary,
      tertiary
    );
    if (primary && !secondary && !tertiary && numHoveredPrimary === 0) {
      this.setState({ hoverSecondaryNav: false });
    }
    if (primary && secondary && !tertiary && numHoveredSecondary === 0) {
      this.setState({ hoverTertiaryNav: false });
    }
    if (onItemBlur) {
      onItemBlur(primary, secondary, tertiary);
    }
  }

  updateNavOnItemClick(primary, secondary, tertiary) {
    const { onItemClick } = this.props;
    const { mobileLayout } = this.controlledState();
    const item = deepestOf(primary, secondary, tertiary);
    if (mobileLayout) {
      if (item.subItems && item.subItems.length > 0) {
        this.updateMobileMenu(primary, secondary, tertiary); // TODO figure out what this did in ng
      } else {
        this.updateMobileMenu(); // TODO figure out what this did in ng (expanded states?)
      }
    }
    if (!mobileLayout || !item.subItems || item.subItems.length === 0) {
      this.navigateToItem(item);
    }
    onItemClick && onItemClick(primary, secondary, tertiary);
  }

  updateMobileMenu() {
    console.log('TODO update menu', arguments); // TODO
  }

  updateNavOnPinSecondary(pinned) {
    const { onPinSecondary } = this.props;
    const { mobileLayout } = this.controlledState();
    if (mobileLayout) {
      this.updateMobileMenu();
    } else {
      this.setState({ pinnedSecondaryNav: pinned });
      onPinSecondary && onPinSecondary(pinned);
    }
    this.setState({ hoverSecondaryNav: false });
  }

  updateNavOnPinTertiary(pinned) {
    const { onPinTertiary } = this.props;
    const { mobileLayout } = this.controlledState();
    if (mobileLayout) {
      // TODO WEIRD USAGE OF UPDATEMOBILEMENU???
      /* from ng:
      this.items.forEach((primaryItem) => {
        if (primaryItem.children) {
          primaryItem.children.forEach((secondaryItem) => {
            if (secondaryItem === item) {
              this.updateMobileMenu(primaryItem);
            }
          });
        }
      });
      */
    } else {
      this.setState({ pinnedTertiaryNav: pinned });
      onPinTertiary && onPinTertiary(pinned);
    }
    this.setState({ hoverSecondaryNav: false, hoverTertiaryNav: false });
    if (pinned) {
      this.updateNavOnPinSecondary(false);
    }
  }

  forceHideSecondaryMenu() {
    // TODO do we really need this?
    this.setState({ forceHidden: true });
    setTimeout(() => {
      this.setState({ forceHidden: false });
    }, 500);
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

    const masthead =
      childrenArray &&
      childrenArray.find(child => child.type === VerticalNavigationMasthead);

    const {
      hidden,
      hiddenIcons,
      persistentSecondary,
      pinnableMenus,
      showBadges,
      showMobileSecondary,
      showMobileTertiary,
      forceHidden,
      hideTopBanner,
      hoverDelay,
      hideDelay,
      activeSecondary, // ???
      topBannerContents,
      notificationDrawer /* TODO notification drawer components? */
    } = this.props;
    const {
      mobileLayout,
      showMobileNav,
      navCollapsed,
      pinnedSecondaryNav,
      pinnedTertiaryNav,
      hoverSecondaryNav,
      hoverTertiaryNav
    } = this.controlledState();

    const header = (
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
        {masthead}
      </div>
    );

    return (
      <nav // TODO do we need classes like the commented out ones here?
        className={cx(
          'navbar navbar-pf-vertical' /* 'pf-vertical-container', hideTopBanner && 'pfng-vertical-hide-nav' */
        )}
      >
        {/* TODO these three should be one fragment when we upgrade to react 16.2 */}
        {!hideTopBanner && header}
        {!hideTopBanner && (
          <nav className="collapse navbar-collapse">{topBannerContents}</nav>
        )}
        {!hideTopBanner && notificationDrawer}
        <ItemContextProvider
          updateNavOnItemHover={this.updateNavOnItemHover}
          updateNavOnItemBlur={this.updateNavOnItemBlur}
          updateNavOnItemClick={this.updateNavOnItemClick}
          hiddenIcons={hiddenIcons}
          pinnableMenus={pinnableMenus}
          mobileLayout={mobileLayout}
          navCollapsed={navCollapsed}
          pinnedSecondaryNav={pinnedSecondaryNav}
          pinnedTertiaryNav={pinnedTertiaryNav}
          updateNavOnPinSecondary={this.updateNavOnPinSecondary}
          updateNavOnPinTertiary={this.updateNavOnPinTertiary}
          forceHideSecondaryMenu={this.forceHideSecondaryMenu}
          hoverDelay={hoverDelay}
          hideDelay={hideDelay}
        >
          <div
            className={cx('nav-pf-vertical nav-pf-vertical-with-sub-menus', {
              'nav-pf-vertical-collapsible-menus': pinnableMenus,
              'hidden-icons-pf': hiddenIcons,
              'nav-pf-vertical-with-badges': showBadges,
              'nav-pf-persistent-secondary': persistentSecondary,
              'secondary-visible-pf': activeSecondary,
              'show-mobile-secondary': showMobileSecondary,
              'show-mobile-tertiary': showMobileTertiary,
              'hover-secondary-nav-pf': hoverSecondaryNav,
              'hover-tertiary-nav-pf': hoverTertiaryNav,
              'collapsed-secondary-nav-pf': pinnedSecondaryNav,
              'collapsed-tertiary-nav-pf': pinnedTertiaryNav,
              hidden: mobileLayout,
              collapsed: navCollapsed,
              'force-hide-secondary-nav-pf': forceHidden,
              'show-mobile-nav': showMobileNav
              // TODO nav-pf-persistent-secondary? check pf core for other classes?
              // TODO open an issue on pf-ng for the missing classes?
            })}
          >
            <ListGroup componentClass="ul">{itemComponents}</ListGroup>
          </div>
        </ItemContextProvider>
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
  showBadges: PropTypes.bool,
  showMobileSecondary: PropTypes.bool,
  showMobileTertiary: PropTypes.bool,
  forceHidden: PropTypes.bool,
  hideTopBanner: PropTypes.bool,
  topBannerContents: PropTypes.node,
  mobileLayout: PropTypes.bool,
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
  onPinSecondary: PropTypes.func, // *
  onPinTertiary: PropTypes.func, // *
  // ** = overrides a this.state value of the same name (see controlledState())
  showMobileNav: PropTypes.bool, // ** (must also use onCollapse and onExpand to maintain app state)
  navCollapsed: PropTypes.bool, // ** (must also use onCollapse and onExpand to maintain app state)
  hoverSecondaryNav: PropTypes.bool, // ** (must also use onItemHover and onItemBlur to maintain app state)
  hoverTertiaryNav: PropTypes.bool, // ** (must also use onItemHover and onItemBlur to maintain app state)
  pinnedSecondaryNav: PropTypes.bool, // ** (must also use onPinSecondary to maintain app state)
  pinnedTertiaryNav: PropTypes.bool, // ** (must also use onPinTertiary to maintain app state)
  children: PropTypes.node
};

VerticalNavigation.defaultProps = {
  items: null,
  hidden: false,
  persistentSecondary: false,
  pinnableMenus: true,
  hiddenIcons: false,
  showBadges: true,
  showMobileNav: true,
  showMobileSecondary: false,
  showMobileTertiary: false,
  forceHidden: false,
  hideTopBanner: false,
  topBannerContents: null,
  navCollapsed: null,
  mobileLayout: null,
  activeSecondary: false,
  hoverDelay: 500,
  hideDelay: 700,
  onMenuToggleClick: null,
  onCollapse: null,
  onExpand: null,
  onPinSecondary: null,
  onPinTertiary: null,
  onItemClick: null,
  onItemHover: null,
  onItemBlur: null
};

VerticalNavigation.displayName = 'VerticalNavigation';

export default VerticalNavigation;
