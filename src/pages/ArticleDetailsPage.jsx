/**
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
import filterXSS from 'xss';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { dateToMDY } from '../scripts/utils';
import Breadcrumbs from '../components/Breadcrumbs';

/**
 * Component for the Articles List Page.
 */
export default function ArticleDetailsPage({ fetchInitialData, serverData, title }) {
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

  const { articleId } = useParams();

  const [searchParams] = useSearchParams();

  const fetchNewData = React.useRef(!data);

  React.useEffect(() => {
    document.title = title;
  }, [title]);

  React.useEffect(() => {
    if (fetchNewData.current === true) {
      setLoading(true);

      fetchInitialData(articleId)
        .then((results) => {
          setData(results);
          setLoading(false);
        });
    } else {
      fetchNewData.current = true;
    }
  }, [articleId, fetchNewData]);

  if (loading) {
    return <div className="progress-spinner" />;
  }
  const topicId = process.env.IS_BROWSER ? searchParams.get('topicId') : '';
  const topicName = process.env.IS_BROWSER ? searchParams.get('topicName') : '';
  const {
    name,
    title: articleTitle,
    date,
    content,
    imageCaption,
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
          {data.authorRenditionUrls && (
            <picture>
              <source
                type="image/webp"
                srcSet={data.authorRenditionUrls.srcset}
                sizes="80px"
              />
              <source srcSet={data.authorRenditionUrls.jpgSrcset} sizes="80px" />
              <img src={data.authorRenditionUrls.small} alt="Author Avatar" />
            </picture>
          )}

          {/*  Author Name / Date */}
          <div className="name_date">
            <h4 className="title">{articleTitle}</h4>
            <div className="date">
              {formattedDate}
              {' '}
            </div>
          </div>
        </div>

        {/* Article Image and caption */}
        <figure>
          {data.renditionUrls && (
            <picture>
              <source type="image/webp" srcSet={data.renditionUrls.srcset} />
              <source srcSet={data.renditionUrls.jpgSrcset} />
              <img
                src={data.renditionUrls.large}
                alt="Article"
                width={data.renditionUrls.width}
                height={data.renditionUrls.height}
              />
            </picture>
          )}
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

ArticleDetailsPage.propTypes = {
  fetchInitialData: PropTypes.func.isRequired,
  serverData: PropTypes.shape().isRequired,
  title: PropTypes.string.isRequired,
};
