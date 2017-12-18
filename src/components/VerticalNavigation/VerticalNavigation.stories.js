import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { defaultTemplate } from '../../../storybook/decorators/storyTemplates';

import { VerticalNavigation } from '../../index';
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
        <VerticalNavigation.Item title="Item 1" />
        <VerticalNavigation.Item title="Item 2">
          <VerticalNavigation.Item title="Item 2-A" />
          <VerticalNavigation.Item title="Item 2-B" />
          <VerticalNavigation.Item title="Item 2-C" />
        </VerticalNavigation.Item>
        <VerticalNavigation.Item title="Item 3">
          <VerticalNavigation.Item title="Item 3-A" />
          <VerticalNavigation.Item title="Item 3-B">
            <VerticalNavigation.Item title="Item 3-B-i" />
            <VerticalNavigation.Item title="Item 3-B-ii" />
            <VerticalNavigation.Item title="Item 3-B-iii" />
          </VerticalNavigation.Item>
          <VerticalNavigation.Item title="Item 3-C" />
        </VerticalNavigation.Item>
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
