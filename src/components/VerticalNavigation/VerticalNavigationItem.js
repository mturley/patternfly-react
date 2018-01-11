import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import cx from 'classnames';
import { ListGroup, ListGroupItem } from '../ListGroup';
import { OverlayTrigger } from '../OverlayTrigger';
import { Tooltip } from '../Tooltip';
import VerticalNavigation from './VerticalNavigation';
import { bindMethods, controlled } from '../../common/helpers';
import {
  ItemContextProvider,
  getNextDepth,
  deepestOf,
  getItemProps,
  itemObjectTypes,
  itemContextTypes,
  consumeItemContext
} from './constants';

/**
 * VerticalNavigation.Item - a child element for the VerticalNavigation component
 */
class BaseVerticalNavigationItem extends React.Component {
  constructor() {
    super();
    this.state = {
      hoverTimer: null,
      secondaryPinned: false,
      tertiaryPinned: false
    };
    bindMethods(this, [
      'getContextNavItems',
      'pinSecondaryNav',
      'pinTertiaryNav',
      'onItemHover',
      'onItemBlur',
      'onItemClick',
      'onMobileSelection',
      'setAncestorsActive'
    ]);
  }

  componentWillUnmount() {
    // Clear any timers so they don't trigger while the component is unmounted.
    const { hoverTimer } = this.state;
    if (hoverTimer) clearTimeout(hoverTimer);
    this.setState({
      hoverTimer: null
    });
  }

  componentWillReceiveProps(newProps) {
    const { setControlledState } = this.props;
    // If any other secondary/tertiary nav is un-pinned, un-pin them all.
    if (this.props.pinnedSecondaryNav && !newProps.pinnedSecondaryNav) {
      this.setState({ secondaryPinned: false });
    }
    if (this.props.pinnedTertiaryNav && !newProps.pinnedTertiaryNav) {
      this.setState({ tertiaryPinned: false });
    }
    // If there is no more selectedMobileDepth, reset all mobile selection state.
    if (
      this.props.selectedMobileDepth !== null &&
      newProps.selectedMobileDepth === null
    ) {
      setControlledState({ selectedOnMobile: false });
    }
  }

  getNavItem() {
    const { item } = this.props;
    // Properties of the item object take priority over individual item props
    return { ...getItemProps(this.props), ...item };
  }

  getContextNavItems() {
    // We have primary, secondary, and tertiary items as props if they are part of the parent context,
    // but we also want to include the current item when calling handlers.
    const {
      item,
      depth,
      primaryItem,
      secondaryItem,
      tertiaryItem
    } = this.props;
    const navItem = this.getNavItem();
    return {
      primary: depth === 'primary' ? navItem : primaryItem,
      secondary: depth === 'secondary' ? navItem : secondaryItem,
      tertiary: depth === 'tertiary' ? navItem : tertiaryItem
    };
  }

  pinNav(stateKey, updateNav) {
    const {
      isMobile,
      depth,
      clearMobileSelection,
      setControlledState,
      updateAncestorsOnMobileSelection,
      forceHideSecondaryMenu
    } = this.props;
    const { primary } = this.getContextNavItems();
    const pinned = this.state[stateKey];
    if (isMobile) {
      // On mobile, the pin buttons act as back buttons instead.
      if (depth === 'primary') {
        // Going back to primary nav clears all selection.
        clearMobileSelection();
      } else if (depth === 'secondary') {
        // Going back to secondary nav de-selects this item and re-selects the primary parent.
        setControlledState({ selectedOnMobile: false });
        updateAncestorsOnMobileSelection(primary);
      }
    } else {
      this.setState({ [stateKey]: !pinned });
      this.setAncestorsActive(!pinned);
      if (pinned) {
        forceHideSecondaryMenu();
        this.onItemBlur(true);
      }
    }
    updateNav(!pinned);
  }

  pinSecondaryNav() {
    // TODO these don't really need to be separate by depth, do they...?
    this.pinNav('secondaryPinned', this.props.updateNavOnPinSecondary);
  }

  pinTertiaryNav() {
    this.pinNav('tertiaryPinned', this.props.updateNavOnPinTertiary);
  }

