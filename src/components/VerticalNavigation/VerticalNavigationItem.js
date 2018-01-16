import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ListGroup, ListGroupItem } from '../ListGroup';
import { OverlayTrigger } from '../OverlayTrigger';
import { Tooltip } from '../Tooltip';
import { bindMethods, controlled } from '../../common/helpers';
import {
  NavContextProvider,
  getNextDepth,
  deepestOf,
  getItemProps,
  itemObjectTypes,
  navContextTypes,
  consumeNavContext
} from './constants';

// TODO -- break down into a common Child component VerticalNavigationItemHelper which keeps state and methods and shared JSX
// TODO -- build shells around the Primary, Secondary, Tertiary

/**
 * VerticalNavigation.Item - a child element for the VerticalNavigation component
 */
class BaseVerticalNavigationItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverTimer: null,
      secondaryPinned: false,
      tertiaryPinned: false
    };
    bindMethods(this, [
      'navItem',
      'id',
      'idPath',
      'setActive',
      'getContextNavItems',
      'pinNav',
      'pinSecondaryNav',
      'pinTertiaryNav',
      'onItemHover',
      'onItemBlur',
      'onItemClick',
      'onMobileSelection'
    ]);
  }

  componentDidMount() {
    if (this.navItem().initialActive) {
      this.setActive();
    }
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
    const { setMobilePath } = this.props;
    const oldItem = this.navItem();
    const newItem = this.navItem(newProps);
    if (!oldItem.active && newItem.active) {
      // If the active prop is being added, make sure the activePath is in sync.
      if (newProps.activePath !== this.idPath()) this.setActive(true); // TODO do we need this for mobilePath too?
    }
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
      setMobilePath(null);
    }
  }

  navItem(oldProps, ignorePath) {
    const props = oldProps || this.props;
    // Properties of the item object take priority over individual item props
    const item = { ...getItemProps(props), ...props.item };
    return {
      ...item,
      // Automatically set the active and selectedOnMobile properties based on current path...
      // ...But don't call idPath() (and therefore id()) when we're calling navItem() inside id().
      active:
        item.active ||
        (ignorePath
          ? null
          : props.activePath && props.activePath.startsWith(this.idPath())),
      selectedOnMobile:
        item.selectedOnMobile ||
        (ignorePath
          ? null
          : props.mobilePath && props.mobilePath.startsWith(this.idPath()))
    };
  }

  id() {
    const { id, title } = this.navItem(null, true); // Need to ignorePath here so we don't get an infinite call stack...
    return id || title || this.props.index;
  }

  idPath() {
    return `${this.props.idPath}${this.id()}/`;
  }

  setActive() {
    this.props.setActivePath(this.idPath());
  }

  getContextNavItems() {
    // We have primary, secondary, and tertiary items as props if they are part of the parent context,
    // but we also want to include the current item when calling handlers.
    const { depth, primaryItem, secondaryItem, tertiaryItem } = this.props;
    const navItem = this.navItem();
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
      setMobilePath,
      forceHideSecondaryMenu,
      setActivePath,
      idPath
    } = this.props;
    const pinned = this.state[stateKey];
    if (isMobile) {
      // On mobile, the pin buttons act as back buttons instead.
      if (depth === 'primary') {
        // Going back to primary nav clears all selection.
        clearMobileSelection();
      } else if (depth === 'secondary') {
        // Going back to secondary nav de-selects this item and re-selects the parent.
        setMobilePath(idPath); // idPath prop, which is parent's path, not this.idPath().
      }
    } else {
      this.setState({ [stateKey]: !pinned });
      setActivePath(!pinned ? this.idPath() : null);
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
    const { isMobile, updateNavOnItemClick, onClick } = this.props;
    updateNavOnItemClick(primary, secondary, tertiary); // Clears all mobile selections
    if (isMobile) {
      this.onMobileSelection(primary, secondary, tertiary); // Applies new mobile selection here
    }
    this.setActive();
    onClick && onClick(primary, secondary, tertiary);
    // TODO other item-level nav props? href? route?
  }

  onMobileSelection(primary, secondary, tertiary) {
    const { setMobilePath, updateNavOnMobileSelection } = this.props;
    setMobilePath(this.idPath());
    updateNavOnMobileSelection(primary, secondary, tertiary);
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

  render() {
    const {
      pinnableMenus,
      hiddenIcons,
      navCollapsed,
      isMobile,
      selectedMobileDepth,
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
    const navItem = this.navItem();
    const {
      active,
      selectedOnMobile,
      title,
      iconStyleClass,
      badges,
      subItems
    } = navItem;

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
              <NavContextProvider
                {...this.props}
                idPath={this.idPath()}
                item={navItem}
              >
                <ListGroup componentClass="ul">{childItemComponents}</ListGroup>
              </NavContextProvider>
            </div>
          )}
      </ListGroupItem>
    );
  }
}

const controlledStateTypes = {
  hovering: PropTypes.bool
};

BaseVerticalNavigationItem.propTypes = {
  ...controlledStateTypes,
  ...itemObjectTypes, // Each of the item object's properties can alternatively be passed directly as a prop.
  ...navContextTypes,
  item: PropTypes.shape(itemObjectTypes),
  isMobile: PropTypes.bool,
  selectedMobileDepth: PropTypes.oneOf([null, 'primary', 'secondary']),
  onHover: PropTypes.func,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.node,
  setControlledState: PropTypes.func
};

const defaultControlledState = {
  hovering: null
};

BaseVerticalNavigationItem.defaultProps = {
  title: '',
  selectedMobileDepth: null
};

const VerticalNavigationItem = controlled(
  controlledStateTypes,
  defaultControlledState
)(consumeNavContext(BaseVerticalNavigationItem));

VerticalNavigationItem.displayName = 'VerticalNavigationItem';

export default VerticalNavigationItem;
