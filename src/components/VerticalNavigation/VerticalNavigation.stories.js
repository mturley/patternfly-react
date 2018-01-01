import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { defaultTemplate } from '../../../storybook/decorators/storyTemplates';

import { VerticalNavigation } from '../../index';

import { mockNavItems } from './__mocks__/mockNavItems';

const mockBodyContainer = (
  <div className="container-fluid container-cards-pf container-pf-nav-pf-vertical nav-pf-persistent-secondary">
    <h1>Body Content Here!</h1>
  </div>
);

const stories = storiesOf('VerticalNavigation', module);
stories.addDecorator(withKnobs);
stories.addDecorator(
  defaultTemplate({
    title: 'VerticalNavigation',
    documentationLink:
      'http://www.patternfly.org/pattern-library/navigation/vertical-navigation/'
  })
);

stories.addWithInfo(
  'Vertical Navigation driven by JSX children',
  `VerticalNavigation usage example with items passed as children, but with only titles.`,
  () => {
    return (
      // This container div prevents position: fixed elements from being aligned incorrectly in storybook.
      // See https://stackoverflow.com/a/38796408
      <div style={{ transform: 'translateZ(0)', height: '100vh' }}>
        <div className="layout-pf layout-pf-fixed faux-layout">
          <VerticalNavigation>
            <VerticalNavigation.MastHead title="Patternfly React" />
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
        </div>
        {mockBodyContainer}
      </div>
    );
  }
);

stories.addWithInfo(
  'Vertical Navigation driven by an objects in a prop',
  `VerticalNavigation usage example with items passed as objects, driven by a mock file.`,
  () => {
    console.log('ITEMS:', mockNavItems);
    return (
      // This container div prevents position: fixed elements from being aligned incorrectly in storybook.
      // See https://stackoverflow.com/a/38796408
      <div style={{ transform: 'translateZ(0)', height: '100vh' }}>
        <div className="layout-pf layout-pf-fixed faux-layout">
          <VerticalNavigation items={mockNavItems}>
            <VerticalNavigation.MastHead title="Patternfly React" />
          </VerticalNavigation>
          {mockBodyContainer}
        </div>
      </div>
    );
  }
);

// TODO add more stories! with and without custom masthead (how to handle default?) and others
