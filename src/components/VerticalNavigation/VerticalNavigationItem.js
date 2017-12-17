import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import cx from 'classnames';
import { ListGroup, ListGroupItem } from '../ListGroup';
import OverlayTrigger from '../OverlayTrigger';
import Tooltip from '../Tooltip';
import VerticalNavigation from './VerticalNavigation';
import {
  getNextDepth,
  getItemProps,
  itemObjectTypes,
  itemContextTypes,
  consumeAndProvideItemContext,
} from './constants';

/**
 * VerticalNavigationItem - a child element for the VerticalNavigation component
 */
class VerticalNavigationItem extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.getContextNavItems = this.getContextNavItems.bind(this);
    this.onItemEvent = this.onItemEvent.bind(this);
    this.onItemHover = this.onItemHover.bind(this);
    this.onItemBlur = this.onItemBlur.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
  }

  getContextNavItems() {
    // We have primary, secondary, and tertiary items as props if they are part of the parent context,
    // but we also want to include the current item when calling handlers.
    const {
      item,
      depth,
      primaryItem,
      secondaryItem,
      tertiaryItem,
    } = this.props;
    const navItem = item || getItemProps(this.props);
    return {
      primary: depth === 'primary' ? navItem : primaryItem,
      secondary: depth === 'secondary' ? navItem : secondaryItem,
      tertiary: depth === 'tertiary' ? navItem : tertiaryItem,
    };
  }

  onItemEvent(callback) {
    const { primary, secondary, tertiary } = this.getContextNavItems();
    callback(primary, secondary, tertiary);
  }

  onItemHover() {
    // TODO allow handleItemHover props etc at the item level???
    this.onItemEvent(this.props.onItemHover);
  }

  onItemBlur() {
    // TODO allow handleItemHover props etc at the item level???
    this.onItemEvent(this.props.onItemBlur);
  }

  onItemClick() {
    // TODO allow handleItemHover props etc at the item level???
    this.onItemEvent(this.props.onItemClick);
  }

  renderBadges(badges) {
    // TODO we don't know about this-- it needs to optionally be a child that you can pass? this is the default?  TODO DOCUMENT IT!
    const { showBadges } = this.props;
    return (
      showBadges &&
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
      )
    );
  }

  render() {
    const {
      item,
      showMobileSecondary,
      showMobileTertiary,
      navCollapsed,
      inMobileState,
      onItemHover,
      onItemBlur,
      onItemClick,
      children,
    } = this.props;

    // The nav item can either be passed directly as one item object prop, or as individual props.
    const navItem = item || getItemProps(this.props);

    const {
      title,
      trackActiveState,
      trackHoverState,
      mobileItem,
      iconStyleClass,
      badges,
    } = navItem;

    const childItemComponents =
      (children &&
        React.Children.count(children) > 0 &&
        React.Children.toArray(children).filter(
          child => child.type === VerticalNavigationItem,
        )) ||
      (navItem.children &&
        navItem.children.length > 0 &&
        navItem.children.map(childItem => (
          <VerticalNavigationItem item={childItem} />
        )));

    const depth = this.props.depth || 'primary';
    const nextDepth = getNextDepth(depth);

    // Default to collapsed unless we explicitly pass collapsed = false.
    const secondaryCollapsed = this.props.secondaryCollapsed !== false;
    const tertiaryCollapsed = this.props.tertiaryCollapsed !== false;

    // We only have primary, secondary, and tertiary depths, so nextDepth will only ever be secondary or tertiary.
    const nextDepthCollapsed =
      nextDepth === 'secondary' ? secondaryCollapsed : tertiaryCollapsed;
    const collapseNextNav =
      nextDepth === 'secondary'
        ? this.collapseSecondaryNav
        : this.collapseTertiaryNav;

    return (
      <ListGroupItem
        listItem // Renders as <li>. Other props can change this, see logic in react-bootstrap's ListGroupItem.
        className={cx({
          [`${nextDepth}-nav-item-pf`]:
            depth !== 'tertiary' && children && children.length > 0,
          active: trackActiveState, // This is the only class we have at the tertiary depth.
          'is-hover': depth !== 'tertiary' && trackHoverState,
          // This class is present at primary and secondary depths if mobileItem is true,
          // except for the primary depth, where it is only present if showMobileSecondary is also true.
          'mobile-nav-item-pf':
            mobileItem &&
            ((depth === 'primary' && showMobileSecondary) ||
              depth === 'secondary'),
          // This class is confusingly named, but the logic is more readable.
          'mobile-secondary-item-pf':
            mobileItem && depth === 'primary' && showMobileTertiary,
          // I don't know, that's just how this stuff was in patternfly-ng...
        })}
        onMouseEnter={this.onItemHover}
        onMouseLeave={this.onItemBlur}
      >
        <a onClick={this.onItemClick}>
          {depth === 'primary' &&
            iconStyleClass && (
              <OverlayTrigger
                placement="bottom"
                overlay={navCollapsed ? <Tooltip>{title}</Tooltip> : null}
              >
                <span
                  className={cx(iconStyleClass, { hidden: hiddenIcons })}
                  title={title}
                />
              </OverlayTrigger>
            )}
          <span className="list-group-item-value">{title}</span>
          {this.renderBadges(badges)}
        </a>
        {children &&
          React.Children.count(children) > 0 && (
            <div className="nav-pf-secondary-nav">
              {' '}
              {/* TODO should this class sometimes say tertiary? */}
              <div className="nav-item-pf-header">
                <a
                  className={cx(`${nextDepth}-collapse-toggle-pf`, {
                    collapsed: nextDepthCollapsed,
                  })}
                  onClick={() => {
                    collapseNextNav('TODO args here');
                  }} // TODO what is the item arg in these calls?  some subset of props? pass what we need from it instead.
                />
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
  showMobileSecondary: PropTypes.bool,
  showMobileTertiary: PropTypes.bool,
  navCollapsed: PropTypes.bool,
  secondaryCollapsed: PropTypes.bool,
  tertiaryCollapsed: PropTypes.bool,
  inMobileState: PropTypes.bool,
  children: PropTypes.node,
};

VerticalNavigationItem.defaultProps = {
  title: '',
  trackActiveState: true,
  trackHoverState: true,
  mobileItem: false,
  showMobileSecondary: false,
  showMobileTertiary: false,
  navCollapsed: false,
};

export default consumeAndProvideItemContext(VerticalNavigationItem);
