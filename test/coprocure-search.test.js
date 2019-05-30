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
    console.log(el.querySelectorAll('.results-list li')[1].innerHTML)
    expect(el.querySelectorAll('.results-list li')[1].innerHTML.indexOf('does not include cooperative')).to.be.above(0);
  });

});