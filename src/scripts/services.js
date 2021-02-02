/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
/* eslint-disable no-param-reassign */

import getDeliveryClient from './server-config-utils';

/**
  * This file contains a number of utility methods used to obtain data
  * from the server using the ContentSDK JavaScript Library.
  */

/* ----------------------------------------------------
 * Common Utils
 * ---------------------------------------------------- */

/*
 * Utility method to log an error.
 */
function logError(message, error) {
  if (error && error.statusMessage) {
    console.log(`${message} : `, error.statusMessage);
  } else if (error.error && error.error.code && error.error.code === 'ETIMEDOUT') {
    console.log(`${message} : `, error);
  } else if (error.error && error.error.code) {
    console.log(`${message} : `, error.error.code);
  } else if (error) {
    console.error(message, error);
  }
}

/**
 * Return the medium rendition URL for the specified item.
 *
 * @param {DeliveryClient} client - the delivery client to get data from OCE content
 * @param {string} identifier - the item id whose medium rendition URL is to be obtained
 * @returns {Promise({Object})} - A Promise containing the data
 */
function getMediumRenditionURL(client, identifier) {
  return client.getItem({
    id: identifier,
    fields: 'all',
    expand: 'all',
  }).then((asset) => {
    const object = asset.fields.renditions.filter((item) => item.name === 'Medium')[0];
    const format = object.formats.filter((item) => item.format === 'jpg')[0];
    const self = format.links.filter((item) => item.rel === 'self')[0];
    const url = self.href;
    return url;
  }).catch((error) => logError('Fetching medium rendition URL failed', error));
}

/**
 * Return the rendition URL for the specified item.
 *
 * @param {DeliveryClient} client - the delivery client to get data from OCE content
 * @param {string} identifier - the item id whose rendition URL is to be obtained
 * @return {string} the rendition URL
 */
function getRenditionURL(client, identifier) {
  const url = client.getRenditionURL({
    id: identifier,
  });
  return Promise.resolve(url);
}

/* ----------------------------------------------------
 * APIs to get the data for the Topics List Page
 * ---------------------------------------------------- */

/**
 * Fetch details about the specific topic.
 *
 * @param {DeliveryClient} client - the delivery client to get data from OCE content
 * @param {string} topicId - the id of the topic whose details are to be obtained
 * @returns {Promise({Object})} - A Promise containing the data
 */
function fetchTopic(client, topicId) {
  return client.getItem({
    id: topicId,
    fields: 'all',
    expand: 'all',
  }).then((topic) => {
    // Determine the medium rendition url from the topic itself.
    const object = topic.fields.thumbnail.fields.renditions.filter((item) => item.name === 'Medium')[0];
    const format = object.formats.filter((item) => item.format === 'jpg')[0];
    const assetimg = format.links.filter((item) => item.rel === 'self')[0];
    const url = assetimg.href;
    topic.url = url;
    return topic;
  }).catch((error) => logError('Fetching topic failed', error));
}

/**
 * Fetches most of the data for the topics list page.
 *
 * The data returned contains
 *    the company title,
 *    the about Url,
 *    the contact Url,
 *    the list of topics
 *
 * The only data not returned is the company logo URL, this needs to be obtained
 * using getRenditionURL specifying the logoId.
 *
 * @param {DeliveryClient} client - the delivery client to get data from OCE content
 * @returns {Promise({Object})} - A Promise containing the data
 */
function fetchHomePage(client) {
  return client.queryItems({
    q: '(type eq "OCEGettingStartedHomePage" AND name eq "HomePage")',
    fields: 'all',
  }).then((data) => {
    const logoID = data.items[0].fields.company_logo.id;
    const title = data.items[0].fields.company_name;
    const aboutUrl = data.items[0].fields.about_url;
    const contactUrl = data.items[0].fields.contact_url;

    const { topics } = data.items[0].fields;
    const promises = [];

    topics.forEach((origTopic) => {
      // add a promise to the total list of promises to get the full topic details
      promises.push(
        fetchTopic(client, origTopic.id)
          .then((topic) => topic),
      );
    });

    // execute all the promises returning a single dimension array of all
    // of the topics and the other home page data
    return Promise.all(promises)
      .then((allTopics) => (
        {
          logoID,
          companyTitle: title,
          aboutUrl,
          contactUrl,
          topics: allTopics.flat(),
        }
      ));
  }).catch((error) => logError('Fetching home page data failed', error));
}

