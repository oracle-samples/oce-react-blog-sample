/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import PropTypes from 'prop-types';

import ArticleListItemContainer from './ArticleListItemContainer';
import Breadcrumbs from './Breadcrumbs';

/**
 * Component representing a list of Articles with a breadcrumb bar
 * at the top.
 *
 * Note: This is called from "ArticlesListContainer" which gets the data
 * to display in this component, this design is to keep the model and view separate.
 *
 * @param {array} articles the list of articles to render in this component
 * @param {string} topicId the ID of the topic
 * @param {string} topicName the name of the topic, used when rendering breadcrumbs
 */
const ArticlesList = (props) => {
  const { articles, topicId, topicName } = props;

  // Breadcrumbs :  Topics > topicName (read only)
  // - "Home" url =  "/"
  const breadcrumbsData = [
    {
      linkParams: { pathname: '/' },
      text: 'Home',
    },
    {
      linkParams: {},
      text: topicName,
    },
  ];

  return (
    <div data-testid="ArticlesList">
      <Breadcrumbs breadcrumbsData={breadcrumbsData} />

      <div id="articles">
        {articles.map(
          (article) => (
            <ArticleListItemContainer
              key={article.id}
              article={article}
              topicId={topicId}
              topicName={topicName}
            />
          ),
        )}
      </div>
    </div>
  );
};

/*
 * Define the type of data used in this component.
 */
ArticlesList.propTypes = {
  topicId: PropTypes.string.isRequired,
  topicName: PropTypes.string.isRequired,
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }.propTypes),
  ).isRequired,
};

export default ArticlesList;
