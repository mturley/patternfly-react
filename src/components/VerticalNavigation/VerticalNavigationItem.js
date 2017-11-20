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
  constructor() {
    super();
    this.state = {};
  }

  renderBadges(badges) {
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
      handlePrimaryHover,
      handleSecondaryHover,
      handleTertiaryHover,
      handlePrimaryBlur,
      handleSecondaryBlur,
      handleTertiaryBlur,
      handlePrimaryClick,
      handleSecondaryClick,
      handleTertiaryClick,
    } = this.props;

    const handleHover = {
      primary: this.handlePrimaryHover,
      secondary: this.handleSecondaryHover,
      tertiary: this.handleTertiaryHover,
    };

    const handleBlur = {
      primary: this.handlePrimaryBlur,
      secondary: this.handleSecondaryBlur,
      tertiary: this.handleTertiaryBlur,
    };

    const handleClick = {
      primary: this.handlePrimaryClick,
      secondary: this.handleSecondaryClick,
      tertiary: this.handleTertiaryClick,
    };

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
          handleHover[depth]('TODO args here');
        }}
        onMouseLeave={() => {
          handleBlur[depth]('TODO args here');
        }}
      >
        <a onClick={() => { handleClick[depth]('TODO args here') }}> {/* TODO handleClick takes all 3 items? figure that out... */}
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
            <div className="nav-pf-secondary-nav"> {/* TODO should this class sometimes say tertiary? */}
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

VerticalNavigationItem.propTypes = {
  title: PropTypes.string.isRequired,
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
  showMobileSecondary: PropTypes.bool,
  showMobileTertiary: PropTypes.bool,
  navCollapsed: PropTypes.bool,
  secondaryCollapsed: PropTypes.bool,
  tertiaryCollapsed: PropTypes.bool,
  handlePrimaryHover: PropTypes.func,
  handleSecondaryHover: PropTypes.func,
  handleTertiaryHover: PropTypes.func,
  handlePrimaryBlur: PropTypes.func,
  handleSecondaryBlur: PropTypes.func,
  handleTertiaryBlur: PropTypes.func,
  handlePrimaryClick: PropTypes.func,
  handleSecondaryClick: PropTypes.func,
  handleTertiaryClick: PropTypes.func,
  children: PropTypes.node,
};

VerticalNavigationItem.defaultProps = {
  trackActiveState: true,
  trackHoverState: true,
  mobileItem: false,
  showMobileSecondary: false,
  showMobileTertiary: false,
  navCollapsed: false,
  handlePrimaryHover: () => { },
  handleSecondaryHover: () => { },
  handleTertiaryHover: () => { },
  handlePrimaryBlur: () => { },
  handleSecondaryBlur: () => { },
  handleTertiaryBlur: () => { },
  handlePrimaryClick: () => { },
  handleSecondaryClick: () => { },
  handleTertiaryClick: () => { },
};
