/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Handles the generation of the server generated HTML.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import serialize from 'serialize-javascript';

import Routes from '../pages/Routes';

export default (req, context) => {
  // generate the HTML content for this application
  const content = renderToString(
    <StaticRouter context={context} location={req.path} basename={process.env.BASE_URL}>
      <div>{renderRoutes(Routes)}</div>
    </StaticRouter>,
  );

  // Generate the final HTML content as a full HTML document
  // The body contains:
  // - a relative link to get the stylesheet for the page
  // - serialized data stored in the window (must be before the application content)
  // - the content from the application
  // - a script tag containing a relative link, telling the client to get the client
  //   side JavaScript bundle from the server
  // Note: the server has been set up to serve static content from the "public" directory
  // (see the "app.use" in "server.js").

  // if there is a BASE_URL we want the artifacts in the "public" folder to
  // be accessed with a relative URL, otherwise we want an absolute URL
  // this is so http://host:port/routeA or http://host:port/routeA/param/value
  // will get the items from the "public" folder
  const stylesFile = `${process.env.BASE_URL}/styles.css`;
  const favIconFile = `${process.env.BASE_URL}/favicon.png`;
  const clientBundleFile = `${process.env.BASE_URL}/client-bundle.js`;

  return `
    <!DOCTYPE html>
    <html lang="en-us">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Getting Started Blog - React</title>
        <link rel="icon" href="${favIconFile}" type="image/png">

        <link rel="stylesheet" href="${stylesFile}" type="text/css">
      </head>

      <body>
        <div id="root">${content}</div>
        <script>
          window.INITIAL_DATA = ${serialize(context.data)}
        </script>
        <script src="${clientBundleFile}"></script>
      </body>
    </html>
  `;
};
