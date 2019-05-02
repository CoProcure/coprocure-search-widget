import { fixture, expect } from '@open-wc/testing';

import '../dist/index.js';

function resolveAfter2Seconds(x) { 
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 1000 * x);
  });
}

function elementExists(selector) {
  return new Promise(resolve => {

    function checkForElement(selector, callback) {
      if(document.querySelector(selector)) {
        callback();
      } else {
        setTimeout(() => {
          checkForElement(selector, callback);
        }, 1000);
      }
    }

    checkForElement(selector, function() {
      resolve(true);
    })
  });
}

describe('<coprocure-search>', function() {
  it('renders search box', async () => {
    const el = await fixture('<coprocure-search data-results="20"></coprocure-search>');
    expect(el.innerHTML.indexOf('input') > -1).to.equal(true);
  });

  it('search displays results', async function() {
    this.timeout(50000)
    const el = await fixture('<coprocure-search data-results="20"></coprocure-search>');
    
    let searchBox = el.querySelector('input[name="query"]')
    searchBox.value = 'play';
    document.getElementById('submit-search').click();
    let results = await elementExists('.results-list');
    expect(el.querySelectorAll('.results-list li').length).to.be.above(9);
  });

  it('KCRPC contracts are not non cooperative', async function() {
    this.timeout(50000)
    const el = await fixture('<coprocure-search data-results="20"></coprocure-search>');    
    let searchBox = el.querySelector('input[name="query"]')
    searchBox.value = 'kcrpc';
    document.getElementById('submit-search').click();
    let results = await elementExists('.results-list');    
    expect(el.querySelectorAll('.results-list li')[1].innerHTML.indexOf('does not include cooperative')).to.be.below(0);
    // write test to make sure axon are flagged as non coop
  });

  it('We do have some axon non cooperative contracts', async function() {
    this.timeout(50000)
    const el = await fixture('<coprocure-search data-results="20"></coprocure-search>');    
    let searchBox = el.querySelector('input[name="query"]')
    searchBox.value = 'axon spd body worn video system';
    document.querySelector('input[name="show-non-coop"]').checked = true;
    document.getElementById('submit-search').click();
    let results = await elementExists('.results-list');    
    expect(el.querySelectorAll('.results-list li')[1].innerHTML.indexOf('does not include cooperative')).to.be.above(0);
  });

  it('loads pre rendered', async function() {
    this.timeout(50000)
    const el = await fixture(`<coprocure-search data-results="100" data-display-state="1">
    <!-- rendering the search widget HTML initially on the server -->
    <form method="GET" action="">
      <label for="contract-search" class="contract-search-label">Search for cooperative contracts by keyword, vendor, lead agency, and more...</label>
      <div  class="search-form">
        <input type="text" name="query" class="query" id="contract-search" autocomplete="off" placeholder="Search for contracts">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="search-icon"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
        <input type="submit" value="Search" id="submit-search" class="draw">
      </div>
      <span class="customize-results" style="display: none;">
        <span>
          <input type="checkbox" name="show-non-coop"> Show Non Cooperative Contracts
        </span>
        <span>
          <input type="checkbox" name="show-expired"> Show Expired Contracts
        </span>
        <a href="#submit-request-for-help" class="js-goto-request">Submit a research request</a>
      </span>
    </form>

    <div class="search-results">

    </div>

    <a name="submit-request-for-help"></a>
    <div class="submit-request" style="display:none;">
      <form method="post" action="">
        <h3>Submit a request</h3>
        <p>Not finding what you are looking for? Would you like some assistance? Let us know what you need and we'll get in touch <strong>within 24 hours</strong></p>
        <label>
          <span class="field-description">Your email</span>
          <input name="email" type="email" />
        </label>
  
        <label>
          <span class="field-description">What goods, services and/or vendors are you looking for?</span>
          <textarea name="my-request"></textarea>
        </label>
        <button type="submit">Submit</button>      
      </form>
    </div>
    </coprocure-search>`);
    
    let searchBox = el.querySelector('input[name="query"]')
    searchBox.value = 'play';
    document.getElementById('submit-search').click();
    let results = await elementExists('.results-list');
    expect(el.querySelectorAll('.results-list li').length).to.be.above(9);
  });


});