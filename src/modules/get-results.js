import { trackEvent } from './tracking';
import { displayResults } from './search-results';

//Add getResults to another file modules/getResults.js, fire a custom event
// Created custom event here

export function helper() {
  let event = new CustomEvent('getResults', {detail: getResults(false, 0)})

  document.dispatchEvent(event)
  document.addEventListener('getResults', function(e) {
    console.log('event received');
  })
}


export function getResults(limit,start) {

  //////// Will need to change this to reflect actual results. Currently throwing an error "Cannot read property 'dataset' of undefined" because of 'this' keyword. However, will need numResults variable in this function because of the searchUrl variable below. Hardcoding number to avoid error for now.
  // let numResults = parseInt(this.dataset.results);
  let numResults = 3
  //the same goes for showState
  // let showState = parseInt(this.dataset.displayState);
  let showState = 3;
  let devSearchUrl = 'https://9957n2ojug.execute-api.us-west-1.amazonaws.com/stage';
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


//Notes:

/*
Pagination -
There is an error when clicking through the pagination (>> link) that states getResults is not found.
I've imported the file in search-results.js, so I am not sure why it's not firing. Perhaps because it is hidden in the html and the browser isn't recoginizing it as a js function?

Timing -
The console.log('event recieved'); only fires on the second click (or search entry), although the even seems to be firing the first time?

The custom event is firing, but the search results aren't changing when radio buttons are clicked....But the getResults function is working.
I even changed the function on line 41 of index.js to test. 
*/