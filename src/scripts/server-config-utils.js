/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import { createDeliveryClient } from 'contentsdk/content.min'; 
import data from '../config/oce.json';

/**
 * Creates a ContentSDK Delivery Client from the data defined in
 * "oce.json".
 */
export default function getDeliveryClient() {
  // the "oce.json" has different key names to that
  // which is expected for the ContentSDK code, therefore we have to
  // have a new object with the keys that the ContentSDK is expecting.
  const serverconfig = {
    contentServer: data.serverUrl,
    contentVersion: data.apiVersion,
    channelToken: data.channelToken,
  };

  // Add the following if you want logging from the ContentSDK shown in the console
  // serverconfig.logger = console;

  // Obtain the delivery client from the Content Delivery SDK
  // using the specified configuration information
  const deliveryClient = createDeliveryClient(serverconfig);

  return deliveryClient;
}
