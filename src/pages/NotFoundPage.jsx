import React from 'react';
import PropTypes from 'prop-types';

/*
 * Component for the not found page.
 *
 * The "staticContext" property passed in to this component is the context object created
 * in "server.js". It is renamed by the "StaticRouter" when it passes it on to this component.
 * When rendering on the client side, the staticContext will be empty as there is no StaticRouter
 * on the client side. Therefore the property is defaulted to an empty object.
 */
const NotFoundPage = ({ staticContext = {} }) => {
  staticContext.notFound = true;

  return <h1 className="error">Sorry, the page you are requesting has not been found.</h1>;
};

export default NotFoundPage;

NotFoundPage.propTypes = {
  staticContext: PropTypes.shape({
    notFound: PropTypes.string,
  }),
};

NotFoundPage.defaultProps = {
  staticContext: {},
};