/**
 * Fetches all the data required for the topics list page.
 *
 * The data returned contains
 *    the company title,
 *    the company logo Url,
 *    the about Url,
 *    the contact Url,
 *    the list of topics
 *
 * @returns {Promise({object})} - A Promise containing the data
 */
export function getTopicsListPageData() {
  const client = getDeliveryClient();

  return fetchHomePage(client)
    .then((data) => (
      getRenditionURL(client, data.logoID)
        .then((url) => {
          data.companyThumbnailUrl = url;
          return data;
        })
    ));
}

/* ----------------------------------------------------
 * APIs to get the data for the Articles List Page
 * ---------------------------------------------------- */

/**
 * Gets all the data required to render the articles list page.
 *
 * Get all the articles for the specified topic with its rendition URL populated.
 *
 * The data returned contains
 *   the topic id,
 *   the topic name,
 *   the list of articles
 *
 * @param {string} topicId - the id of the topic
 * @returns {Promise({object})} - A Promise containing the data
 */
export function fetchTopicArticles(topicId) {
  const client = getDeliveryClient();
  return client.queryItems({
    q: `(type eq "OCEGettingStartedArticle" AND fields.topic eq "${topicId}")`,
    fields: 'all',
    orderBy: 'fields.published_date:desc',
  }).then((data) => {
    const promises = [];
    const articles = data.items;

    articles.forEach((article) => {
      // add a promise to the total list of promises to get the article url
      promises.push(
        getMediumRenditionURL(client, article.fields.image.id)
          .then((url) => {
            article.url = url;
            // Note: the spread operator is used here so that we return a top level
            // object, rather than a value which contains the object
            // i.e we return
            //   {
            //     field1: 'value', field2 : "value", etc
            //   },
            // rather than
            //   {
            //     name: {
            //             field1: 'value', field2 : "value", etc
            //           }
            //    }
            return {
              ...article,
            };
          }),
      );
    });

    // execute all the promises and return all the data
    return Promise.all(promises)
      .then((allArticles) => allArticles.flat());
  }).catch((error) => logError('Fetching topic articles failed', error));
}

/* ----------------------------------------------------
 * APIs to get the data for the Articles Details Page
 * ---------------------------------------------------- */

/**
 * Get all the data required for rendering the article details page.
 *
 * Gets the details of the specified article with the image URL and author avatar URL
 * obtained.
 *
 * The data returned contains
 *   the article id,
 *   the article name,
 *   the name of the author,
 *   the url of the avatar image for the author,
 *   the article image URL,
 *   the caption for the article image,
 *   the article content,
 *   the date the article was posted
 *
 * @param {string} articleId - The id of the article
 * @returns {Promise({object})} - A Promise containing the data
 */
export function fetchArticleDetails(articleId) {
  const client = getDeliveryClient();
  return client.getItem({
    id: articleId,
    expand: 'all',
  }).then((article) => {
    const title = article.fields.author.name;
    const date = article.fields.published_date;
    const content = article.fields.article_content;
    const imageCaption = article.fields.image_caption;
    const { name } = article;

    // get the article image URL
    return getRenditionURL(client, article.fields.image.id)
      .then((articleImageUrl) => {
        const avatarID = article.fields.author.fields.avatar.id;
        // Get the author's avatar image
        return getMediumRenditionURL(client, avatarID)
          .then((authorAvatarUrl) => (
            // return an object with just the data needed
            {
              id: articleId,
              name,
              title,
              date,
              content,
              imageCaption,
              articleImageUrl,
              authorAvatarUrl,
            }
          ));
      });
  }).catch((error) => logError('Fetching article details failed', error));
}
