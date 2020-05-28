/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * React component for rendering the header of the home page
 *
 * @param {string} companyTitle The company's title
 * @param {string} companyThumbnailUrl The URL of the company's icon
 * @param {string} aboutUrl The URL for the About link
 * @param {string} contactUrl The URL for the Contact Us link
 */
const Header = (props) => {
  const {
    companyTitle, companyThumbnailUrl, aboutUrl, contactUrl,
  } = props;

  return (
    <div className="logo" data-testid="Header">
      <img id="company-thumbnail" src={companyThumbnailUrl} alt="Company icon" />
      <h1 id="company-title">{companyTitle}</h1>
      <ul>
        <li><a id="about" href={aboutUrl}>About Us</a></li>
        <li><a id="contact" href={contactUrl}>Contact Us</a></li>
      </ul>
    </div>
  );
};

/*
 * Define the type of data used in this component.
 */
Header.propTypes = {
  companyTitle: PropTypes.string.isRequired,
  companyThumbnailUrl: PropTypes.string.isRequired,
  aboutUrl: PropTypes.string.isRequired,
  contactUrl: PropTypes.string.isRequired,
};

export default Header;
