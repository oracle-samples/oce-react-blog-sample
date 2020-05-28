/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import PropTypes from 'prop-types';

import getDeliveryClient from '../scripts/server-config-utils';
import { getMediumRenditionURL } from '../scripts/services';

import ArticleListItem from './ArticleListItem';

/**
 * Component responsible for getting the thumbnail for an article before using
 * "ArticleListItem" to render the article.
 *
 * Note: This actual data is rendered in the "ArticleListItem",
 * this design is to keep the model and view separate.
 *
 * This is called from "index.js" in the Router section when a user has clicked
 * on a link defined in "TopicListItem".
 *
 * @param {object} article The Article whose URL is to be obtained before its displayed
 * @param {object} topicId The Id of the topic the article is for
 *                         (used only for links to child items)
 * @param {object} topicName The name of the topic the article is for
 *                           (used only for links to child items)
 */
export default class ArticleListItemContainer extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = {
      loading: true,
      article: {},
      articleUrl: '',
    };
  }

  /**
   * Load the data
   */
  componentDidMount() {
    this.mounted = true;

    const { article } = this.props;

    // get the client to connect to CEC
    const deliveryClient = getDeliveryClient();

    getMediumRenditionURL(deliveryClient, article.fields.image.id)
      .then((url) => {
        if (this.mounted) {
          this.setState({
            article, articleUrl: url,
          });
        }
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
   * Render nothing when the article information is being obtained from the server.
   * When the data is obtained render the "ArticleListItem" component
   */
  render() {
    const { topicId, topicName } = this.props;
    const { loading, article, articleUrl } = this.state;

    return (
      <div>
        {loading
          ? ''
          : (
            <ArticleListItem
              topicId={topicId}
              topicName={topicName}
              article={article}
              articleUrl={articleUrl}
            />
          )}
      </div>
    );
  }
}

/*
 * Define the type of data used in this component.
 */
ArticleListItemContainer.propTypes = {
  topicId: PropTypes.string.isRequired,
  topicName: PropTypes.string.isRequired,
  article: PropTypes.shape({
    name: PropTypes.string.isRequired,
    fields: PropTypes.shape({
      image: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};
