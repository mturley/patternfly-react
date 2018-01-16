import VerticalNavigation from './VerticalNavigation';
import VerticalNavigationMasthead from './VerticalNavigationMasthead';
import VerticalNavigationItem from './VerticalNavigationItem';
import VerticalNavigationBrand from './VerticalNavigationBrand';
import VerticalNavigationCollapse from './VerticalNavigationCollapse';
import VerticalNavigationIconBar from './VerticalNavigationIconBar';

const Masthead = VerticalNavigationMasthead;
const Item = VerticalNavigationItem;
const Brand = VerticalNavigationBrand;
const Collapse = VerticalNavigationCollapse;
const IconBar = VerticalNavigationIconBar;
VerticalNavigation.Masthead = Masthead;
VerticalNavigation.Item = Item;
VerticalNavigation.Brand = Brand;
VerticalNavigation.Collapse = Collapse;
VerticalNavigation.IconBar = IconBar;

export {
  VerticalNavigation,
  VerticalNavigationMasthead,
  VerticalNavigationItem,
  VerticalNavigationBrand,
  VerticalNavigationCollapse,
  VerticalNavigationIconBar,
  Masthead,
  Item,
  Brand,
  Collapse,
  IconBar
};
