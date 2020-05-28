/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import PropTypes from 'prop-types';

import getDeliveryClient from '../scripts/server-config-utils';
import { fetchArticles } from '../scripts/services';

import ArticlesList from './ArticlesList';

/**
 * Component responsible for getting the list of articles for a topic.
 *
 * Note: This actual data is rendered in the "ArticlesList",
 * this design is to keep the model and view separate.
 *
 * @param {string} topicId The ID of the topic whose articles are to be obtained
 * @param {string} topicName The Name of the topic whose articles are to be obtained
 */
export default class ArticlesListContainer extends React.Component {
  constructor(props) {
    super(props);

    // keep track of whether this component is mounted or not
    this.mounted = false;

    // the component's state
    this.state = {
      loading: true,
      error: false,
      articles: {},
    };
  }

  /**
   * Load the data for the specific topic
   */
  componentDidMount() {
    this.mounted = true;

    // set the browser tab title
    document.title = 'Articles';

    // get the client to connect to CEC
    const deliveryClient = getDeliveryClient();

    const { topicId } = this.props;

    // fetch the articles for the topic
    fetchArticles(deliveryClient, topicId)
      .then((articles) => {
        if (this.mounted) {
          this.setState({ articles });
        }
      })
      .catch(() => { this.setState({ error: true }); })
      .then(() => this.setState({ loading: false }));
  }

  /*
   * Called when the component unmounts.
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /*
   * Render an error if the topic was not found.
   * If the found was obtained ok render the "ArticlesList" component
   */
  render() {
    const { topicId, topicName } = this.props;
    const { error, loading, articles } = this.state;

    return (
      <div data-testid="ArticlesListContainer">
        {/* Render error */}
        {error && (
          <p>
            <h2>Topic Not Found</h2>
            <i>Unable to list articles.</i>
          </p>
        )}

        {/* Render loading */}
        {loading && !error && (
          <div className="progress-spinner" />
        )}

        {/* Render data */}
        {!error && !loading && (
          <ArticlesList
            articles={articles}
            topicId={topicId}
            topicName={topicName}
          />
        )}
      </div>
    );
  }
}

/*
 * Define the type of data used in this component.
 */
ArticlesListContainer.propTypes = {
  topicId: PropTypes.string.isRequired,
  topicName: PropTypes.string.isRequired,
};
