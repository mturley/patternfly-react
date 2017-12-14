import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ListGroup, ListGroupItem } from '../ListGroup';
import OverlayTrigger from '../OverlayTrigger';
import Tooltip from '../Tooltip';
import VerticalNavigation from './VerticalNavigation';

/**
 * VerticalNavigationItem - a child element for the VerticalNavigation component
 */
export default class VerticalNavigationItem extends React.Component {
  static itemPropTypes = {
    title: PropTypes.string,
    trackActiveState: PropTypes.bool,
    trackHoverState: PropTypes.bool,
    mobileItem: PropTypes.bool,
    iconStyleClass: PropTypes.string,
    badges: PropTypes.shape({
      badgeClass: PropTypes.string,
      tooltip: PropTypes.string,
      count: PropTypes.number,
      iconStyleClass: PropTypes.string,
    }),
    children: PropTypes.array,
  };

  constructor() {
    super();
    this.state = {};
    this.onItemEvent = this.onItemEvent.bind(this);
    this.onItemHover = this.onItemHover.bind(this);
    this.onItemBlur = this.onItemBlur.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
  }

  onItemEvent(callback) {
    const { primaryItem, secondaryItem, tertiaryItem } = this.context;
    callback(primaryItem, secondaryItem, tertiaryItem);
  }

  onItemHover() {
    // TODO allow handleItemHover props etc at the item level???
    onItemEvent(this.context.onItemHover);
  }

  onItemBlur() {
    onItemEvent(this.context.onItemBlur);
  }

  onItemClick() {
    onItemEvent(this.context.onItemClick);
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
    const { item, ...otherProps } = this.props;
    if (item) {
      return <VerticalNavigationItem {...otherProps} {...item} />; // The item object is just a container for a bunch of props. // TODO yeah idk about this
    }

    const {
      children,
      trackActiveState,
      trackHoverState,
      mobileItem,
      iconStyleClass,
      title,
      badges,
      showMobileSecondary,
      showMobileTertiary,
      navCollapsed,
      primaryItem,
      secondaryItem,
      tertiaryItem,
      inMobileState,
    } = this.props;

    const { onItemHover, onItemBlur, onItemClick } = this.context;

    // TODO maybe don't pass in all three handlers at the top, instead pass them below? would that still be DRY?

    // Assume that if someone nests deeper than tertiary, it's just another tertiary-styled item.
    const depth = this.props.depth || 'primary';
    const nextDepth = VerticalNavigation.getNextDepth(depth);

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
        onMouseEnter={() => {
          onItemHover(primaryItem, secondaryItem, tertiaryItem);
        }}
        onMouseLeave={() => {
          onItemBlur(primaryItem, secondaryItem, tertiaryItem);
        }}
      >
        <a
          onClick={() => {
            onItemClick(primaryItem, secondaryItem, tertiaryItem);
          }}
        >
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
          children.length > 0 && (
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
              <ListGroup componentClass="ul">
                {VerticalNavigation.renderChildren(this.props)}
              </ListGroup>
            </div>
          )}
      </ListGroupItem>
    );
  }
}

VerticalNavigationItem.contextTypes = {
  primaryItem: PropTypes.shape(VerticalNavigationItem.itemPropTypes),
  secondaryItem: PropTypes.shape(VerticalNavigationItem.itemPropTypes),
  tertiaryItem: PropTypes.shape(VerticalNavigationItem.itemPropTypes),
  onItemHover: PropTypes.func,
  onItemBlur: PropTypes.func,
  onItemClick: PropTypes.func,
};

VerticalNavigationItem.propTypes = {
  item: PropTypes.shape(VerticalNavigationItem.itemPropTypes),
  ...itemShape, // Each of the item object's properties can alternatively be passed directly as a prop. FIXME ehhhh really?
  showMobileSecondary: PropTypes.bool,
  showMobileTertiary: PropTypes.bool,
  navCollapsed: PropTypes.bool,
  secondaryCollapsed: PropTypes.bool,
  tertiaryCollapsed: PropTypes.bool,
  primaryItem: PropTypes.shape(VerticalNavigationItem.itemPropTypes),
  secondaryItem: PropTypes.shape(VerticalNavigationItem.itemPropTypes),
  tertiaryItem: PropTypes.shape(VerticalNavigationItem.itemPropTypes),
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
