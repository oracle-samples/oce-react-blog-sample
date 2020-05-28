/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import PropTypes from 'prop-types';

import BreadCrumb from './Breadcrumb';

/**
 * Component representing a set of breadcrumbs.
 *
 * @param {array} breadcrumbsData the list of objects for each breadcrumb
 */
const Breadcrumbs = (props) => {
  const { breadcrumbsData } = props;

  return (
    <div id="breadcrumb">
      <ul>
        {breadcrumbsData.map(
          (breadcrumbData) => (
            <BreadCrumb
              key={breadcrumbData.text}
              linkParams={breadcrumbData.linkParams}
              text={breadcrumbData.text}
            />
          ),
        )}
      </ul>
    </div>
  );
};

/*
 * Define the type of data used in this component.
 */
Breadcrumbs.propTypes = {
  breadcrumbsData: PropTypes.arrayOf(
    PropTypes.shape({ BreadCrumb }.propTypes),
  ).isRequired,
};

export default Breadcrumbs;
