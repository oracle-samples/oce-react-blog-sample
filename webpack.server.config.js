/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/*
 * Creates "server-bundle.js" for the server containing the Server Code and the React App.
 */
const path = require('path');
const { merge } = require('webpack-merge');
const webpackNodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config.js');

const config = {
  // inform WebPack that we are building a bundle for NodeJS rather
  // than for the browser and to avoid packaging built-ins.
  target: 'node',

  // tell WebPack the root file of our server application
  // usually the root file is "index.js" enabling just the server directory to be imported,
  // but specifically naming it "server.js" makes it a lot clearer that this file will only
  // run on the server.
  entry: './src/server/server.js',

  // tell WebPack the name of the generated output file and where to put it
  output: {
    filename: 'server-bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  // Tell WebPack to not bundle any libraries into our output bundle on the server
  // if that library exists in the "node-modules" folder. This is because on the server
  // Node can get the dependencies from node_modules on start up therefore they do not
  // have to be in the bundle
  // (unlike with the client bundle which has to have all the dependencies in it)
  externals: [webpackNodeExternals()],

  plugins: [
    new webpack.DefinePlugin({
      'process.env.IS_BROWSER': false
    })
  ],
};

// merge the base config and this config together to produce the full server config
module.exports = merge(baseConfig, config);
