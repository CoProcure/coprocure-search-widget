import { checkParents } from './check-parents';
import { getUser, showIdentityModal, showContactVendorModal, showAdditionalDocsModal, showShareModal } from './user';
import { trackEvent } from './tracking';

export function handleExpansion(event) {
  let item = checkParents(event, 'expandable-contract');

  if(event.target.classList.contains('share-link')) {
    return;
  }

  if(item) {
    item.classList.toggle('flipped')
    event.preventDefault();

    if(item.classList.contains('flipped')) {
      document.querySelector('.contracts[data-hit-id="'+item.dataset.hitId+'"]').style.display = 'flex';
    } else {
      document.querySelector('.contracts[data-hit-id="'+item.dataset.hitId+'"]').style.display = 'none';
    }
    
    trackEvent('contract', 'expand', 'https://www.coprocure.us/search/record.html?id='+item.dataset.hitId);

    if(getUser()) {
    } else {
      // if not display modal
      trackEvent('contract', 'show-login-modal', 'https://www.coprocure.us/search/record.html?id='+item.dataset.hitId);
      showIdentityModal(item.dataset.hitId)
    }
  }

  if(checkParents(event, 'contact-vendor')) {
    showContactVendorModal(checkParents(event, 'contracts').dataset.hitId);
  }

  if(checkParents(event, 'additional-documents')) {
    showAdditionalDocsModal(checkParents(event, 'contracts').dataset.hitId);
  }

  if(checkParents(event, 'share-record')) {
    showShareModal(checkParents(event, 'contracts').dataset.hitId);
  }

  if(event.target.classList.contains('file-name-link')) {
    trackEvent('contract', 'download', 'https://www.coprocure.us/search/record.html?id='+item.dataset.hitId + ' - ' + event.target.innerText);
  }
}
