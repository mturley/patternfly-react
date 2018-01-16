import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { defaultTemplate } from '../../../storybook/decorators/storyTemplates';

import { VerticalNavigation, Masthead, Brand, IconBar } from './index';

import { mockNavItems } from './__mocks__/mockNavItems';
import { mockIconBarChildren } from './__mocks__/mockIconBarChildren';

import pfLogo from '../../../storybook/img/logo-alt.svg';
import pfBrand from '../../../storybook/img/brand-alt.svg';

// TODO -- add more stories
// TODO -- add richer descriptions of props for storybook

// Vertical Nav CSS uses position: fixed, but storybook doesn't render components at the top of the page body.
// We need this little bit of magic to force position: fixed children to render relative to the storybook body.
// translateZ trick found at https://stackoverflow.com/a/38796408.
const MockPositionFixed = props => (
  <div style={{ transform: 'translateZ(0)', height: '100vh' }}>
    {props.children}
  </div>
);
MockPositionFixed.propTypes = { children: PropTypes.node };

const mockBodyContainer = (
  <div className="container-fluid container-cards-pf container-pf-nav-pf-vertical nav-pf-persistent-secondary">
    <div>
      <h1>Body Content Here!</h1>
    </div>
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
      <MockPositionFixed>
        <div className="layout-pf layout-pf-fixed faux-layout">
          <VerticalNavigation>
            <VerticalNavigation.Masthead title="Patternfly React" />
            <VerticalNavigation.Item title="Item 1" />
            <VerticalNavigation.Item title="Item 2" initialActive>
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
      </MockPositionFixed>
    );
  }
);

/*
stories.addWithInfo(
  'Flat (Items Array)',
  'VerticalNavigation usage example with items passed as objects inline.',
  () => {
    return <div />; // TODO
  }
);

stories.addWithInfo(
  'Nested (Inline JSX)',
  'VerticalNavigation usage example with items passed as children, three levels deep.',
  () => {
    return <div />; // TODO
  }
);
*/

stories.addWithInfo(
  'Nested (Items Array)',
  `VerticalNavigation usage example with items passed as objects, driven by a mock file.`,
  () => {
    return (
      <MockPositionFixed>
        <div className="layout-pf layout-pf-fixed faux-layout">
          <VerticalNavigation items={mockNavItems}>
            <Masthead title="Patternfly React" />
          </VerticalNavigation>
          {mockBodyContainer}
        </div>
      </MockPositionFixed>
    );
  }
);

stories.addWithInfo(
  'With Custom Masthead',
  `VerticalNavigation usage example with a customized masthead.`,
  () => {
    return (
      <MockPositionFixed>
        <div className="layout-pf layout-pf-fixed faux-layout">
          <VerticalNavigation items={mockNavItems}>
            <Masthead>
              <Brand iconImg={pfLogo} titleImg={pfBrand} />
              <IconBar>{mockIconBarChildren}</IconBar>
            </Masthead>
          </VerticalNavigation>
          {mockBodyContainer}
        </div>
      </MockPositionFixed>
    );
  }
);

// TODO add a story with a mock store to keep track of active state.  (auto track active in uncontrolled mode???)

// TODO add more stories! with and without custom masthead (how to handle default?) and others
