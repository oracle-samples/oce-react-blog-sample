/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Entry point for the server side application.
 *
 * This is a simple Express Server.
 *
 * "webpack.server.config.js" is where this file is specified as the server side entry point.
 */
import 'core-js'; // replacement for babel-polyfill in babel 7.4 & above
import 'regenerator-runtime/runtime'; // replacement for babel-polyfill in babel 7.4 & above
import express from 'express';
import { matchPath } from 'react-router-dom';
import Routes from '../pages/Routes';
import renderer from './renderer';

const server = express();

// open all the files/folders in the "public" directory to the outside world by telling Express
// to treat the "public" directory as a freely available public directory.
// so static assets can be served from ./public on the /public route.
server.use(express.static('public'));

// create a single route handler to listen to all (*) routes of our application
server.get('*', (req, res) => {
  const activeRoute = Routes.find((route) => matchPath(req.url, route)) || {};

  const promise = activeRoute.fetchInitialData
    ? activeRoute.fetchInitialData(req)
    : Promise.resolve();

  promise.then((data) => {
    const context = { data, requestQueryParams: req.query };
    // get the content to return to the client
    const content = renderer(req, context);

    // if the route requested was not found, the content object will have its "notFound"
    // property set, therefore we need to change the response code to a 404, not found
    if (context.notFound) {
      res.status(404);
    }

    // send the response
    res.send(content);
  });
});

const port = process.env.EXPRESS_SERVER_PORT || 8080;
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