  onItemHover() {
    const { primary, secondary, tertiary } = this.getContextNavItems();
    const {
      isMobile,
      hoverDelay,
      updateNavOnItemHover,
      onHover,
      setControlledState,
      hovering
    } = this.props;
    const { hoverTimer } = this.state;
    const that = this;
    const item = deepestOf(primary, secondary, tertiary);
    if (item.subItems && item.subItems.length > 0) {
      if (!isMobile) {
        if (hoverTimer) {
          clearTimeout(hoverTimer);
          this.setState({ hoverTimer: null });
        } else if (!hovering) {
          this.setState({
            hoverTimer: setTimeout(() => {
              that.setState({ hoverTimer: null });
              setControlledState({ hovering: true });
              updateNavOnItemHover(primary, secondary, tertiary);
              onHover && onHover(primary, secondary, tertiary);
            }, hoverDelay)
          });
        }
      }
    }
  }

  onItemBlur(immediate) {
    const { primary, secondary, tertiary } = this.getContextNavItems();
    const {
      isMobile,
      hideDelay,
      updateNavOnItemBlur,
      onBlur,
      setControlledState,
      hovering
    } = this.props;
    const { hoverTimer } = this.state;
    const that = this;
    const item = deepestOf(primary, secondary, tertiary);
    if (item.subItems && item.subItems.length > 0) {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        this.setState({ hoverTimer: null });
      } else if (hovering) {
        this.setState({
          hoverTimer: setTimeout(() => {
            that.setState({ hoverTimer: null });
            setControlledState({ hovering: false });
            updateNavOnItemBlur(primary, secondary, tertiary);
            onBlur && onBlur(primary, secondary, tertiary);
          }, immediate ? 1 : hideDelay)
        });
      }
    }
  }

  onItemClick() {
    const { primary, secondary, tertiary } = this.getContextNavItems();
    const {
      isMobile,
      updateNavOnItemClick,
      onClick,
      setControlledState
    } = this.props;
    updateNavOnItemClick(primary, secondary, tertiary); // Clears all mobile selections
    if (isMobile) {
      this.onMobileSelection(primary, secondary, tertiary); // Applies new mobile selection here
    }
    onClick && onClick(primary, secondary, tertiary);
    // TODO other item-level nav props? href? route?
  }

  onMobileSelection(primary, secondary, tertiary) {
    const { setControlledState, updateAncestorsOnMobileSelection } = this.props;
    setControlledState({ selectedOnMobile: true });
    updateAncestorsOnMobileSelection(primary, secondary, tertiary);
  }

  renderBadges(badges) {
    // TODO we don't know about this-- it needs to optionally be a child that you can pass? this is the default?  TODO DOCUMENT IT!
    // TODO yeah this needs to be VerticalNavigation.Badge or something
    const { showBadges } = this.props;
    return (
      (showBadges &&
        badges && (
          <div className="badge-container-pf">
            {badges.map(badge => (
              <OverlayTrigger
                key={badge.badgeClass}
                placement="right"
                overlay={
                  <Tooltip id={badge.badgeClass}>{badge.tooltip}</Tooltip>
                }
              >
                <div className={cx('badge', badge.badgeClass)}>
                  {badge.count &&
                    badge.iconStyleClass && (
                      <span className={badge.iconStyleClass} />
                    )}
                  {badge.count && <span>{badge.count}</span>}
                </div>
              </OverlayTrigger>
            ))}
          </div>
        )) ||
      null
    );
  }

  setAncestorsActive(active) {
    const { setAncestorsActive, setControlledState } = this.props;
    setControlledState({ active: active });
    setAncestorsActive && setAncestorsActive(active);
  }

  render() {
    const {
      pinnableMenus,
      hiddenIcons,
      navCollapsed,
      isMobile,
      selectedMobileDepth,
      selectedOnMobile,
      onItemHover,
      onItemBlur,
      onItemClick,
      children,
      hovering
    } = this.props;
    const { secondaryPinned, tertiaryPinned } = this.state;

    // TODO FIXME this code is duplicated in both VertNav and VertNavItem
    const showMobileSecondary =
      isMobile &&
      (selectedMobileDepth === 'primary' ||
        selectedMobileDepth === 'secondary');
    const showMobileTertiary = isMobile && selectedMobileDepth === 'secondary';

    // The nav item can either be passed directly as one item object prop, or as individual props.
    const navItem = this.getNavItem();
    const { active, title, iconStyleClass, badges, subItems } = navItem;

    const childItemComponents =
      (children &&
        React.Children.count(children) > 0 &&
        React.Children.toArray(children).filter(
          child =>
            child.type.displayName &&
            child.type.displayName.includes('VerticalNavigationItem')
        )) ||
      (subItems &&
        subItems.length > 0 &&
        subItems.map(childItem => (
          <VerticalNavigationItem item={childItem} key={childItem.title} />
        )));

    const depth = this.props.depth || 'primary';
    const nextDepth = getNextDepth(depth);

    // We only have primary, secondary, and tertiary depths, so nextDepth will only ever be secondary or tertiary.
    const nextDepthPinned =
      nextDepth === 'secondary' ? secondaryPinned : tertiaryPinned;
    const pinNextDepth =
      nextDepth === 'secondary' ? this.pinSecondaryNav : this.pinTertiaryNav;

    const icon = iconStyleClass && (
      <span
        className={cx(iconStyleClass, { hidden: hiddenIcons })}
        title={title}
      />
    );

    return (
      <ListGroupItem
        listItem // Renders as <li>. Other props can change this, see logic in react-bootstrap's ListGroupItem.
        className={cx({
          [`${nextDepth}-nav-item-pf`]:
            depth !== 'tertiary' &&
            childItemComponents &&
            childItemComponents.length > 0,
          active, // This is the only class we have at the tertiary depth.
          'is-hover': nextDepthPinned || (depth !== 'tertiary' && hovering),
          // This class is present at primary and secondary depths if selectedOnMobile is true,
          // except for the primary depth, where it is only present if showMobileSecondary is also true.
          'mobile-nav-item-pf':
            selectedOnMobile &&
            ((depth === 'primary' && showMobileSecondary) ||
              depth === 'secondary'),
          // This class is confusingly named, but the logic is more readable.
          'mobile-secondary-item-pf':
            selectedOnMobile && depth === 'primary' && showMobileTertiary
          // I don't know, that's just how this stuff was in patternfly-ng...
        })}
        onMouseEnter={this.onItemHover}
        // NOTE onItemBlur takes a boolean, we want to prevent it being passed a truthy event.
        onMouseLeave={e => this.onItemBlur(false)}
      >
        <a onClick={this.onItemClick}>
          {depth === 'primary' &&
            icon &&
            (navCollapsed ? (
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id={title}>{title}</Tooltip>}
              >
                {icon}
              </OverlayTrigger>
            ) : (
              icon
            ))}
          <span className="list-group-item-value">{title}</span>
          {this.renderBadges(badges)}
        </a>
        {childItemComponents &&
          childItemComponents.length > 0 && (
            <div className={`nav-pf-${nextDepth}-nav`}>
              <div className="nav-item-pf-header">
                {pinnableMenus && (
                  <a
                    className={cx(`${nextDepth}-collapse-toggle-pf`, {
                      collapsed: nextDepthPinned
                    })}
                    onClick={() => {
                      pinNextDepth();
                    }}
                  />
                )}
                <span>{title}</span>
              </div>
              <ItemContextProvider
                {...this.props}
                item={navItem}
                setAncestorsActive={this.setAncestorsActive}
                updateAncestorsOnMobileSelection={this.onMobileSelection} // Override (helper calls parent's updateAncestorsOnMobileSelection)
              >
                <ListGroup componentClass="ul">{childItemComponents}</ListGroup>
              </ItemContextProvider>
            </div>
          )}
      </ListGroupItem>
    );
  }
}

