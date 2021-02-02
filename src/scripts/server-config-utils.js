/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import { createDeliveryClient } from 'contentsdk/content.min';

/**
 * Creates a ContentSDK Delivery Client.
 */
export default function getDeliveryClient() {
  // Create an object with the keys the ContentSDK is expecting
  // with the values for the OCE server to use in this application
  const serverconfig = {
    contentServer: process.env.SERVER_URL,
    contentVersion: process.env.API_VERSION,
    channelToken: process.env.CHANNEL_TOKEN,
  };

  // Add the following if you want logging from the ContentSDK shown in the console
  // serverconfig.logger = console;

  // Obtain the delivery client from the Content Delivery SDK
  // using the specified configuration information
  const deliveryClient = createDeliveryClient(serverconfig);

  return deliveryClient;
}
