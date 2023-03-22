/**
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import routes from './Routes';

/**
* The main application component which uses routes to route the request to
* the appropriate component
*/
export default function App({ serverData = null }) {
  return (
    <Routes>
      {routes.map(({
        path, fetchInitialData, component: C, title,
      }) => (
        <Route
          key={path}
          path={path}
          element={<C serverData={serverData} fetchInitialData={fetchInitialData} title={title} />}
        />
      ))}
    </Routes>
  );
}

App.propTypes = {
  serverData: PropTypes.shape(),
};
App.defaultProps = {
  serverData: {},
};
