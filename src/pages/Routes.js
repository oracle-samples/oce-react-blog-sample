/**
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Contains the Routes used in the Client and Server routers.
 */
import TopicsListPage from './TopicsListPage';
import ArticlesListPage from './ArticlesListPage';
import ArticleDetailsPage from './ArticleDetailsPage';
import { getTopicsListPageData, fetchTopicArticles, fetchArticleDetails } from '../scripts/services';

const routes = [
  {
    path: '/',
    component: TopicsListPage,
    fetchInitialData: () => getTopicsListPageData(),
    title: 'Topics',
  },
  {
    path: '/articles/:topicId',
    component: ArticlesListPage,
    fetchInitialData: (path) => fetchTopicArticles(path.split('/').pop()),
    title: 'Articles',
  },
  {
    path: '/article/:articleId',
    component: ArticleDetailsPage,
    fetchInitialData: (path) => fetchArticleDetails(path.split('/').pop()),
    title: 'Article',
  },
];

export default routes;
