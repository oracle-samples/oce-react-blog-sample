/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Contains the Routes used in the Client and Server routers.
 */
import TopicsListPage from './TopicsListPage';
import ArticlesListPage from './ArticlesListPage';
import ArticleDetailsPage from './ArticleDetailsPage';
import NotFoundPage from './NotFoundPage';

export default [
  {
    ...TopicsListPage,
    path: '/',
    exact: true,
    title: 'Topics',
  },
  {
    ...ArticlesListPage,
    path: '/articles/:topicId',
    exact: true,
    title: 'Articles',
  },
  {
    ...ArticleDetailsPage,
    path: '/article/:articleId',
    exact: true,
    title: 'Article',
  },
  {
    NotFoundPage,
  },
];
