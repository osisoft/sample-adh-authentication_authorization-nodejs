require('chromedriver');
const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { JUnitXmlReporter } = require('jasmine-reporters');
const appsettings = require('../src/appsettings.json');

var junitReporter = new JUnitXmlReporter({
  savePath: 'TestResults',
});
jasmine.getEnv().addReporter(junitReporter);
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

const wait = 10000;

describe('Sample App', () => {
  let driver;

  beforeEach(async function () {
    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  afterEach(() => driver && driver.quit());

  it('Should log in to Cds', async function () {
    await driver.get('http://localhost:5004');

    // Click to log in
    await driver.findElement(By.id('login')).click();

    // Enter user name, password, and click submit
    await driver
      .wait(until.elementLocated(By.id('email')), wait)
      .then((e) => e.sendKeys(appsettings.userName));
    await driver
      .wait(until.elementLocated(By.id('password')), wait)
      .then((e) => e.sendKeys(appsettings.password));
    await driver
      .wait(until.elementLocated(By.id('submit')), wait)
      .then(async function (e) {
        await driver.wait(until.elementIsEnabled(e), wait);
        setTimeout(async function () {
          await driver.findElement(By.id('submit')).click();
        }, 500);
      });

    // Click tenant button, and verify results
    await driver
      .wait(until.elementLocated(By.id('tenant')), wait)
      .then(async function (e) {
        await driver.wait(until.elementIsEnabled(e), wait);
        await driver.findElement(By.id('tenant')).click();
      });
    const results = await driver.findElement(By.id('results')).getText();
    assert(results.includes('User logged in'));
  });
});
