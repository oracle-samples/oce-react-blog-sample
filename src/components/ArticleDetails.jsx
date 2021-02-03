/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import filterXSS from 'xss';
import React from 'react';
import PropTypes from 'prop-types';
import dateToMDY from '../scripts/utils';
import Breadcrumbs from './Breadcrumbs';

/**
 * Component representing Article details.
 *
 * Note: This is called from "ArticleDetailsContainer" which gets the data
 * to display in this component, this design is to keep the model and view separate.
 *
 * @param {object} article The Article to display
 * @param {string} authorAvatarUrl The URL for the Authors avatar image
 * @param {string} articleImageUrl The URL for the article image
 * @param {string} topicId The id of the topic, used when rendering breadcrumbs
 * @param {string} topicName The topic name, used when rendering breadcrumbs
 */
const ArticleDetails = (props) => {
  // get values passed into this component
  const {
    article, authorAvatarUrl, articleImageUrl, topicId, topicName,
  } = props;

  const formattedDate = `Posted on ${dateToMDY(article.fields.published_date.value)}`;
  const options = {
    stripIgnoreTag: true, // filter out all HTML not in the whitelist
    stripIgnoreTagBody: ['script'], // the script tag is a special case, we need
    // to filter out its content
  };
  const cleancontent = filterXSS(article.fields.article_content, options);
  // Breadcrumbs :  Home > topicName > articleName (read only)
  // - "Home" url      =  "/"
  // - "topicName" url =  "/articles/topicId?topicName=name"
  const breadcrumbsData = [
    {
      linkParams: { pathname: '/' },
      text: 'Home',
    },
    {
      linkParams: { pathname: `/articles/${topicId}`, search: `?topicName=${topicName}` },
      text: topicName,
    },
    {
      linkParams: {},
      text: article.name,
    },
  ];

  return (
    <div>
      <Breadcrumbs breadcrumbsData={breadcrumbsData} />

      <div id="article">
        <div className="author">
          {/* Avatar */}
          <img src={authorAvatarUrl} alt="Author Avatar" />

          {/*  Author Name / Date */}
          <div className="name_date">
            <h4 className="title">{article.fields.author.name}</h4>
            <div className="date">
              {formattedDate}
              {' '}
            </div>
          </div>
        </div>

        {/* Article Image and caption */}
        <figure>
          <img src={articleImageUrl} alt="Article" />
          <figcaption>{article.fields.image_caption}</figcaption>
        </figure>

        {/* Article Content */}
        <div className="content">
          { article.fields.article_content.indexOf('</') !== -1
            ? (
              // eslint-disable-next-line react/no-danger
              <div dangerouslySetInnerHTML={{ __html: cleancontent }} />
            )
            : cleancontent}
        </div>
      </div>
    </div>
  );
};

/*
 * Define the type of data used in this component.
 */
ArticleDetails.propTypes = {
  topicId: PropTypes.string.isRequired,
  topicName: PropTypes.string.isRequired,
  authorAvatarUrl: PropTypes.string,
  articleImageUrl: PropTypes.string.isRequired,
  article: PropTypes.shape({
    name: PropTypes.string.isRequired,
    fields: PropTypes.shape({
      image_caption: PropTypes.string.isRequired,
      article_content: PropTypes.string.isRequired,
      published_date: PropTypes.shape({
        value: PropTypes.string.isRequired,
      }),
      author: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};

ArticleDetails.defaultProps = {
  authorAvatarUrl: '',
};

export default ArticleDetails;
