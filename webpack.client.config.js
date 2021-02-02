/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/*
 * Creates "client-bundle.js" for the client containing just the React App.
 *
 * This is created so that event handlers coded in JavaScript are available on the client browser.
 */
const path = require('path');
const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config.js');

const config = {
  // do not need a 'target' as this is for the browser

  // tell WebPack the root file of our client application
  // usually the root file is "index.js" enabling just the client directory to be imported,
  // but specifically naming it "client.js" makes it a lot clearer that this file will only
  // run on the client.
  entry: './src/client/client.jsx',

  // tell WebPack the name of the generated output file and where to put it, its placed in the
  // "public" directory as it needs to be publically available to anyone who asks for it
  output: {
    filename: 'client-bundle.js',
    path: path.resolve(__dirname, 'public'),
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', 'styles'),
          to: path.resolve(__dirname, 'public'),
        },
      ],
    }),
    new webpack.DefinePlugin({
      'process.env.IS_BROWSER': true
    })
  ],
};

// merge the base config and this config together to produce the full client config
module.exports = merge(baseConfig, config);
