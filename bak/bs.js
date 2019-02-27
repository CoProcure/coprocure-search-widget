var webdriver = require('selenium-webdriver');

// Input capabilities
var capabilities = {
  'browserName' : 'Chrome',
  'browser_version' : '72.0',
  'os' : 'OS X',
  'os_version' : 'Mojave',
  'resolution' : '1024x768',
  'browserstack.user' : 'aaronhans2',
  'browserstack.key' : 'wCHtQxusu5W8hRiDi6kp',
  'browserstack.debug': 'true'
}

var driver = new webdriver.Builder().
  usingServer('http://hub-cloud.browserstack.com/wd/hub').
  withCapabilities(capabilities).
  build();

driver.get('http://dev.coprocure.us.s3-website-us-west-1.amazonaws.com/');
driver.findElement(webdriver.By.name('query')).sendKeys('BrowserStack');
//driver.findElement(webdriver.By.id('submit-search')).click();

driver.getTitle().then(function(title) {
  console.log(title);
});

driver.quit();
