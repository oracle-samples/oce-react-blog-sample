/* eslint-disable no-undef */
/** ****************************************************
 * Ensure that all tests will use UTC for timezones
 ***************************************************** */
describe('Timezones', () => {
  test('should always be UTC', () => {
    expect(new Date().getTimezoneOffset()).toBe(0);
  });
});
