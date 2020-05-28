/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Component representing a Topic displayed in the list of topics.
 *
 * Note: This is called from "TopicListItemContainer" which gets the data
 * to display in this component, this design is to keep the model and view separate.
 *
 * @param {string} name The topic's name
 * @param {string} imageUrl The URL of the topics thumbnail image
 * @param {string} description The topic's description
 * @param {string} topicId The ID of the Topic, used to render links to child views
 */
const TopicListItem = (props) => {
  const {
    title, imageUrl, description, topicId,
  } = props;

  // whole view is wrapped in a "Link" component with the URL of the format
  //   /articles/topicId?topicName=name
  // "index.js" will route a URL of this format to "ArticlesListContainer"
  // Note the textDecoration style added to the Link component, this is to ensure
  // any text in elements inside this Link component are not rendered with an
  // underline like standard <a> links are rendered (Link gets decompiled down
  // to <a> elements.)
  return (
    <Link to={{ pathname: `/articles/${topicId}`, search: `?topicName=${title}` }} style={{ textDecoration: 'none' }}>
      <div className="topic">
        <div className="button-wrapper">
          <div className="button">{title}</div>
        </div>

        <img src={imageUrl} alt="Topic Thumbnail" />

        <div className="desc-wrapper">
          <div className="description">{description}</div>
        </div>
      </div>
    </Link>
  );
};

/*
 * Define the type of data used in this component.
 */
TopicListItem.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  topicId: PropTypes.string.isRequired,
};

export default TopicListItem;
