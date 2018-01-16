import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { defaultTemplate } from '../../../storybook/decorators/storyTemplates';

import { VerticalNavigation, Masthead, Item, Brand, IconBar } from './index';

import { mockNavItems } from './__mocks__/mockNavItems';

// TODO -- add more stories
// TODO -- add richer descriptions of props for storybook

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
  'Flat (Inline JSX)',
  `VerticalNavigation usage example with items passed as children, but with only titles.`,
  () => {
    return (
      // This container div prevents position: fixed elements from being aligned incorrectly in storybook.
      // See https://stackoverflow.com/a/38796408
      <div style={{ transform: 'translateZ(0)', height: '100vh' }}>
        <div className="layout-pf layout-pf-fixed faux-layout">
          <VerticalNavigation>
            <Masthead title="Patternfly React" />
            <Item title="Item 1" />
            <Item title="Item 2" initialActive>
              <Item title="Item 2-A" />
              <Item title="Item 2-B" />
              <Item title="Item 2-C" />
            </Item>
            <Item title="Item 3">
              <Item title="Item 3-A" />
              <Item title="Item 3-B">
                <Item title="Item 3-B-i" />
                <Item title="Item 3-B-ii" />
                <Item title="Item 3-B-iii" />
              </Item>
              <Item title="Item 3-C" />
            </Item>
          </VerticalNavigation>
        </div>
        {mockBodyContainer}
      </div>
    );
  }
);

// TODO story 'Flat (Items Array)'
// TODO story 'Nested (Inline JSX)'

stories.addWithInfo(
  'Nested (Items Array)',
  `VerticalNavigation usage example with items passed as objects, driven by a mock file.`,
  () => {
    return (
      // This container div prevents position: fixed elements from being aligned incorrectly in storybook.
      // See https://stackoverflow.com/a/38796408
      <div style={{ transform: 'translateZ(0)', height: '100vh' }}>
        <div className="layout-pf layout-pf-fixed faux-layout">
          <VerticalNavigation items={mockNavItems}>
            <Masthead title="Patternfly React" />
          </VerticalNavigation>
          {mockBodyContainer}
        </div>
      </div>
    );
  }
);

stories.addWithInfo(
  'With Custom Masthead',
  `VerticalNavigation usage example with a customized masthead.`,
  () => {
    return (
      // This container div prevents position: fixed elements from being aligned incorrectly in storybook.
      // See https://stackoverflow.com/a/38796408
      <div style={{ transform: 'translateZ(0)', height: '100vh' }}>
        <div className="layout-pf layout-pf-fixed faux-layout">
          <VerticalNavigation items={mockNavItems}>
            <Masthead>
              <Brand img="/img/brand-alt.svg" /> // TODO make this better
              <IconBar />
            </Masthead>
          </VerticalNavigation>
          {mockBodyContainer}
        </div>
      </div>
    );
  }
);

// TODO add a story with a mock store to keep track of active state.  (auto track active in uncontrolled mode???)

// TODO add more stories! with and without custom masthead (how to handle default?) and others
