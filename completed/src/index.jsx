/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import './styles.css';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import TopicsListContainer from './components/TopicsListContainer';
import ArticlesListContainer from './components/ArticlesListContainer';
import ArticleDetailsContainer from './components/ArticleDetailsContainer';
import NotFound from './components/NotFound';

/**
 * Main entry point for the application.
 *
 * This file uses a Router to determine which Component is loaded into the HTML.
 * This enables us to navigate to different areas of the application.
 *
 * The application displays a list of topics. On clicking on a topic the screen
 * changes to display a list of articles in that topic. Clicking an article
 * displays the full article in its own screen.
 */
render(
  (
    <Router basename="/samples/oce-react-blog-sample">
      <Switch>
        <Route exact path="/" component={TopicsListContainer} />

        <Route
          exact
          path="/articles/:topicId"
          render={(props) => {
            // LIST OF ARTICLES FOR A TOPIC
            // URL FORMAT : /articles/topicId?topicName=name
            //
            // Called from:
            // - "TopicListItem"  : user has clicked on a topic in the topic listing
            // - "ArticleDetails"/"Breadcrumb" : User has clicked on the name
            //                                   of the topic in the breadcrumbs
            // Behaviour:
            // - Display the list of Articles for the topic
            // The topic name is passed to the ArticlesListContainer in order to display
            // in the breadcrumbs.
            const params = new URLSearchParams(props.location.search);
            const topicName = params.get('topicName');
            return (
              <ArticlesListContainer
                topicId={props.match.params.topicId}
                topicName={topicName}
              />
            );
          }}
        />

        <Route
          exact
          path="/article/:articleId"
          render={(props) => {
            // ARTICLE DETAILS
            // URL FORMAT : /article/articleId?topicName=name&topicId=id
            //
            // Called from :
            // - "ArticleListItem" : user has clicked on an Article in the articles listing
            // Behaviour:
            // - Display the details of that Articles
            // The topic name and topic id are passed to the ArticleDetailsContainer
            // in order to display in the breadcrumbs and enabling the user to click on
            // the topic name to go back to seeing the list of articles in that topic.
            const params = new URLSearchParams(props.location.search);
            const topicName = params.get('topicName');
            const topicId = params.get('topicId');
            return (
              <ArticleDetailsContainer
                articleId={props.match.params.articleId}
                topicName={topicName}
                topicId={topicId}
              />
            );
          }}
        />

        <Route exact component={NotFound} />
      </Switch>
    </Router>
  ),
  document.getElementById('root'),

);
