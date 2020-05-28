/* eslint-disable no-undef */
import React from 'react';
import { waitForElement, render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import TopicsListContainer from './TopicsListContainer';
import MockServices from '../../test/MockServices';

/** *****************************************************
 * Validate that the TopicsListContainer component renders correctly
 * using snapshot testing.
 *
 * Data is provided through mocked calls to the
 * service wrapper methods
 */
describe('Snaphot testing the TopicsListContainer component', () => {
  beforeEach(() => {
    // Use the predefined mock responses for all service wrapper methods
    MockServices.overrideServiceWrapper();
  });

  afterEach(() => {
    // Reset the mock resonses so as not to interfere with other tests
    MockServices.resetServiceWrapper();
  });

  /** ***************************
   * Render the component and compare it with the snapshot
   * stored in /src/components/__snapshots__
   */
  test('Render TopicsListContainer component using static data', async () => {
    /** *************
     * Arrange
     ************** */
    expect.assertions(1);

    /** *************
     * Act
     ************** */
    const { container, getByTestId } = render(
      <Router path="/">
        <TopicsListContainer />
      </Router>,
    );

    /** *************
     * Assert
     ************** */
    await waitForElement(() => getByTestId('TopicsListContainer'));

    expect(container).toMatchSnapshot();
  });
});
