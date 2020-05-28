/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import PropTypes from 'prop-types';

import getDeliveryClient from '../scripts/server-config-utils';
import { fetchTopic, getMediumRenditionURL } from '../scripts/services';

import TopicListItem from './TopicListItem';

/**
 * Component responsible for getting the the data for a single Topic
 * to display for that topic when rendered in the list of topics.
 *
 * Note: This actual data is rendered in the "TopicListItem",
 * this design is to keep the model and view separate.
 *
 * @param {string} id The ID of the Topic
 */
export default class TopicListItemContainer extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = {
      title: '',
      description: '',
      url: '',
    };
  }

  /**
   * Load the data for the specific topic
   */
  componentDidMount() {
    this.mounted = true;

    // get the client to connect to CEC
    const deliveryClient = getDeliveryClient();

    const { id } = this.props;

    // fetch the topic
    fetchTopic(deliveryClient, id)
      .then((topic) => {
        // once the topic is obtained, fetch the URL for the topic's thumbnail
        getMediumRenditionURL(deliveryClient, topic.fields.thumbnail.id)
          .then((thumbnailUrl) => {
            if (this.mounted) {
              this.setState({
                title: topic.name,
                description: topic.description,
                url: thumbnailUrl,
              });
            }
          });
      });
  }

  /*
   * Called when the component unmounts.
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /*
   * Render the TopicListItem to display the topic item
   */
  render() {
    const { id } = this.props;
    const { title, url, description } = this.state;

    return (
      <TopicListItem
        title={title}
        imageUrl={url}
        description={description}
        topicId={id}
      />
    );
  }
}

/*
 * Define the type of data used in this component.
 */
TopicListItemContainer.propTypes = {
  id: PropTypes.string.isRequired,
};
