const { remote } = require('webdriverio');

(async () => {
    const browser = await remote({
        logLevel: 'error',
        path: '/',
        capabilities: {
            browserName: 'firefox'
        }
    });

    await browser.url('http://dev.coprocure.us.s3-website-us-west-1.amazonaws.com/');

    const title = await browser.getTitle();
    console.log('Title was: ' + title);

    const searchField = await browser.$('.query');
    searchField.addValue('play');

    let button = await browser.$('#submit-search');
    button.click();

    let firstTitle = await browser.$('.results-list .expandable-contract .contract-name div');
    let proceed = await firstTitle.waitForExist(5000);

    let titleText = await firstTitle.getText();
    console.log(titleText);

    await browser.deleteSession();
})().catch((e) => console.error(e));


// curl -L https://github.com/mozilla/geckodriver/releases/download/v0.24.0/geckodriver-v0.24.0-macos.tar.gz | tar xz
/*
make this test do a search
check results
see the modal
enter email and have modal dismissed

run test with IE

update readme with test setup info

run test via test command
*/