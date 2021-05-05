/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Function to take a date and return it as a formatted string.
 *
 * @param {Date} date the date to format into a nice string
 */
export default function dateToMDY(date) {
  const dateObj = new Date(date);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const formattedDate = dateObj.toLocaleDateString('en-US', options);
  return formattedDate;
}
