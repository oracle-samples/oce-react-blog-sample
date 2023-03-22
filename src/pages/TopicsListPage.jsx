/**
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import Header from '../components/Header';
import TopicsListItem from '../components/TopicsListItem';

/**
* Component for the Topics List Page.
*/
export default function TopicsListPage({ fetchInitialData, serverData, title }) {
  const [data, setData] = React.useState(() => {
    let ret;
    if (process.env.IS_BROWSER) {
      ret = window.INITIAL_DATA;
      delete window.INITIAL_DATA;
    } else {
      ret = serverData;
    }
    return ret;
  });

  const [loading, setLoading] = React.useState(!data);

  const fetchNewData = React.useRef(!data);

  React.useEffect(() => {
    document.title = title;
  }, [title]);

  React.useEffect(() => {
    if (fetchNewData.current === true) {
      setLoading(true);

      fetchInitialData()
        .then((results) => {
          setData(results);
          setLoading(false);
        });
    } else {
      fetchNewData.current = true;
    }
  }, [fetchNewData]);

  if (loading) {
    return <div className="progress-spinner" />;
  }

  const {
    companyTitle,
    companyThumbnailRenditionUrls,
    aboutUrl,
    contactUrl,
    topics,
  } = data;
  return (
    <div data-testid="TopicsListContainer">
      <Helmet>
        <meta name="BUILD_TAG" content={`${process.env.BUILD_TAG}`} />
        <meta name="@oracle/content-management-sdk" content={`${process.env.SDK_VERSION}`} />
      </Helmet>
      <Header
        companyTitle={companyTitle}
        companyThumbnailRenditionUrls={companyThumbnailRenditionUrls}
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

TopicsListPage.propTypes = {
  fetchInitialData: PropTypes.func.isRequired,
  serverData: PropTypes.shape().isRequired,
  title: PropTypes.string.isRequired,
};
