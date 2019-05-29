    //Add getResults to another file modules/getResults.js, fire a custom event

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
