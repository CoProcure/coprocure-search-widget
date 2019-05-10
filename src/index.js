// Imports
import "./_index.scss";
import { template } from "./modules/template.js";
import { displayResults } from './modules/search-results';
import { handleExpansion } from './modules/expand-contract'
import { handleSort } from './modules/sort';
import { trackEvent } from './modules/tracking';
import { asyncjsloader } from './modules/js-loader';

// CoprocureSearch custom element
class CoprocureSearch extends HTMLElement {
  connectedCallback() {
    let showState = parseInt(this.dataset.displayState);
    let numResults = parseInt(this.dataset.results);
    let prodSearchUrl = 'https://nhhu21hyj1.execute-api.us-west-1.amazonaws.com/prod';
    let devSearchUrl = 'https://9957n2ojug.execute-api.us-west-1.amazonaws.com/stage';

    const data = {};
    // check to see if form was rendered on the server
    if(this.innerHTML.indexOf('<input') > -1) {
      // no need to re-render if the search form was rendered on the server
    } else {
      this.innerHTML = template(data);
      //defined below
      this.setupTracker();
    }

    // want to fire custom events and have other files to respond to custom events
    // get elements with id of 'submit-search'(input button on template.js), run function when user clicks
    document.getElementById('submit-search').addEventListener('click',function(e) {
      //prevent default
      e.preventDefault();
      //set to empty string
      window.highlightItem = '';
      //set to empty string
      window.reverseSort = '';
      //getResults defined below
      getResults(false,0);
      //Adds 'spinner' class to custom element?
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
        //run window.getResults(false, 0)
        // getResults is defined below
        //  ****instead of window instead of global, fire custom events****
        window.getResults(false,0);
      }
    })
    // add click event to input
    document.querySelector('input[name="show-expired"]').addEventListener('click', (event) => {
      //same code as above, lines 53-57
      if(document.querySelector('input[name="query"]').value != '') {
        window.getResults(false,0);
      }
    })

    // set currentSort to empty string
    window.currentSort = '';
    // set limit (associated with getResults function)to false
    window.limit = false;

    // getResults function
    window.getResults = (limit,start) => {
      // set query to empty string
      let query = '';

      // if limit is true && input name value is empty
      if(limit && document.querySelector('input[name="query"]').value == '') {
        //then set query to this:
        query = 'kcrpc%20and%20';
      }

      // if input name value is *not* empty
      if(document.querySelector('input[name="query"]').value != '') {
        // then run track event function (imported from tracking.js) with these parameters
        trackEvent('search','query',document.querySelector('input[name="query"]').value);
      }

      // set searchUrl to this: (devSearchUrl, numResults declared above) (start is a parament of getResults) (query declared above)
      let searchUrl = devSearchUrl+'?size='+numResults+'&start='+start+'&q='+query+document.querySelector('input[name="query"]').value + window.currentSort; //+'&return='+fields;
      //get searchUrl
      fetch(searchUrl)
      .then(
        function(response) {
          //error handling
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          response.json().then((data) => {
            // display results to user (displayResults imported from search-results.js)
            displayResults(data, numResults, showState);
            //remove spinner class
            document.getElementById('submit-search').classList.remove('spinner')
            //change display settings
            document.querySelector('.customize-results').style.display = "block";
          });
        }
      )
      .catch(function(err) {
        //error handling
        console.log('Fetch Error :-S', err);
      });
    } //end window.getResults

    // Not sure what s happening here...
    if(this.dataset.record) {
      fetch(devSearchUrl+'?&q.parser=structured&q=_id:\''+window.location.search.replace('?id=','')+'\'')
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


  //What is this doing?
  setupTracker() {
    asyncjsloader("https://www.googletagmanager.com/gtag/js?id=UA-121612479-1", function() {

      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-121612479-1');
      // do I need to trigger page load now?
    })
  } //end setupTracker()

} //end CoProcureSearch html element
customElements.define("coprocure-search", CoprocureSearch);


////////////  Questions:  //////////////

// Line 40: this.classList.add('spinner');
// - does this add a class ('spinner') to the CoprocureSearch custom element?

// Line 53: if(document.querySelector('input[name="query"]').value != '') {
// - Is this line saying if the input data value is not empty (which would make the conditional statement 'true'), then run window.getResults?

// Do custom elements have datasets? Curious about dataset.record, dataset.displayState, dataset.results.
