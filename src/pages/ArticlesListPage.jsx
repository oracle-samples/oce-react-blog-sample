/**
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import ArticlesListItem from '../components/ArticlesListItem';
import Breadcrumbs from '../components/Breadcrumbs';

/**
 * Component for the Articles List Page.
 */
export default function ArticlesListPage({ fetchInitialData, serverData, title }) {
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
  const { topicId } = useParams();
  const [searchParams] = useSearchParams();
  const topicName = process.env.IS_BROWSER ? searchParams.get('topicName') : '';

  React.useEffect(() => {
    document.title = title;
  }, [title]);

  React.useEffect(() => {
    if (fetchNewData.current === true) {
      setLoading(true);

      fetchInitialData(topicId)
        .then((results) => {
          setData(results);
          setLoading(false);
        });
    } else {
      fetchNewData.current = true;
    }
  }, [topicId, fetchNewData]);

  if (loading) {
    return <div className="progress-spinner" />;
  }

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

  return (
    <div data-testid="ArticlesListContainer">
      <Breadcrumbs breadcrumbsData={breadcrumbsData} />
      {data.articles && (
      <div id="articles">
        {data.articles.map(
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

ArticlesListPage.propTypes = {
  fetchInitialData: PropTypes.func.isRequired,
  serverData: PropTypes.shape().isRequired,
  title: PropTypes.string.isRequired,
};