const controlledStateTypes = {
  active: PropTypes.bool,
  hovering: PropTypes.bool,
  selectedOnMobile: PropTypes.bool
};

BaseVerticalNavigationItem.propTypes = {
  ...controlledStateTypes,
  item: PropTypes.shape(itemObjectTypes),
  ...itemObjectTypes, // Each of the item object's properties can alternatively be passed directly as a prop.
  ...itemContextTypes,
  isMobile: PropTypes.bool,
  selectedMobileDepth: PropTypes.oneOf([null, 'primary', 'secondary']),
  onHover: PropTypes.func,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.node,
  setControlledState: PropTypes.func
};

const defaultControlledState = {
  active: null,
  hovering: null,
  selectedOnMobile: null
};

BaseVerticalNavigationItem.defaultProps = {
  title: '',
  selectedMobileDepth: null
};

const VerticalNavigationItem = controlled(
  controlledStateTypes,
  defaultControlledState
)(consumeItemContext(BaseVerticalNavigationItem));

VerticalNavigationItem.displayName = 'VerticalNavigationItem';
VerticalNavigationItem.propTypes = BaseVerticalNavigationItem.propTypes;
VerticalNavigationItem.defaultProps = BaseVerticalNavigationItem.defaultProps;

export default VerticalNavigationItem;
