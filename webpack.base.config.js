/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/*
 * Base WebPack config file used in both the client and server.
 */
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

// config() will read the .env file, parse the contents, assign it to process.env
require('dotenv').config();

// Production environments should specify the environment variable "BASE_URL" if the application
// is to be served at a URL other than root. The scripts in package json include setting of
// "BASE_URL" for production builds ("build" script)
// The "BASE_URL", is needed for the following:
// - server's StaticRouter's basename (src/server/renderer.jsx) (without a trailing slash)
// - client's BrowserRouter's basename (src/client/client.jsx) (without a trailing slash)
// - path to images for the footer which are in the "public" folder (needs a trailing slash)
// Set up the BASE_URL parameter, ensuring it does not have a trailing slash
let BASE_URL = '';
if (process.env.BASE_URL) {
  BASE_URL = process.env.BASE_URL.toString().trim();
  if (BASE_URL.substr(-1) === '/') {
    BASE_URL = BASE_URL.substr(0, BASE_URL.length - 1);
  }
}

module.exports = {
  output: {
    // publicPath : allows you to specify the base path for all the assets within your app
    // must end in a trailing slash, https://webpack.js.org/guides/public-path/
    publicPath: (BASE_URL) ? `${BASE_URL}` : '',
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },

  module: {
    rules: [
      // tell WebPack to use its babel loader to run Babel on every file it runs through
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cwd: __dirname,
        },
      },
    ],
  },

  plugins: [
    // define variables to be used in the application, this is used for the routers basename
    new webpack.DefinePlugin({
      'process.env.BASE_URL': JSON.stringify(BASE_URL),
      'process.env.EXPRESS_SERVER_PORT': JSON.stringify(process.env.EXPRESS_SERVER_PORT),
      'process.env.SERVER_URL': JSON.stringify(process.env.SERVER_URL),
      'process.env.API_VERSION': JSON.stringify(process.env.API_VERSION),
      'process.env.CHANNEL_TOKEN': JSON.stringify(process.env.CHANNEL_TOKEN),
    }),
  ],

  // Configure how modules are resolved
  resolve: {
    // enable WebPack to support importing of jsx files without having to
    // have the file extension specified
    extensions: ['.js', '.jsx'],
    // Redirect module requests when normal resolving fails?
    fallback: {
      http: false,
      https: false,
      // assert, net, tls needed for 'https-proxy-agent' dependency
      assert: false,
      net: false,
      tls: false,
    },
  },
};
