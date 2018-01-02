import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import cx from 'classnames';
import { ListGroup, ListGroupItem } from '../ListGroup';
import { OverlayTrigger } from '../OverlayTrigger';
import { Tooltip } from '../Tooltip';
import VerticalNavigation from './VerticalNavigation';
import { bindMethods } from '../../common/helpers';
import {
  getNextDepth,
  deepestOf,
  getItemProps,
  itemObjectTypes,
  itemContextTypes,
  consumeAndProvideItemContext
} from './constants';

/**
 * VerticalNavigation.Item - a child element for the VerticalNavigation component
 */
class VerticalNavigationItem extends React.Component {
  constructor() {
    super();
    this.state = {
      hovering: false, // TODO should we allow hovering to be controlled by a prop too?
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
      'onItemClick'
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
    // If any other secondary/tertiary nav is un-pinned, un-pin them all.
    if (this.props.pinnedSecondaryNav && !newProps.pinnedSecondaryNav) {
      this.setState({ secondaryPinned: false });
    }
    if (this.props.pinnedTertiaryNav && !newProps.pinnedTertiaryNav) {
      this.setState({ tertiaryPinned: false });
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
    const { inMobileState, forceHideSecondaryMenu } = this.props;
    const pinned = this.state[stateKey];
    if (!inMobileState) {
      this.setState({ [stateKey]: !pinned });
      if (pinned) forceHideSecondaryMenu();
    }
    updateNav(!pinned);
  }

  pinSecondaryNav() {
    this.pinNav('secondaryPinned', this.props.updateNavOnPinSecondary);
  }

  pinTertiaryNav() {
    this.pinNav('tertiaryPinned', this.props.updateNavOnPinTertiary);
  }

  onItemHover() {
    const { primary, secondary, tertiary } = this.getContextNavItems();
    const {
      inMobileState,
      hoverDelay,
      updateNavOnItemHover,
      onHover
    } = this.props;
    const { hoverTimer, hovering } = this.state;
    const that = this;
    const item = deepestOf(primary, secondary, tertiary);
    if (item.subItems && item.subItems.length > 0) {
      if (!inMobileState) {
        if (hoverTimer) {
          clearTimeout(hoverTimer);
          this.setState({ hoverTimer: null });
        } else if (!hovering) {
          this.setState({
            hoverTimer: setTimeout(() => {
              that.setState({
                hoverTimer: null,
                hovering: true
              });
              updateNavOnItemHover(primary, secondary, tertiary);
              onHover && onHover(primary, secondary, tertiary);
            }, hoverDelay)
          });
        }
      }
    }
  }

  onItemBlur() {
    const { primary, secondary, tertiary } = this.getContextNavItems();
    const {
      inMobileState,
      hideDelay,
      updateNavOnItemBlur,
      onBlur
    } = this.props;
    const { hoverTimer, hovering } = this.state;
    const that = this;
    const item = deepestOf(primary, secondary, tertiary);
    if (item.subItems && item.subItems.length > 0) {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        this.setState({ hoverTimer: null });
      } else if (hovering) {
        this.setState({
          hoverTimer: setTimeout(() => {
            that.setState({
              hoverTimer: null,
              hovering: false
            });
            updateNavOnItemBlur(primary, secondary, tertiary);
            onBlur && onBlur(primary, secondary, tertiary);
          }, hideDelay)
        });
      }
    }
  }

  onItemClick() {
    const { primary, secondary, tertiary } = this.getContextNavItems();
    const { updateNavOnItemClick, onClick } = this.props;
    updateNavOnItemClick(primary, secondary, tertiary);
    onClick && onClick(primary, secondary, tertiary);
    // TODO other item-level nav props? href? route?
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
                overlay={<Tooltip>{badge.tooltip}</Tooltip>}
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

  render() {
    const {
      item,
      pinnableMenus,
      hiddenIcons,
      showMobileSecondary,
      showMobileTertiary,
      navCollapsed,
      inMobileState,
      onItemHover,
      onItemBlur,
      onItemClick,
      children
    } = this.props;

    const { hovering, secondaryPinned, tertiaryPinned } = this.state;

    // The nav item can either be passed directly as one item object prop, or as individual props.
    const navItem = this.getNavItem();
    const { title, mobileItem, iconStyleClass, badges, subItems } = navItem;

    const childItemComponents =
      (children &&
        React.Children.count(children) > 0 &&
        React.Children.toArray(children).filter(
          child => child.type === VerticalNavigationItem
        )) ||
      (subItems &&
        subItems.length > 0 &&
        subItems.map(childItem => (
          <VerticalNavigationItem item={childItem} key={childItem.title} />
        )));

    const depth = this.props.depth || 'primary';
    const nextDepth = getNextDepth(depth);

    const pinnedSecondaryNav = this.props.pinnedSecondaryNav;
    const pinnedTertiaryNav = this.props.pinnedTertiaryNav;

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
            depth !== 'tertiary' && children && children.length > 0,
          active: this.props.active || navItem.active, // This is the only class we have at the tertiary depth.
          'is-hover': nextDepthPinned || (depth !== 'tertiary' && hovering),
          // This class is present at primary and secondary depths if mobileItem is true,
          // except for the primary depth, where it is only present if showMobileSecondary is also true.
          'mobile-nav-item-pf':
            mobileItem &&
            ((depth === 'primary' && showMobileSecondary) ||
              depth === 'secondary'),
          // This class is confusingly named, but the logic is more readable.
          'mobile-secondary-item-pf':
            mobileItem && depth === 'primary' && showMobileTertiary
          // I don't know, that's just how this stuff was in patternfly-ng...
        })}
        onMouseEnter={this.onItemHover}
        onMouseLeave={this.onItemBlur}
      >
        <a onClick={this.onItemClick}>
          {depth === 'primary' &&
            icon &&
            (navCollapsed ? (
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>{title}</Tooltip>}
              >
                {icon}
              </OverlayTrigger>
            ) : (
              icon
            ))}
          <span className="list-group-item-value">{title}</span>
          {this.renderBadges(badges)}
        </a>
        {children &&
          React.Children.count(children) > 0 && (
            <div className="nav-pf-secondary-nav">
              {/* TODO should this class sometimes say tertiary? */}
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
              <ListGroup componentClass="ul">{childItemComponents}</ListGroup>
            </div>
          )}
      </ListGroupItem>
    );
  }
}

VerticalNavigationItem.propTypes = {
  item: PropTypes.shape(itemObjectTypes),
  ...itemObjectTypes, // Each of the item object's properties can alternatively be passed directly as a prop.
  ...itemContextTypes,
  showMobileSecondary: PropTypes.bool, // TODO ???
  showMobileTertiary: PropTypes.bool, // TODO ???
  inMobileState: PropTypes.bool,
  onHover: PropTypes.func,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.node
};

VerticalNavigationItem.defaultProps = {
  title: '',
  active: false,
  mobileItem: true,
  showMobileSecondary: false,
  showMobileTertiary: false
};

export default consumeAndProvideItemContext(VerticalNavigationItem);
