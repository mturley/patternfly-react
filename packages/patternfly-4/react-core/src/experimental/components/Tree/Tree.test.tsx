import * as React from 'react';
import { shallow } from 'enzyme';
import { Tree } from './Tree';

// TODO add tests here

test.skip('simple spinner', () => {
  const view = shallow(<Tree />);
  expect(view).toMatchSnapshot();
});