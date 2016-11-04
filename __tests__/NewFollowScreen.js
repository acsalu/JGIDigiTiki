import 'react-native';
import React from 'react';
import NewFollowScreen from '../components/NewFollowScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
      <NewFollowScreen />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});