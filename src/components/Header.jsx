/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * React component for rendering the header of the home page
 *
 * @param {string} companyTitle The company's title
 * @param {string} companyThumbnailRenditionUrls The URL of the company's icon
 * @param {string} aboutUrl The URL for the About link
 * @param {string} contactUrl The URL for the Contact Us link
 */
const Header = (props) => {
  const {
    companyTitle, companyThumbnailRenditionUrls, aboutUrl, contactUrl,
  } = props;

  return (
    <div className="logo" data-testid="Header">
      {companyThumbnailRenditionUrls && (
        <picture id="company-thumbnail">
          <source
            type="image/webp"
            srcSet={companyThumbnailRenditionUrls.srcset}
            sizes="(max-width: 480px) 60vw, 25vw"
          />
          <img src={companyThumbnailRenditionUrls.native} alt="Company icon" width="{companyThumbnailRenditionUrls.width*.85}" height="{companyThumbnailRenditionUrls.height*.85}" />
        </picture>
      )}
      <h1 id="company-title">{companyTitle}</h1>
      <ul>
        <li><a id="about" href={aboutUrl}>About Us</a></li>
        <li><a id="contact" href={contactUrl}>Contact Us</a></li>
      </ul>
    </div>
  );
};

export default Header;

/*
 * Define the type of data used in this component.
 */
Header.propTypes = {
  companyTitle: PropTypes.string.isRequired,
  companyThumbnailRenditionUrls: PropTypes.shape().isRequired,
  aboutUrl: PropTypes.string.isRequired,
  contactUrl: PropTypes.string.isRequired,
};
