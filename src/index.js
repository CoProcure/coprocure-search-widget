import 'whatwg-fetch';
import 'nodelist-foreach-polyfill';
import 'promise-polyfill/src/polyfill';
import './modules/remove-polyfill';
import 'document-register-element'

import "./_index.scss";
import template from "./index.html";
import { displayResults } from './modules/search-results';
import { handleExpansion } from './modules/expand-contract'
import { handleSort } from './modules/sort';
import { trackEvent } from './modules/tracking';

class CoprocureSearch extends HTMLElement {
  connectedCallback() {
    let showState = parseInt(this.dataset.displayState);
    let numResults = parseInt(this.dataset.results);
    console.log('num results '+numResults)

    const data = {};
    this.innerHTML = template(data);

    document.getElementById('submit-search').addEventListener('click',function(e) {
      e.preventDefault();
      window.highlightItem = '';
      window.reverseSort = '';
      getResults(false,0);
      this.classList.add('spinner');
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
      let searchUrl = 'https://nhhu21hyj1.execute-api.us-west-1.amazonaws.com/prod?size='+numResults+'&start='+start+'&q='+query+document.querySelector('input[name="query"]').value + window.currentSort; //+'&return='+fields;
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
    
  }
}
customElements.define("coprocure-search", CoprocureSearch);
