/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import PropTypes from 'prop-types';

import getDeliveryClient from '../scripts/server-config-utils';
import { fetchArticle, getRenditionURL, getMediumRenditionURL } from '../scripts/services';

import ArticleDetails from './ArticleDetails';

/**
 * Component responsible for getting the details of an Article.
 *
 * Note: This actual data is rendered in the "ArticleDetails",
 * this design is to keep the model and view separate.
 *
 * This is called from "index.js" in the Router section when a user has clicked
 * on a link defined in "ArticleListItem".
 *
 * @param {string} articleId The ID of the Article, used to get article information from the server
 * @param {string} topicName The name of the topic, used when rendering breadcrumbs
 * @param {string} topicId The if of the topic, used when rendering breadcrumbs
 */
export default class ArticleDetailsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = {
      loading: true,
      error: false,
      article: {},
    };
  }

  componentDidMount() {
    this.mounted = true;

    // set the browser tab title
    document.title = 'Article';

    // get the client to connect to CEC
    const deliveryClient = getDeliveryClient();

    // get values passed into this component
    const { articleId } = this.props;

    // Get the article details
    fetchArticle(deliveryClient, articleId)
      .then((article) => {
        if (this.mounted) {
          this.setState({ article });
        }

        // get the article image URL
        getRenditionURL(deliveryClient, article.fields.image.id)
          .then((renditionUrl) => {
            if (this.mounted) {
              this.setState({ articleImageUrl: renditionUrl });
            }

            // Get the author's avatar image
            getMediumRenditionURL(deliveryClient, article.fields.author.fields.avatar.id)
              .then((thumbnailUrl) => {
                if (this.mounted) {
                  this.setState({ authorAvatarUrl: thumbnailUrl });
                }
              });
          });
      })
      .catch(() => {
        this.setState({ error: true });
      })
      .then(() => this.setState({ loading: false }));
  }

  /*
   * Called when the component unmounts.
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /*
   * Render an error if the article was not found.
   * If the article was obtained ok render the "ArticleDetails" component
   */
  render() {
    const { topicId, topicName } = this.props;

    const {
      error, loading, article, articleImageUrl, authorAvatarUrl,
    } = this.state;

    return (
      <div>
        {/* Render error */}
        {error && (
          <p>
            <h2>Article Not Found</h2>
            <i>Unable to view article details.</i>
          </p>
        )}

        {/* Render loading */}
        {loading && !error && (
          <div className="progress-spinner" />
        )}

        {/* Render data */}
        {!error && !loading && (
          <ArticleDetails
            article={article}
            articleImageUrl={articleImageUrl}
            authorAvatarUrl={authorAvatarUrl}
            topicName={topicName}
            topicId={topicId}
          />
        )}
      </div>
    );
  }
}

/*
 * Define the type of data used in this component.
 */
ArticleDetailsContainer.propTypes = {
  topicId: PropTypes.string.isRequired,
  topicName: PropTypes.string.isRequired,
  articleId: PropTypes.string.isRequired,
};
