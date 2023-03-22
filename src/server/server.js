/**
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
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
// If we don't import Switch, then the routing fails due to code in react-router-config
// that references router.Switch
// eslint-disable-next-line no-unused-vars
import { matchPath } from 'react-router-dom';
import http from 'http';
import https from 'https';
import routes from '../pages/Routes';
import renderer from './renderer';
import getClient from '../scripts/server-config-utils';

/*
 * Create an instance of an Express server
 */
const server = express();

/*
 * Open all the files/folders in the "public" directory to the outside world by telling Express
 * to treat the "public" directory as a freely available public directory. Static assets can
 * therefore be served from ./public on the /public route.
 */
server.use(express.static('public'));

/*
 * Handle the proxy request.
 */
function handleContentRequest(req, res, authValue) {
  // only proxy GET requests, ignore all other requests
  if (req.method !== 'GET') {
    return;
  }

  // build the URL to the real server
  let content = process.env.SERVER_URL.charAt(process.env.SERVER_URL.length - 1) === '/'
    ? 'content' : '/content';
  if (req.url.charAt(0) !== '/') {
    content = `${content}/`;
  }
  const oceUrl = `${process.env.SERVER_URL}${content}${req.url}`;

  // Add the authorization header
  const options = {};
  if (authValue) {
    options.headers = { Authorization: authValue };
  }

  // define a function that writes the proxied content to the response
  const writeProxyContent = (proxyResponse) => {
    res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
    proxyResponse.pipe(res, {
      end: true,
    });
  };

  // based on whether the Content server is HTTP or HTTPS make the request to it
  const proxy = (oceUrl.startsWith('https'))
    ? https.request(oceUrl, options, (proxyResponse) => writeProxyContent(proxyResponse))
    : http.request(oceUrl, options, (proxyResponse) => writeProxyContent(proxyResponse));

  // write the proxied response to this request's response

  req.pipe(proxy, {
    end: true,
  });
}

/*
 * Route handler for requests to '/content/'.
 *
 * When authorization is needed for the calls to Oracle Content
 * - all image requests will be proxied through here regardless of server or client side rendering
 * - browser requests for content are proxied through here (server content requests will never be
 *   proxied)
 * - this server will pass on the call to Oracle Content adding on the authorization headers and
 *   returning the Oracle Content response.
 * This ensures the browser will never have the authorization header visible in its requests.
 *
 * See the following files where proxying is setup
 * - 'src/scripts/server-config-utils.getClient' for the code proxying requests for content
 * - 'src/scripts/utils.getImageUrl' for the code proxying requests for image binaries
 */
server.use('/content/', (req, res) => {
  const client = getClient();
  client.getAuthorizationHeaderValue().then((authValue) => {
    handleContentRequest(req, res, authValue);
  });
});

/*
 * Create a single route handler to listen to all (*) routes of our application
 */
server.get('*', (req, res) => {
  const activeRoute = routes.find((route) => matchPath(route.path, req.url)) || {};

  const promise = activeRoute.fetchInitialData
    ? activeRoute.fetchInitialData(req.path)
    : Promise.resolve();

  promise.then((data) => {
    // get the content to return to the client
    const content = renderer(req, data);
    // send the response
    res.send(content);
  });
});

/*
 * Set the port the Express server is listening on
 */
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Application is accessible on : http://localhost:${port}`);
});
