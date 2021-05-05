/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Component representing a Topic displayed in the list of topics.
 *
 * @param {string} topic The topic to display
 */
const TopicsListItem = (props) => {
  const { topic } = props;
  const {
    id,
    name,
    description,
    renditionUrls,
  } = topic;

  return (
    <Link to={{ pathname: `/articles/${id}`, search: `?topicName=${name}` }} style={{ textDecoration: 'none' }}>
      <div className="topic">
        <div className="button-wrapper">
          <div className="button">{name}</div>
        </div>
        {renditionUrls && (
          <picture>
            <source type="image/webp" srcSet={renditionUrls.srcset} sizes="300px" />
            <source srcSet={renditionUrls.jpgSrcset} sizes="300px" />
            <img src={renditionUrls.thumbnail} alt="Topic Thumbnail" />
          </picture>
        )}
        <div className="desc-wrapper">
          <div className="description">{description}</div>
        </div>
      </div>
    </Link>
  );
};

export default TopicsListItem;

TopicsListItem.propTypes = {
  topic: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    renditionUrls: PropTypes.shape().isRequired,
  }).isRequired,
};
