import { connectSearchFeedback } from './search-feedback.js';
import { resultLayout } from './search-results.js';
import '../coprocure-pagination/index.js';
import { spinner } from './spinner.js';
import { states } from './states.js';
import { buyers } from './buyers.js';
import { coops } from './coops.js';
import { trackEvent } from './tracking.js';
import { debounce } from "debounce";
import { researchform } from './research-form.js';

function getParams() {
  let paramsObj = {};
  window.location.search.replace('?','').split('&').forEach((pair) => {
    let pairObj = pair.split('=');
    paramsObj[pairObj[0]] = pairObj[1];
  })
  return paramsObj;
}

export default class CoProcureSearch extends HTMLElement {
  static get observedAttributes() {
    return ['query', 'page', 'sort', 'states', 'buyers', 'coops', 'search'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if(attr === 'query') {
      if(newValue) {
        this.query = newValue;
        this.setAttribute('sort','');
      }
    }
    if(attr === 'page') {
      if(newValue) {
        this.page = newValue;
      }
    } else {
      // For every other changed attribute, you'll want to reset the pagination to start at 1
      this.setAttribute('page','1');
    }
    if(attr === 'sort') {
      this.sort = newValue;
    }
    if(attr === 'states') {
      if(newValue) {
        this.states = JSON.parse(newValue);
      }
    }
    if(attr === 'buyers') {
      if(newValue) {
        this.buyers = JSON.parse(newValue);
      }
    }
    if(attr === 'coops') {
      if(newValue) {
        this.coops = JSON.parse(newValue);
      }
    }
    if(this.query || this.prepop) {
      window.searchThrottle();
    }
  }

  connectedCallback() {
    let component = this;
    function throttleSearch() {
      component.search();
    }
    window.searchThrottle = debounce(throttleSearch, 200);

    this.showExpired = false;
    if(this.getAttribute('show-expired')) {
      this.showExpired = this.getAttribute('show-expired').toLowerCase() == "true"
    }

    this.showNonCoop = false;
    if(this.getAttribute('show-non-coop')) {
      this.showNonCoop = this.getAttribute('show-non-coop').toLowerCase() == "true";
    }

    if(this.getAttribute('query')) {
      this.query = this.getAttribute('query');
    }
    let queryParams = getParams();
    if(queryParams.query) {
      this.query = queryParams.query;
      this.setAttribute('query', this.query);
    }

    this.searchSourceLimit = '';
    this.restrictedSearch = false;
    if(this.getAttribute('searchonly')) {
      this.searchSourceLimit = this.getAttribute('searchonly');
      this.restrictedSearch = true;
    }
    this.prepop = '';
    if(this.getAttribute('prepop')) {
      this.prepop = this.getAttribute('prepop');
    }
    this.buyers = '';
    if(this.getAttribute('buyers')) {
      this.buyers = JSON.parse(this.getAttribute('buyers'))[0];
    }

    this.headless = true;
    if(!this.getAttribute('headless')) {
      // When headless=false, this version with an embedded search form is what is used on
      // 3rd party partner sites. The search will display its own query box above the results.
      // We add a headless=true parameter to the custom element on coprocure.us, where
      // the query box would be redundant with the page header, which includes a search box.
      this.headless = false;
      let alignmentMod = '';
      let restrictCheckbox =  '';
      if(this.searchSourceLimit) {
        restrictCheckbox = `<p style="text-align: right; color: #3ea8eb; font-size: 14px;"><input type="checkbox" style="vertical-align: text-top;" name="release" value="1"> Search all of CoProcure</p>`;
        alignmentMod = 'margin-top: 33px;'
      }
      this.innerHTML = `
        <div class="search-interior">
        <a href="https://www.coprocure.us" class="company-identifier powered-by" style="text-decoration: none;">
          <span class="powered-by-text">Powered by</span>
          <img width="150px" src="https://www.coprocure.us/img/logo-svg.svg" alt="CoProcure logo">
        </a>
        <form class="search-query">
          <div class="search-container" style="opacity: 1;${alignmentMod}">
            <input class="search-box" autocomplete="off" name="coprocure_query" placeholder="Keyword, supplier, lead agency...">
            <svg class="search-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.053 11.8788C18.053 15.0669 15.4547 17.6607 12.238 17.6607C9.02125 17.6607 6.42301 15.0669 6.42301 11.8788C6.42301 8.6907 9.02125 6.09683 12.238 6.09683C15.4547 6.09683 18.053 8.6907 18.053 11.8788Z" stroke="#37A8EB" stroke-width="2.32599"></path>
              <path d="M16.3083 16.5088L23.8678 23.4537" stroke="#37A8EB" stroke-width="2.32599"></path>
            </svg>
            <button class="search-now">Search</button>
            </div>
            ${restrictCheckbox}
        </form>
      </div>
      `
      document.querySelector('coprocure-search .search-query').addEventListener('submit',function(event) {
        event.preventDefault();
        let searchString = this.querySelector('.search-box').value;
        document.querySelector('coprocure-search').setAttribute('query',searchString);
      })
      this.classList.add('offsite');
      this.setupTracker();
      let coprocureComponent = this;
      let releaseCheck = document.querySelector('coprocure-search input[name="release"]');
      if(releaseCheck) {
        releaseCheck.addEventListener('click',function(event) {
          if(this.checked) {
            coprocureComponent.restrictedSearch = false;
            coprocureComponent.buyers = '';
            document.querySelector('coprocure-search').setAttribute('buyers','')
          } else {
            coprocureComponent.restrictedSearch = true;
          }
        })
      }
    }

    // if the prepop parameter is present we are going to perform a search right now and
    // display the results with an empty search. This was a feature request from Michigan
    // to emulate how their old site worked.
    if(this.prepop) {
      this.search();
    }

  }

  search() {
    this.innerHTML = spinner();
    if(this.headless) {
      window.scrollTo(0,0);
    }
    let numResults = 10;
    let start = 0;
    if(this.page && this.page > 1) {
      start = (numResults * this.page) - numResults;
    }
    let expParam = `expiration:['${new Date().toISOString()}',}`;
    let url = "https://1lnhd57e8f.execute-api.us-west-1.amazonaws.com/prod?";
    url += `q.parser=structured&size=${numResults}&start=${start}`;

    // have to split the query into separate terms if it is not enclosed in quotes or the structured filters will fail
    if(this.query || this.prepop) {
      if(this.query && this.query.indexOf('"')<0) {
        url += `&q=(and `;
        decodeURIComponent(this.query).split(' ').forEach( (term) => {
          url += ` '${term}'`;
        })
      } else if (this.query) {
        url += `&q=(and '${this.query}' `;
      } else {
        url += `&q=(and `;
      }
    }
    if(this.states && this.states.length > 0) {
      url += `(or buyer_lead_agency_state:`;
      this.states.forEach( (state) => {
        url += `'${state}' `;
      })
      url += `)`
    }
    if( (this.buyers && this.buyers.length > 0)) {
      if(typeof(this.buyers == "string")) {
        this.buyers = [this.buyers];
      }
      url += `(or buyer_lead_agency:`;
      this.buyers.forEach( (buyer) => {
        url += `'${encodeURIComponent(buyer)}' `;
      })
      url += `)`
    }
    if(this.searchSourceLimit && this.restrictedSearch) {
      this.scopeLimitArray = this.searchSourceLimit.split(',');
      url += `(and buyer_lead_agency:`;
      this.scopeLimitArray.forEach( (source) => {
        url += `'${encodeURIComponent(source)}' `;
      })
      url += `)`
    }
    if(this.coops && this.coops.length > 0) {
      url += ` (or cooperative_affiliation:`;
      this.coops.forEach( (coop) => {
        url += `'${encodeURIComponent(coop)}' `;
      })
      url += `)`
    }
    if(!this.showNonCoop) {
      url += `(and cooperative_language:'true')`;
    }
    // End of the query
    url += `)`

    if(this.sort) {
      url += '&sort='+this.sort;
      trackEvent('search', 'sort', this.sort);
    }
    // We want prepopulated, non query retrieved record sets to be title A-Z sorted
    if(!this.sort && !this.query) {
      url += '&sort=title%20asc'
    }
    if(!this.showExpired) {
      url += `&fq=${encodeURIComponent(expParam)}`;
    }

    // This toggles the different weights of the fields. Ask Andrew if you want to update this.
    const weightingOptions = "q.options=%7B%22defaultOperator%22%3A%22and%22%2C%22fields%22%3A%5B%22amendments_content%5E0.25%22%2C%22bid_solicitation_content%5E0.25%22%2C%22bid_solicitation_files%22%2C%22bid_tabulation_content%5E0.25%22%2C%22bid_tabulation_files%22%2C%22buyer_contacts%22%2C%22buyer_lead_agency%22%2C%22buyer_lead_agency_state%22%2C%22buyer_lead_agency_type%22%2C%22contract_content%5E0.25%22%2C%22contract_files%22%2C%22contract_number%22%2C%22cooperative_affiliation%22%2C%22other_docs_content%5E0.25%22%2C%22other_docs_files%22%2C%22piggybacking_gov_docs%22%2C%22piggybacking_govs%22%2C%22pricing_content%5E0.5%22%2C%22pricing_details%22%2C%22pricing_files%22%2C%22pricing_summary%22%2C%22summary%22%2C%22supplier_contacts%22%2C%22suppliers%5E2%22%2C%22title%5E1.5%22%5D%7D";
    url += "&" + weightingOptions;

    let component = this;
    if(this.query || this.prepop) {
      fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        component.renderResults(json);
        trackEvent('search', 'query', component.query);
      });
    }
  }

  renderResults(json) {
    this.innerHTML = resultLayout(json, this.query, this.sort, this.showExpired, this.showNonCoop, states, buyers, coops, this.states, this.buyers, this.coops, this.headless, this.searchSourceLimit, this.restrictedSearch);
    connectSearchFeedback(json, this.query);
    window.lastSearch = window.location.toString();
    trackEvent('search', 'results', json.hits.found.toString());

    if(document.querySelector('a[href="#contactanchor"]')) {
      document.querySelector('a[href="#contactanchor"]').addEventListener('click', function() {
        document.querySelector('.message-info textarea[name="description"]').value = 'Please help with the following research request:'
      })
    }

    let component = this;
    // listen for custom events on the contained pagination element
    document.querySelector('coprocure-pagination').addEventListener('navigation', function (e) {
      trackEvent('search', 'pagination', e.detail.page);
      document.querySelector('coprocure-search').setAttribute('page',e.detail.page);
    })
    document.querySelector('.show-filters').addEventListener('click', function(event) {
      event.preventDefault();
      document.querySelector('.search-filters').classList.toggle('active');
      document.querySelector('.overlay-background').classList.add('active');
      document.body.classList.add('noscroll');
    })
    document.querySelector('.overlay-background').addEventListener('click', function(event) {
      event.preventDefault();
      document.querySelector('.overlay-background').classList.remove('active');
      document.querySelector('.search-filters').classList.remove('active');
      document.body.classList.remove('noscroll');
    })
    document.querySelector('.search-sort').addEventListener('change', function(event) {
      event.preventDefault();
      document.querySelector('coprocure-search').setAttribute('sort',event.target.value);
    })
    document.getElementById('expired').addEventListener('change', function(event) {
      if(this.checked) {
        component.showExpired = true;
        trackEvent('search', 'filter', 'showExpired');
      } else {
        component.showExpired = false;
      }
      component.page = '1';
      component.search();
    })
    document.getElementById('noncoop').addEventListener('change', function(event) {
      if(this.checked) {
        component.showNonCoop = true;
        trackEvent('search', 'filter', 'showNonCoop');
      } else {
        component.showNonCoop = false;
      }
      component.page = '1';
      component.search();
    })

    document.querySelector('.js-filter-reset').addEventListener('click', function(event) {
      event.preventDefault();
      document.getElementById('noncoop').checked = false;
      component.showNonCoop = false;
      document.getElementById('expired').checked = false;
      component.showExpired = false;
      document.querySelectorAll('select[name="buyer_lead_agency_state"] option:checked').forEach( (item) => {
        item.selected = false;
      })
      document.querySelectorAll('select[name="buyer_lead_agency"] option:checked').forEach( (item) => {
        item.selected = false;
      })
      document.querySelector('select[name="buyer_lead_agency_state"] option').selected = true;
      document.querySelector('select[name="buyer_lead_agency"] option').selected = true;
      document.querySelector('select[name="coop_list"] option').selected = true;
      document.querySelector('button.filters-apply').click();
    })
    document.querySelector('button.filters-apply').addEventListener('click', function(event) {
      event.preventDefault();
      let selectedStates = document.querySelectorAll('select[name="buyer_lead_agency_state"] option:checked');
      let statesValues = Array.from(selectedStates).map(el => el.value);
      if(statesValues.length > 0) {
        document.querySelector('coprocure-search').setAttribute('states',JSON.stringify(statesValues));
        trackEvent('search', 'filter', 'coop='+JSON.stringify([statesValues]));
      }

      let selectedBuyers = document.querySelectorAll('select[name="buyer_lead_agency"] option:checked');
      let buyerValues = Array.from(selectedBuyers).map(el => el.value);
      if(buyerValues.length > 0) {
        document.querySelector('coprocure-search').setAttribute('buyers',JSON.stringify(buyerValues));
        trackEvent('search', 'filter', 'coop='+JSON.stringify([buyerValues]));
      }

      if(document.querySelector('select[name="coop_list"] option:checked')) {
        let selectedCoop = document.querySelector('select[name="coop_list"] option:checked').value;
        document.querySelector('coprocure-search').setAttribute('coops',JSON.stringify([selectedCoop]));
        trackEvent('search', 'filter', 'coop='+JSON.stringify([selectedCoop]));
      }
      let newSearch = 0;
      let lastSearch = document.querySelector('coprocure-search').getAttribute('search');
      if(lastSearch) {
        newSearch = lastSearch++;
      }

      document.querySelector('coprocure-search').setAttribute('search',newSearch);
    })
    if(!this.headless) {
      if(document.querySelector('.contact-us button')) {
        researchform()
      }
      document.querySelector('coprocure-search .search-query').addEventListener('submit',function(event) {
        event.preventDefault();
        let searchString = this.querySelector('.search-box').value;
        if(searchString == document.querySelector('coprocure-search').getAttribute('query')) {
          document.querySelector('coprocure-search').setAttribute('query','');
        }
        setTimeout(function() {
          document.querySelector('coprocure-search').setAttribute('query',searchString);
        },10);
      })
      let coprocureComponent = this;
      let releaseCheck = document.querySelector('coprocure-search input[name="release"]');
      if(releaseCheck) {
        releaseCheck.addEventListener('click',function(event) {
          if(this.checked) {
            coprocureComponent.restrictedSearch = false;
            coprocureComponent.buyers = '';
            document.querySelector('coprocure-search').setAttribute('buyers','')
          } else {
            coprocureComponent.restrictedSearch = true;
          }
        })
      }
    }
  }

  setupTracker() {
    let script1 = document.createElement('script');

    // TODO: Remove this onload function? Not sure it's accomplishing anything. GA might not
    // have been working correctly before because we need to declare the gtag function globally
    // for other js functions to use, not just run it here onload.
    script1.onload = function () {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-121612479-1');
    };
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=UA-121612479-1';
    script1.setAttribute('async', '');
    let script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];

      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', 'UA-121612479-1');`
    document.head.appendChild(script1);
    document.head.appendChild(script2);
  }

}

customElements.define("coprocure-search", CoProcureSearch);


// https://1lnhd57e8f.execute-api.us-west-1.amazonaws.com/prod?size=1&start=0&q='vest'&q.parser=structured&fq=expiration%3A%5B'2019-01-01T00%3A00%3A00Z'%2C%7D&sort=expiration+asc
