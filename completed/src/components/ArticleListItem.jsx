/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import dateToMDY from '../scripts/utils';

/**
 * Component representing an Article List Item displayed in the list of articles.
 *
 * Note: This is called from "ArticleListItemContainer" which gets the data
 * to display in this component, this design is to keep the model and view separate.
 *
 * @param {string} topicId The Topic to which the Article belongs, used when creating
 *                         the link to the article details
 * @param {string} topicName The Topic name, used to render breadcrumbs
 * @param {object} article The Article to display
 * @param {string} articleUrl The URL for the article's thumnail
 */
const ArticleListItem = (props) => {
  const {
    topicId, topicName, article, articleUrl,
  } = props;

  const formattedDate = `Posted on ${dateToMDY(article.fields.published_date.value)}`;

  // whole view is wrapped in a "Link" component with the URL of the format
  //   /articles/articleId?topicName=name&topicId=id
  // "index.js" will route a URL of this format to "ArticleDetailsContainer"
  return (
    <Link
      to={{
        pathname: `/article/${article.id}`,
        search: `?topicName=${topicName}&topicId=${topicId}`,
      }}
      style={{ textDecoration: 'none' }}
    >
      <div className="article">

        <div className="title-date">
          <h4 className="title">{article.name}</h4>
          <div className="date">{formattedDate}</div>
        </div>

        <img src={articleUrl} alt="Article thumbnail" />

        <div className="description">
          {article.description}
        </div>
      </div>
    </Link>
  );
};

/*
 * Define the type of data used in this component.
 */
ArticleListItem.propTypes = {
  topicId: PropTypes.string.isRequired,
  topicName: PropTypes.string.isRequired,
  articleUrl: PropTypes.string.isRequired,
  article: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    fields: PropTypes.shape({
      published_date: PropTypes.shape({
        value: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};

export default ArticleListItem;
