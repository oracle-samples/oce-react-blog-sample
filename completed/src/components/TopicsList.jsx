/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import PropTypes from 'prop-types';

import TopicListItemContainer from './TopicListItemContainer';

/**
 * Component representing a list of Topics.
 *
 * Note: This is called from "TopicsListContainer" which gets the data
 * to display in this component, this design is to keep the model and view separate.
 *
 * @param {array} topicIds the list of topic ids
 */
const TopicsList = (props) => {
  const { topicIds } = props;

  return (
    <div id="topics">
      {topicIds.map(
        (topicId) => (
          <TopicListItemContainer
            key={topicId}
            id={topicId}
          />
        ),
      )}
    </div>
  );
};

/*
 * Define the type of data used in this component.
 */
TopicsList.propTypes = {
  topicIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default TopicsList;
