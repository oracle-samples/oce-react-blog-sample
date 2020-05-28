/* eslint-disable no-undef */
import React from 'react';

import { waitForElement, render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';

/** *******************************************************
 * These tests illustrate two different techniques to
 * validate the Header component
 */
describe('Test the rendering of the Header component', () => {
  /** *********************************************
   * Manually validate each element of the DOM
   ********************************************** */
  test('Example Validation of header DOM elements', async () => {
    /** *************
     * Act
     ************** */
    const {
      getByTestId,
      getByText,
      getByAltText,
    } = render(
      <Router path="/">
        <Header
          companyTitle="My Company"
          companyThumbnailUrl="http://www.somewhere.com/image.png"
          aboutUrl="http://www.somewhere.com/about"
          contactUrl="http://www.somewhere.com/contact"
        />
      </Router>,
    );


    /** *************
     * Assert
     ************** */
    await waitForElement(() => getByTestId('Header'));

    expect(getByText('My Company')).toBeTruthy();

    const img = getByAltText('Company icon');
    expect(img.src).toBe('http://www.somewhere.com/image.png');

    const about = getByText('About Us');
    expect(about).toBeTruthy();
    expect(about.href).toBe('http://www.somewhere.com/about');

    const contact = getByText('Contact Us');
    expect(contact).toBeTruthy();
    expect(contact.href).toBe('http://www.somewhere.com/contact');
  });

  /** *********************************************
   * Snapshot testing of the Header component
   ********************************************** */
  test('Validate Header snapshot', async () => {
  /** *************
   * Act
   ************** */
    const {
      container,
      getByTestId,
    } = render(
      <Router path="/">
        <Header
          companyTitle="My Company"
          companyThumbnailUrl="http://www.somewhere.com/image.png"
          aboutUrl="http://www.somewhere.com/about"
          contactUrl="http://www.somewhere.com/contact"
        />
      </Router>,
    );

    /** *************
     * Assert
     ************** */
    await waitForElement(() => getByTestId('Header'));
    expect(container).toMatchSnapshot();
  });
});
