import "./_index.scss";
import { template } from "./modules/template.js";
import { displayResults } from './modules/search-results';
import { handleExpansion } from './modules/expand-contract'
import { handleSort } from './modules/sort';
import { trackEvent } from './modules/tracking';
import { asyncjsloader } from './modules/js-loader';

class CoprocureSearch extends HTMLElement {
  connectedCallback() {
    let showState = parseInt(this.dataset.displayState);
    let numResults = parseInt(this.dataset.results);
    // let devSearchUrl = 'https://9957n2ojug.execute-api.us-west-1.amazonaws.com/stage';
    let prodSearchUrl = 'https://1lnhd57e8f.execute-api.us-west-1.amazonaws.com/prod'

    const data = {};
    if(this.innerHTML.indexOf('<input') > -1) {
      // no need to re-render if the search form was rendered on the server
    } else {
      this.innerHTML = template(data);
      this.setupTracker();
    }

    document.getElementById('submit-search').addEventListener('click',function(e) {
      e.preventDefault();
      window.highlightItem = '';
      window.reverseSort = '';
      getResults(false,0);
      this.classList.add('spinner');
    })

    document.querySelector('.js-goto-request').addEventListener('click', (event) => {
      if(document.querySelector('.submit-request').style.display == "none") {
        document.querySelector('.submit-request').style.display = "block";
      }
    })
    document.querySelector('input[name="show-non-coop"]').addEventListener('click', (event) => {
      if(document.querySelector('input[name="query"]').value != '') {
        console.log('hi')
        window.getResults(false,0);
      }
    })
    document.querySelector('input[name="show-expired"]').addEventListener('click', (event) => {
      if(document.querySelector('input[name="query"]').value != '') {
        window.getResults(false,0);
      }
    })
    
    window.currentSort = '';
    window.limit = false;
    
    window.getResults = (limit,start) => {
      let query = '';
      if(limit && document.querySelector('input[name="query"]').value == '') {
        query = 'kcrpc%20and%20';
      }
      if(document.querySelector('input[name="query"]').value != '') {
        trackEvent('search','query',document.querySelector('input[name="query"]').value);
      }
      let searchUrl = prodSearchUrl+'?size='+numResults+'&start='+start+'&q='+query+document.querySelector('input[name="query"]').value + window.currentSort; //+'&return='+fields;
      fetch(searchUrl)
      .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
          response.json().then((data) => {
            displayResults(data, numResults, showState);
            document.getElementById('submit-search').classList.remove('spinner')
            document.querySelector('.customize-results').style.display = "block";
          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
    }

    if(this.dataset.record) {
      document.querySelector('input[name="show-non-coop"]').checked = true;
      document.querySelector('input[name="show-expired"]').checked = true;
      fetch(prodSearchUrl+'?&q.parser=structured&q=_id:\''+window.location.search.replace('?id=','')+'\'')
      .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
          response.json().then((data) => {
            displayResults(data, numResults, showState);
            document.getElementById('submit-search').classList.remove('spinner')
          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
    }
    
    document.querySelector('.search-results').addEventListener('click', function(event) {
      handleExpansion(event);
      handleSort(event);
    });

    if(window.location.search.indexOf('coprocure_query=') > -1) {
      document.querySelector('input[name="query"]').value = window.location.search.replace('?coprocure_query=','')
      document.getElementById('submit-search').click();
    }

  }

  setupTracker() {
    asyncjsloader("https://www.googletagmanager.com/gtag/js?id=UA-121612479-1", function() {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-121612479-1');
      // do I need to trigger page load now?
    })
  }

}
customElements.define("coprocure-search", CoprocureSearch);
