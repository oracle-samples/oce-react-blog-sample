/* eslint-disable no-undef */
import React from 'react';
import { waitForElement, render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ArticlesListContainer from './ArticlesListContainer';

import MockServices from '../../test/MockServices';

/** **********************************************************
 * Perform validation of the ArticlesListContainer component
 *
 * Data is provided from mocked calls to the service wrapper
 * API
 */
describe('Validation of the ArticlesListContainer component', () => {
  beforeEach(() => {
    // Use the predefined mock responses for all service wrapper methods
    MockServices.overrideServiceWrapper();
  });

  afterEach(() => {
    // Reset the mock resonses so as not to interfere with other tests
    MockServices.resetServiceWrapper();
  });

  /** ****************************************
   * Perform snapshot test
   ***************************************** */
  test('Render the articles list for a specific container', async () => {
    /** *************
     * Arrange
     ************** */
    expect.assertions(1);

    /** *************
     * Act
     ************** */
    const { container, getByTestId } = render(
      <Router path="/">
        <ArticlesListContainer
          topicId="CORE3E84C4A3FC084704B0EDE88515BB4506"
          topicName="How%20To"
        />
      </Router>,
    );

    /** *************
     * Assert
     ************** */
    await waitForElement(() => getByTestId('ArticlesList'));

    expect(container).toMatchSnapshot();
  });
});
