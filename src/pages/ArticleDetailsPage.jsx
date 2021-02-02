/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
import filterXSS from 'xss';
import React from 'react';
import PropTypes from 'prop-types';
import { fetchArticleDetails } from '../scripts/services';
import dateToMDY from '../scripts/utils';
import Breadcrumbs from '../components/Breadcrumbs';

/**
 * Component for the Articles List Page.
 */
class ArticleDetailsPage extends React.Component {
  constructor(props) {
    super(props);

    let data;
    let topicName;
    let topicId;
    if (process.env.IS_BROWSER) {
      data = window.INITIAL_DATA;
      delete window.INITIAL_DATA;

      const { location } = this.props;
      const params = new URLSearchParams(location.search);
      topicName = params.get('topicName');
      topicId = params.get('topicId');
    } else {
      const { staticContext } = this.props;
      data = staticContext.data;
      topicName = staticContext.requestQueryParams.topicName;
      topicId = staticContext.requestQueryParams.topicId;
    }

    this.state = {
      data,
      loading: !data,
      topicId,
      topicName,
    };
  }

  // executed client side only
  componentDidMount() {
    document.title = 'Article';

    const { match } = this.props;

    const { data } = this.state;
    if (!data) {
      this.fetchData(match.params.articleId);
    }
  }

  // called when any of the component's properties changes
  // if the properties have changed, reload the data
  componentDidUpdate(prevProps) {
    const { match } = this.props;

    if (prevProps.match.params.articleId !== match.params.articleId) {
      this.fetchData(match.params.articleId);
    }
  }

  // Client Side Data Fetching: called from Client when doing client side routing/hydration
  fetchData(articleId) {
    this.setState(() => ({
      loading: true,
    }));

    fetchArticleDetails(articleId)
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
      topicId,
      topicName,
    } = this.state;
    if (loading === true) {
      return <div className="progress-spinner" />;
    }
    const {
      name,
      title,
      date,
      content,
      imageCaption,
      articleImageUrl,
      authorAvatarUrl,
    } = data;
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
        text: name,
      },
    ];

    const formattedDate = (date && date.value) ? `Posted on ${dateToMDY(date.value)}` : '';
    const options = {
      stripIgnoreTag: true, // filter out all HTML not in the whitelist
      stripIgnoreTagBody: ['script'], // the script tag is a special case, we need
      // to filter out its content
    };
    // eslint-disable-next-line no-undef
    const cleancontent = filterXSS(content, options);

    return (
      <div>
        <Breadcrumbs breadcrumbsData={breadcrumbsData} />
        <div id="article">
          <div className="author">
            {/* Avatar */}
            <img src={authorAvatarUrl} alt="Author Avatar" />

            {/*  Author Name / Date */}
            <div className="name_date">
              <h4 className="title">{title}</h4>
              <div className="date">
                {formattedDate}
                {' '}
              </div>
            </div>
          </div>

          {/* Article Image and caption */}
          <figure>
            <img src={articleImageUrl} alt="Article" />
            <figcaption>{imageCaption}</figcaption>
          </figure>

          {/* Article Content */}
          <div className="content">
            { content.indexOf('</') !== -1
              ? (
                // eslint-disable-next-line react/no-danger
                <div dangerouslySetInnerHTML={{ __html: cleancontent }} />
              )
              : cleancontent}
          </div>
        </div>
      </div>
    );
  }
}

// Server Side Data Fetching: called from Express server when sending HTML to client
function fetchInitialData(req) {
  return fetchArticleDetails(req.path.split('/').pop());
}

/*
 * Export an object with name value pairs of fetchInitialData function and component.
 */
export default {
  fetchInitialData,
  component: ArticleDetailsPage,
};

ArticleDetailsPage.propTypes = {
  staticContext: PropTypes.shape({
    data: PropTypes.shape({}),
    requestQueryParams: PropTypes.shape({
      topicName: PropTypes.string,
      topicId: PropTypes.string,
    }),
  }),

  match: PropTypes.shape({
    params: PropTypes.shape({
      articleId: PropTypes.string,
    }),
  }).isRequired,

  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

ArticleDetailsPage.defaultProps = {
  staticContext: {},
};
