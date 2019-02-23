import { checkParents } from './check-parents';
import { trackEvent } from './tracking';

export function handleSort(event) {
  let sortableNode = checkParents(event,'js-sortable');
  if(sortableNode) {
    if(document.querySelector('input[name="query"]').value != '') {
      limit = false;
    }
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
      window.currentSort = '&sort=buyer%20asc';
      if(window.highlightItem == '.contract-agency') {
        if(sortableNode.classList.contains('reverse')) {
          window.reverseSort = '';
          window.currentSort = '&sort=buyer%20asc';
        } else {
          window.currentSort = '&sort=buyer%20desc';
          window.reverseSort = 'contract-agency';
        }
      }
      window.highlightItem = '.contract-agency';
    }
    sortHighlights();
    sortableNode.classList.add('highlit');
    trackEvent('search','sort',window.currentSort);
    getResults(limit,0);
  }
}

function sortHighlights() {
  document.querySelectorAll('.js-sortable').forEach(function(item) {
    item.classList.remove('highlit');
  })
}
