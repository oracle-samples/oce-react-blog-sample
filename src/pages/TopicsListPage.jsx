/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { getTopicsListPageData } from '../scripts/services';

import Header from '../components/Header';
import TopicsListItem from '../components/TopicsListItem';

/**
 * Component for the Topics List Page.
 */
class TopicsListPage extends React.Component {
  constructor(props) {
    super(props);

    let data;
    if (process.env.IS_BROWSER) {
      data = window.INITIAL_DATA;
      delete window.INITIAL_DATA;
    } else {
      const { staticContext } = this.props;
      data = staticContext.data;
    }

    this.state = {
      data,
      loading: !data,
    };
  }

  // client side only : if this component doesn't already have its data, load it
  componentDidMount() {
    document.title = 'Topics';

    const { data } = this.state;
    if (!data) {
      this.fetchData();
    }
  }

  // Client Side Data Fetching: called from Client when doing client side routing/hydration
  fetchData() {
    this.setState(() => ({
      loading: true,
    }));

    getTopicsListPageData()
      .then((data) => {
        this.setState({
          data,
          loading: false,
        });
      });
  }

  // render the component
  render() {
    const { loading, data } = this.state;
    if (loading === true || !data) {
      return <div className="progress-spinner" />;
    }
    const {
      companyTitle,
      companyThumbnailUrl,
      aboutUrl,
      contactUrl,
      topics,
    } = data;
    return (
      <div data-testid="TopicsListContainer">
        <Header
          companyTitle={companyTitle}
          companyThumbnailUrl={companyThumbnailUrl}
          aboutUrl={aboutUrl}
          contactUrl={contactUrl}
        />
        {topics && (
        <div id="topics">
          {topics.map(
            (topic) => (
              <TopicsListItem topic={topic} key={topic.id} />
            ),
          )}
        </div>
        )}
      </div>
    );
  }
}

// Server Side Data Fetching: called from Express server when sending HTML to client
function fetchInitialData() {
  return getTopicsListPageData();
}

/*
 * Export an object with name value pairs of fetchInitialData function and component.
 */
export default {
  fetchInitialData,
  component: TopicsListPage,
};

TopicsListPage.propTypes = {
  staticContext: PropTypes.shape({
    data: PropTypes.shape({}),
  }),
};

TopicsListPage.defaultProps = {
  staticContext: {},
};
