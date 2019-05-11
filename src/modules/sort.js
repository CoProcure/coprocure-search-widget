//Imports
import { checkParents } from './check-parents';
import { trackEvent } from './tracking';


export function handleSort(event) {
  let sortableNode = checkParents(event,'js-sortable');
  if(sortableNode) {
    if(document.querySelector('input[name="query"]').value != '') {
      limit = false;
    }

    // conditionals for sorts:
    if(sortableNode.classList.contains('contract-name')) {
      window.currentSort = '&sort=title%20asc';
      if(window.highlightItem == '.contract-name') {
        if(sortableNode.classList.contains('reverse')) {
          window.reverseSort = '';
          window.currentSort = '&sort=title%20asc';
        } else {
          window.currentSort = '&sort=title%20desc';
          window.reverseSort = 'contract-name';
        }
      }
      window.highlightItem = '.contract-name';
    }

    if(sortableNode.classList.contains('contract-expiration')) {
      window.currentSort = '&sort=expiration%20asc';
      if(window.highlightItem == '.contract-expiration') {
        if(sortableNode.classList.contains('reverse')) {
          window.reverseSort = '';
          window.currentSort = '&sort=expiration%20asc';
        } else {
          window.currentSort = '&sort=expiration%20desc';
          window.reverseSort = 'contract-expiration';
        }
      }
      window.highlightItem = '.contract-expiration';
    }

    if(sortableNode.classList.contains('contract-agency')) {
      window.currentSort = '&sort=buyer_lead_agency%20asc';
      if(window.highlightItem == '.contract-agency') {
        if(sortableNode.classList.contains('reverse')) {
          window.reverseSort = '';
          window.currentSort = '&sort=buyer_lead_agency%20asc';
        } else {
          window.currentSort = '&sort=buyer_lead_agency%20desc';
          window.reverseSort = 'contract-agency';
        }
      }
      window.highlightItem = '.contract-agency';
    }

    if(sortableNode.classList.contains('contract-vendor')) {
      window.currentSort = '&sort=suppliers%20asc';
      if(window.highlightItem == '.contract-vendor') {
        if(sortableNode.classList.contains('reverse')) {
          window.reverseSort = '';
          window.currentSort = '&sort=suppliers%20asc';
        } else {
          window.currentSort = '&sort=suppliers%20desc';
          window.reverseSort = 'contract-vendor';
        }
      }
      window.highlightItem = '.contract-vendor';
    }

    if(sortableNode.classList.contains('contract-state')) {
      window.currentSort = '&sort=states%20asc';
      if(window.highlightItem == '.contract-state') {
        if(sortableNode.classList.contains('reverse')) {
          window.reverseSort = '';
          window.currentSort = '&sort=states%20asc';
        } else {
          window.currentSort = '&sort=states%20desc';
          window.reverseSort = 'contract-state';
        }
      }
      window.highlightItem = '.contract-state';
    }



    sortHighlights();
    sortableNode.classList.add('highlit');
    trackEvent('search','sort',window.currentSort);
    getResults(limit,0);
  }
} //ends handleSort()

function sortHighlights() {
  document.querySelectorAll('.js-sortable').forEach(function(item) {
    item.classList.remove('highlit');
  })
}


// Notes:
// Change window. here as well?
