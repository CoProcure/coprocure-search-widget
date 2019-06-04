// Imports
import "./_index.scss";
import { template } from "./modules/template.js";
import { displayResults } from './modules/search-results';
import { handleExpansion } from './modules/expand-contract'
import { handleSort } from './modules/sort';
import { trackEvent } from './modules/tracking';
import { asyncjsloader } from './modules/js-loader';
import { getResults, helper } from './modules/get-results'

// CoprocureSearch custom element
class CoprocureSearch extends HTMLElement {
  connectedCallback() {
    let showState = parseInt(this.dataset.displayState);
    let numResults = parseInt(this.dataset.results);
    let devSearchUrl = 'https://9957n2ojug.execute-api.us-west-1.amazonaws.com/stage';
    let prodSearchUrl = 'https://1lnhd57e8f.execute-api.us-west-1.amazonaws.com/prod'

    const data = {};
    // check to see if form was rendered on the server
    if(this.innerHTML.indexOf('<input') > -1) {
      // no need to re-render if the search form was rendered on the server
    } else {
      this.innerHTML = template(data);
      //defined below
      this.setupTracker();
    }

    // get elements with id of 'submit-search'(input button on template.js), run function when user clicks
    document.getElementById('submit-search').addEventListener('click',function(e) {
      //prevent default
      e.preventDefault();
      //set to empty string
      // ------ Get these off of the window, LATER
      window.highlightItem = '';
      //set to empty string
      // ------ Get these off of the window, LATER
      window.reverseSort = '';
      //getResults defined below
      // getResults(false,0);
      //  ----- ****instead of calling getResults, fire custom events ---- ****
      helper()
      //Adds 'spinner' class to custom element
      this.classList.add('spinner');
    })

    // add click event to a.js-goto-request element
    document.querySelector('.js-goto-request').addEventListener('click', (event) => {
      //toggle display of elelments with .submit-request
      if(document.querySelector('.submit-request').style.display == "none") {
        document.querySelector('.submit-request').style.display = "block";
      }
    })
    // add click event to input
    document.querySelector('input[name="show-non-coop"]').addEventListener('click', (event) => {
      // if input data value is empty
      if(document.querySelector('input[name="query"]').value != '') {
        // **** want to fire custom events and have other files to respond to custom events ****
        //  ----- ****instead of calling window.getResults, fire custom events ---- ****
        // window.getResults(false,0);
        console.log('non-coop radio clicked');
        helper()
      }
    })
    // add click event to input
    document.querySelector('input[name="show-expired"]').addEventListener('click', (event) => {
      //same code as above, lines 53-57
      if(document.querySelector('input[name="query"]').value != '') {
        // **** want to fire custom events and have other files to respond to custom events ****
        //  ----- ****instead of calling window.getResults, fire custom events ---- ****
        console.log('expired radio clicked');
        helper()
      }
    })

    // set currentSort to empty string
    window.currentSort = '';
    // set limit (associated with getResults function)to false
    window.limit = false;
<<<<<<< HEAD
    
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
=======

>>>>>>> 0c5b9679724f1853c7fe0c7a4ce577e66d241a3e

    if(this.dataset.record) {
      fetch(prodSearchUrl+'?&q.parser=structured&q=_id:\''+window.location.search.replace('?id=','')+'\'')
      .then(
        function(response) {
          // error handling
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
          //put respons in json and then
          response.json().then((data) => {
            //execute displayResults function with these parameters
            displayResults(data, numResults, showState);
            //remove spinner class
            document.getElementById('submit-search').classList.remove('spinner')
          });
        }
      )
      //error handling
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
    } //end if

    //add click event to div.search-results
    document.querySelector('.search-results').addEventListener('click', function(event) {
      //defined in expand-contract.js
      handleExpansion(event);
      //defined in sort.js
      handleSort(event);
    });

  } //end connectedCallback()

  setupTracker() {
    asyncjsloader("https://www.googletagmanager.com/gtag/js?id=UA-121612479-1", function() {

      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-121612479-1');
    })
  } //end setupTracker()

} //end CoProcureSearch html element
customElements.define("coprocure-search", CoprocureSearch);
