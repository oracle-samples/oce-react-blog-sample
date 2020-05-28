/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Component representing a single breadcrumb to be rendered in breadcrumbs.
 *
 * @param {object} linkParams contains the object to set for the "to" parameter
 *                            to the "Link" component when not empty, a "Link"
 *                            component is added arround the text,
 *                            when empty the text is rendered on its own
 *                            (i.e. no hyperlinking)
 * @param {string} text the text for the breadcrumb
 */
const Breadcrumb = (props) => {
  const { linkParams, text } = props;
  const includeLinkParams = Object.keys(linkParams).length > 0 && linkParams.constructor === Object;

  return (
    <li>
      {includeLinkParams
        ? <Link to={linkParams}>{text}</Link>
        : text}
    </li>
  );
};

/*
 * Define the type of data used in this component.
 */
Breadcrumb.propTypes = {
  linkParams: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  text: PropTypes.string.isRequired,
};

Breadcrumb.defaultProps = {
  linkParams: {},
};

export default Breadcrumb;
