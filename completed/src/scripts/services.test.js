/* eslint-disable no-undef */

import { fetchHomePage } from './services';
import getDeliveryClient from './server-config-utils';
import MockServices from '../../test/MockServices';

/** ************************************************
 * This suite of tests illustrates how to test the
 * service wrappers (/src/scripts/services.js) used
 * by the application to retrieve data from the server.
 *
 * The wrapper functions call into the Delivery SDK
 * so those implementations are mocked to return
 * static data from JSON files.
 */
describe('Mocking the Content Delivery SDK', () => {
  /** *******************************************
   * This test shows how to specify a specific
   * JSON file to use as the output for a mocked
   * delivery SDK call.
   *
   * Paths specified in the file name will be
   * relative to the /test directory
   */
  test('Specifying a JSON file', async () => {
    /** *****************
     * Arrange
     ****************** */

    // Assign the file name to be used to supply the JSON response.
    // Paths are relative to the /test subdirectory
    const client = getDeliveryClient();
    const mocks = { queryItems: 'topics.json' };

    MockServices.overrideDeliverySDK(client, mocks);

    /** *****************
     * Act
     ****************** */
    const topLevelItem = await fetchHomePage(client);

    /** *****************
    * Assert
        ****************** */
    expect(topLevelItem.logoID).toBe('CONT6B3AE445978943C1AAF290B66512784C');
    expect(topLevelItem.title).toBe('Café Supremo');
    expect(topLevelItem.topics.length).toBe(3);
    expect(topLevelItem.aboutUrl).toBe('https://cloud.oracle.com/content');
    expect(topLevelItem.contactUrl).toBe('https://www.oracle.com/index.html#u02contactmenu');

    MockServices.resetDeliverySDK(client);
  });

  /** ***********************************************
   * This test shows how you can specify a function
   * (instead of a simple static response file) to
   * use as the mock for a delivery SDK call
   */
  test('Specifying a function', async () => {
    /** *****************
     * Arrange
     ****************** */
    // This function will be used in place of the
    // queryItems method in the Content Delivery SDK
    //
    const queryItemsFx = () => {
      const json = MockServices.topicsJSON();
      return Promise.resolve(json);
    };

    // This is the structure used to specify overrides
    // 'queryItems' is the name of the method in the SDK
    // queryItemsFx is the function to be used as the implementation of that method
    const mocks = { queryItems: queryItemsFx };

    // Assign the mock implementation to be used
    // for invocations of the 'real' call
    const client = getDeliveryClient();
    MockServices.overrideDeliverySDK(client, mocks);

    /** *****************
     * Act
     ****************** */
    const topLevelItem = await fetchHomePage(client);

    /** *****************
     * Assert
     ****************** */
    expect(topLevelItem.logoID).toBe('CONT6B3AE445978943C1AAF290B66512784C');
    expect(topLevelItem.title).toBe('Café Supremo');
    expect(topLevelItem.topics.length).toBe(3);
    expect(topLevelItem.aboutUrl).toBe('https://cloud.oracle.com/content');
    expect(topLevelItem.contactUrl).toBe('https://www.oracle.com/index.html#u02contactmenu');

    // Remove mocked implementations so that subsequent
    // tests are not impacted
    MockServices.resetDeliverySDK(client);
  });
});
