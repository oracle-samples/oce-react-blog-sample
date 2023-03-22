/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/**
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import { createDeliveryClient, createPreviewClient } from '@oracle/content-management-sdk';

/**
 * This file contains methods to create an Oracle Content SDK client to make calls to Oracle
 * Content. A "delivery client" is used to view content which has been published to a public
 * channel or published to a secure channel.  The "preview client" is used to view content
 * which has been assigned to a channel but has not yet been published.
 *
 * The minimal information which needs to be specified is the server URL, the rest API version
 * to use and the channel token for the channel which contains the data to display in the app.
 *
 * When previewing content or using content in a secure channel, authentication is required.
 *
 * The AUTH environment variable is used to specify the Authentication header value
 * (including "Basic"/"Bearer") when the value does not change, corresponding to the tokenString
 * in the constructor.
 *
 * The AUTH_PARAMS environment variable is used to specify the Authentication object values
 * to get a new access token on expiry of the old one, corresponding to the OAUTHValues
 * in the constructor.
 */

let clientInstance = null;

/**
 * Returns a Delivery Client or a Preview Client to be used to access
 * content from Oracle Content Management server.
 */
export default function getClient() {
  // When creating a client for the browser and authorization is needed for calls to
  // Oracle Content
  // - all requests (content and images) are to be proxied through this application's
  //   Express server
  // - the ServerURL for the Oracle Content SDK client will be this application's host
  //
  // See the following files where proxying is setup/done
  // - 'src/scripts/utils.getImageUrl' for the code proxying requests for image binaries
  // - 'src/server/server' for the Express server proxying.
  if (clientInstance === null) {
    let serverURL = process.env.SERVER_URL;
    if (process.env.IS_BROWSER && process.env.CONTENT_MODE !== 'delivery') {
      // proxy all requests through NodeJS server (on window location) to add auth headers
      serverURL = `${window.location.origin}/`;
    }

    const serverconfig = {
      contentServer: serverURL,
      contentVersion: process.env.API_VERSION,
      channelToken: process.env.CHANNEL_TOKEN,
      options: process.env.OPTIONS ? JSON.parse(process.env.OPTIONS) : null,
    };

    let authParams = null;
    if (!process.env.IS_BROWSER && process.env.CONTENT_MODE !== 'delivery') {
      authParams = {};
      const oauthParamsParsed = JSON.parse(process.env.AUTH_PARAMS);
      authParams.clientId = oauthParamsParsed.CLIENT_ID;
      authParams.clientSecret = oauthParamsParsed.CLIENT_SECRET;
      authParams.clientScopeUrl = oauthParamsParsed.CLIENT_SCOPE_URL;
      authParams.idpUrl = oauthParamsParsed.IDP_URL;

      serverconfig.authorization = process.env.AUTH;
      serverconfig.authorizationParams = authParams;
    }

    // Add the following if you want logging from the Oracle Content SDK shown in the console
    // serverconfig.logger = console;

    // create and return the relevant client
    if (process.env.CONTENT_MODE === 'preview') {
      clientInstance = createPreviewClient(serverconfig);
    } else {
      clientInstance = createDeliveryClient(serverconfig);
    }
  }
  return clientInstance;
}
