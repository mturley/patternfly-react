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
  deepestOf,
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
    this.state = {
      hovering: false,
      hoverTimer: null,
      blurTimer: null,
    };
    this.getContextNavItems = this.getContextNavItems.bind(this);
    this.onItemHover = this.onItemHover.bind(this);
    this.onItemBlur = this.onItemBlur.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
  }

  componentWillUnmount() {
    // Clear both timers so they don't trigger while the component is unmounted.
    const { hoverTimer, blurTimer } = this.state;
    if (hoverTimer) clearTimeout(hoverTimer);
    if (blurTimer) clearTimeout(blurTimer);
    this.setState({
      hoverTimer: null,
      blurTimer: null,
    });
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

  onItemHover() {
    const { primary, secondary, tertiary } = this.getContextNavItems();
    const {
      inMobileState,
      hoverDelay,
      updateNavOnItemHover,
      onHover,
    } = this.props;
    const { hoverTimer, blurTimer, hovering } = this.state;
    const that = this;
    const item = deepestOf(primary, secondary, tertiary);
    if (item.children && item.children.length > 0) {
      if (!inMobileState) {
        if (blurTimer) {
          clearTimeout(blurTimer);
          this.setState({ blurTimer: null });
        } else if (!hoverTimer && !hovering) {
          this.setState({
            hoverTimer: setTimeout(() => {
              that.setState({
                hoverTimer: null,
                hovering: true,
              });
              updateNavOnItemHover(primary, secondary, tertiary);
              if (onHover) {
                onHover(primary, secondary, tertiary);
              }
            }, hoverDelay),
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
      onBlur,
    } = this.props;
    const { hoverTimer, blurTimer, hovering } = this.state;
    const that = this;
    const item = deepestOf(primary, secondary, tertiary);
    if (item.children && item.children.length > 0) {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        this.setState({ hoverTimer: null });
      } else if (!blurTimer && hovering) {
        this.setState({
          blurTimer: setTimeout(() => {
            that.setState({
              blurTimer: null,
              hovering: false,
            });
            updateNavOnItemBlur(primary, secondary, tertiary);
            if (onBlur) {
              onBlur(primary, secondary, tertiary);
            }
          }, hideDelay),
        });
      }
    }
  }

  onItemClick() {
    const { primary, secondary, tertiary } = this.getContextNavItems();
    const { updateNavOnItemClick, onClick } = this.props;
    updateNavOnItemClick(primary, secondary, tertiary);
    if (onClick) {
      onClick(primary, secondary, tertiary);
    }
    // TODO other item-level nav props? href? route?
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

    const { hovering } = this.state;

    // The nav item can either be passed directly as one item object prop, or as individual props.
    const navItem = item || getItemProps(this.props);

    const {
      title,
      trackActiveState,
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
          <VerticalNavigationItem item={childItem} key={childItem.title} />
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
          'is-hover': depth !== 'tertiary' && hovering,
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
  showMobileSecondary: PropTypes.bool, // TODO ???
  showMobileTertiary: PropTypes.bool, // TODO ???
  navCollapsed: PropTypes.bool, // TODO does this need to be in context?
  secondaryCollapsed: PropTypes.bool, // TODO ???
  tertiaryCollapsed: PropTypes.bool, // TODO ???
  inMobileState: PropTypes.bool,
  onHover: PropTypes.func,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

VerticalNavigationItem.defaultProps = {
  title: '',
  trackActiveState: true, // TODO make this less dumb
  mobileItem: false,
  showMobileSecondary: false,
  showMobileTertiary: false,
  navCollapsed: false,
};

export default consumeAndProvideItemContext(VerticalNavigationItem);
