/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';

import getDeliveryClient from '../scripts/server-config-utils';
import { fetchHomePage, getRenditionURL } from '../scripts/services';

import TopicsList from './TopicsList';
import Header from './Header';

/**
 * Component representing a list of Topics with a header area
 * containing company logo, company name, Contact Us and About Us Links.
 */
export default class TopicsListContainer extends React.Component {
  constructor(props) {
    super(props);
    
    this.mounted = false;

    this.state = {
      loading: true,
      error: false,
      companyTitle: '',
      companyThumbnailUrl: '',
      aboutUrl: '',
      contactUrl: '',
      topicIds: [],
    };
  }

  /**
   * Load the data for the topics list
   */
  componentDidMount() {
    this.mounted = true;

    // set the browser tab title
    document.title = 'Topics';

    // get the client to connect to CEC
    const deliveryClient = getDeliveryClient();

    // get the top level item which contains the following information
    // - aboutURL / contactURL / thumbnailURL / company title
    // - array of topic ids : These are passed to TopicsList
    fetchHomePage(deliveryClient)
      .then((topLevelItem) => {
        getRenditionURL(deliveryClient, topLevelItem.logoID)
          .then((url) => {
            const topicIdentifiers = topLevelItem.topics.map((topic) => topic.id);

            if (this.mounted) {
              this.setState({
                companyTitle: topLevelItem.title,
                companyThumbnailUrl: url,
                aboutUrl: topLevelItem.aboutUrl,
                contactUrl: topLevelItem.contactUrl,
                topicIds: topicIdentifiers,
              });
            }
          })
          .catch(() => { this.setState({ error: true }); });
      })
      .then(() => this.setState({ loading: false }))
      .catch(() => { this.setState({ error: true }); });
  }

  /*
   * Called when the component unmounts.
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /*
   * Render this component
   */
  render() {
    const {
      error, loading, companyTitle, companyThumbnailUrl, aboutUrl, contactUrl, topicIds,
    } = this.state;

    return (
      <div>
        {/* Render error */}
        {error && (
          <div className="error">
            Oops, something went wrong.  Please verify that you have seeded
            data to the server and configured your serverUrl and channelToken.
          </div>
        )}

        {/* Render loading */}
        {loading && !error && (
          <div className="progress-spinner" />
        )}

        {/* Render data */}
        {!error && !loading && (
          <div data-testid="TopicsListContainer">
            <Header
              companyTitle={companyTitle}
              companyThumbnailUrl={companyThumbnailUrl}
              aboutUrl={aboutUrl}
              contactUrl={contactUrl}
            />
            <TopicsList topicIds={topicIds} />
          </div>
        )}
      </div>
    );
  }
}
