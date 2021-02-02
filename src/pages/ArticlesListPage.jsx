/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { fetchTopicArticles } from '../scripts/services';

import ArticlesListItem from '../components/ArticlesListItem';
import Breadcrumbs from '../components/Breadcrumbs';

/**
 * Component for the Articles List Page.
 */
class ArticlesListPage extends React.Component {
  constructor(props) {
    super(props);

    const { match } = this.props;
    const { topicId } = match.params;

    let data;
    let topicName;
    if (process.env.IS_BROWSER) {
      data = window.INITIAL_DATA;
      delete window.INITIAL_DATA;

      const { location } = this.props;
      const params = new URLSearchParams(location.search);
      topicName = params.get('topicName');
    } else {
      const { staticContext } = this.props;
      data = staticContext.data;
      topicName = staticContext.requestQueryParams.topicName;
    }

    this.state = {
      data,
      loading: !data,
      topicName,
      topicId,
    };
  }

  componentDidMount() {
    document.title = 'Articles';
    const { data, topicId } = this.state;

    if (!data) {
      this.fetchData(topicId);
    }
  }

  // called when any of the component's properties changes
  // if the properties have changed, reload the data
  componentDidUpdate(prevProps) {
    const { topicId } = this.state;

    if (prevProps.match.params.topicId !== topicId) {
      this.fetchData(topicId);
    }
  }

  // Client Side Data Fetching: called from Client when doing client side routing/hydration
  fetchData(topicId) {
    this.setState(() => ({
      loading: true,
    }));

    fetchTopicArticles(topicId)
      .then((data) => this.setState(() => ({
        data,
        loading: false,
      })));
  }

  // render the component
  render() {
    const {
      loading,
      data,
      topicName,
      topicId,
    } = this.state;
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

    if (loading === true) {
      return <div className="progress-spinner" />;
    }

    return (
      <div data-testid="ArticlesListContainer">
        <Breadcrumbs breadcrumbsData={breadcrumbsData} />
        {data && (
        <div id="articles">
          {data.map(
            (article) => (
              <ArticlesListItem
                article={article}
                key={article.id}
                topicName={topicName}
                topicId={topicId}
              />
            ),
          )}
        </div>
        )}
      </div>
    );
  }
}

// Server Side Data Fetching: called from Express server when sending HTML to client
function fetchInitialData(req) {
  return fetchTopicArticles(req.path.split('/').pop());
}

/*
 * Export an object with name value pairs of fetchInitialData function and component.
 */
export default {
  fetchInitialData,
  component: ArticlesListPage,
};

ArticlesListPage.propTypes = {

  staticContext: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({})),
    requestQueryParams: PropTypes.shape({
      topicName: PropTypes.string,
    }),
  }),

  match: PropTypes.shape({
    params: PropTypes.shape({
      topicId: PropTypes.string,
    }),
  }).isRequired,

  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

ArticlesListPage.defaultProps = {
  staticContext: {},
};
