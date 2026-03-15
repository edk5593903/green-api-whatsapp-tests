import { Builder, By, until, WebDriver } from 'selenium-webdriver';

describe('GREEN-API console UI', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().setTimeouts({
      implicit: 10000,
      pageLoad: 20000,
      script: 15000,
    });
  }, 30000);

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  }, 20000);

  it.skip('should show instance as authorized in console', async () => {
    await driver.get('https://console.green-api.com/instanceList');

    const statusElement = await driver.wait(
      until.elementLocated(By.css('span.statusesAuth.statusesAuth__auth')),
      15000,
    );

    const statusText = await statusElement.getText();
    expect(statusText.toLowerCase()).toContain('авториз');
  }, 60000);
});
