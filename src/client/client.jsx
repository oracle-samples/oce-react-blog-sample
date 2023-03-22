/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Entry point for the client side application.
 *
 * "webpack.client.config.js" is where this file is specified as the client side entry point.
 */
import 'core-js'; // replacement for babel-polyfill in babel 7.4 & above
import 'regenerator-runtime/runtime'; // replacement for babel-polyfill in babel 7.4 & above
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from '../pages/App';

// Client side React Router uses the BrowserRouter
// (as apposed to the StaticRouter used on the server).
ReactDOM.hydrate(
  <BrowserRouter basename={process.env.BASE_URL}>
    <App />
  </BrowserRouter>,
  document.querySelector('#root'),
);
