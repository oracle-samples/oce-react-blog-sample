/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import // SEE TUTORIAL
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

  // Obtain the delivery client from the Content Delivery SDK
  // using the specified configuration information
  const deliveryClient = // SEE TUTORIAL

  return deliveryClient;
}
