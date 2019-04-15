import { fixture, expect } from '@open-wc/testing';

import '../dist/index.js';

function resolveAfter2Seconds(x) { 
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 1000 * x);
  });
}

describe('<coprocure-search>', function() {
  it('renders search box', async () => {
    const el = await fixture('<coprocure-search data-results="20"></coprocure-search>');
    expect(el.innerHTML.indexOf('input') > -1).to.equal(true);
  });

  it('run a search', async function() {
    this.timeout(50000)
    const el = await fixture('<coprocure-search data-results="20"></coprocure-search>');
    
    let searchBox = el.querySelector('input[name="query"]')
    searchBox.value = 'play';
    document.getElementById('submit-search').click();
    
    let results = await resolveAfter2Seconds(3);

    expect(el.querySelectorAll('.results-list li').length).to.be.above(9);

  });

});