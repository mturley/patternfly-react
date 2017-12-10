import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { defaultTemplate } from '../../../storybook/decorators/storyTemplates';

import { VerticalNavigation, VerticalNavigationItem } from '../../index';
import { mockNavItems } from './__mocks__/mockNavItems';

const stories = storiesOf('VerticalNavigation', module);
stories.addDecorator(withKnobs);
stories.addDecorator(
  defaultTemplate({
    title: 'VerticalNavigation',
    documentationLink:
      'http://www.patternfly.org/pattern-library/navigation/vertical-navigation/',
  }),
);

stories.addWithInfo(
  'Vertical Navigation driven by JSX children',
  `VerticalNavigation usage example with items passed as children, but with only titles.`,
  () => {
    return (
      <VerticalNavigation secondaryCollapsed={false} tertiaryCollapsed>
        <VerticalNavigationItem title="Item 1" />
        <VerticalNavigationItem title="Item 2">
          <VerticalNavigationItem title="Item 2-A" />
          <VerticalNavigationItem title="Item 2-B" />
          <VerticalNavigationItem title="Item 2-C" />
        </VerticalNavigationItem>
        <VerticalNavigationItem title="Item 3">
          <VerticalNavigationItem title="Item 3-A" />
          <VerticalNavigationItem title="Item 3-B">
            <VerticalNavigationItem title="Item 3-B-i" />
            <VerticalNavigationItem title="Item 3-B-ii" />
            <VerticalNavigationItem title="Item 3-B-iii" />
          </VerticalNavigationItem>
          <VerticalNavigationItem title="Item 3-C" />
        </VerticalNavigationItem>
      </VerticalNavigation>
    );
  },
);

stories.addWithInfo(
  'Vertical Navigation driven by an objects in a prop',
  `VerticalNavigation usage example with items passed as objects, driven by a mock file.`,
  () => {
    return <VerticalNavigation items={mockNavItems} />;
  },
);

// TODO add more stories!
