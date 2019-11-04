import { checkParents } from './check-parents.js';
import { getUser, setUser } from './user.js';
import { trackEvent } from './tracking.js';

function showModal(modalInfo) {
  let modalBackdrop = `<div class="modal-backdrop fade"></div>`;
  let modalHTML = `<div class="js-identityModal modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog ${modalInfo.extraClass}" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${modalInfo.title}</h5>
        </div>
        <div class="modal-body">
          ${modalInfo.body}
          <input type="hidden" class="contractId" name="contractId" value="${modalInfo.contractId}">
        </div>
      </div>
    </div>
  </div>`;
  document.body.querySelector('coprocure-search').insertAdjacentHTML('beforeend',modalBackdrop);  
  document.body.querySelector('coprocure-search').insertAdjacentHTML('beforeend',modalHTML);
  setTimeout(function() {
    document.querySelector('.js-identityModal .modal-dialog').classList.add('show');
  },50);

  if(document.querySelector('.js-identityModal button.contact-vendor')) {
    document.querySelector('.js-identityModal button.contact-vendor').addEventListener('click',function(event) {
      event.preventDefault();
      event.stopPropagation();
      let url = 'https://cncx06eah4.execute-api.us-east-1.amazonaws.com/production/vendor-contact';
      let email = document.querySelector('.modal input[name="email"]').value;
      if(email) {
        setUser(email);
      } else {
        document.querySelector('.modal input[name="email"]').focus();
        return;
      }
      let description = document.querySelector('textarea[name="purchase-info"]').value;
      let contract = document.querySelector('input.contractId').value;
      let requestType = 'Vendor contact request';
      if(document.querySelector('input[name="anonymous"]').checked) {
        requestType = 'Anonymous '+requestType; 
      }
      
      fetch(url, {
        method: 'post',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, requestType, description, contract })
      }).then(function(response) {
        return response.text();
      }).then(function(data) {
        console.log(data);
        document.querySelector('.modal-backdrop').remove();
        document.querySelector('.js-identityModal').remove();
      });
      trackEvent('convert', 'foundSomething', 'vendor contact');
    })
  }

  if(document.querySelector('.js-identityModal button.additional-documents')) {
    document.querySelector('.js-identityModal button.additional-documents').addEventListener('click',function(event) {
      event.preventDefault();
      event.stopPropagation();
      let url = 'https://cncx06eah4.execute-api.us-east-1.amazonaws.com/production/vendor-contact';
      let email = document.querySelector('.modal-dialog form input[name="email"]').value;
      setUser(email);
      let description = document.querySelector('textarea[name="additional-documents"]').value;
      let contract = document.querySelector('input.contractId').value;
      let requestType = 'Request for additional documents';
  
      fetch(url, {
        method: 'post',
        headers: {
          "Content-Type": "application/json",
        },    
        body: JSON.stringify({ email, requestType, description, contract })
      }).then(function(response) {
        return response.text();
      }).then(function(data) {
        console.log(data);
        document.querySelector('.modal-backdrop').remove();
        document.querySelector('.js-identityModal').remove();
      });
    })
    trackEvent('convert', 'foundSomething', 'additional documents');
  }

  if(document.querySelector('.js-identityModal button.general-question')) {
    document.querySelector('.js-identityModal button.general-question').addEventListener('click',function(event) {
      event.preventDefault();
      event.stopPropagation();
      let url = 'https://cncx06eah4.execute-api.us-east-1.amazonaws.com/production/vendor-contact';
      let email = document.querySelector('.modal-dialog form input[name="email"').value;
      setUser(email);
      let description = document.querySelector('textarea[name="general-question"]').value;
      let contract = '';
      let requestType = 'General Question';
  
      fetch(url, {
        method: 'post',
        headers: {
          "Content-Type": "application/json",
        },    
        body: JSON.stringify({ email, requestType, description, contract })
      }).then(function(response) {
        return response.text();
      }).then(function(data) {
        console.log(data);
        document.querySelector('.modal-backdrop').remove();
        document.querySelector('.js-identityModal').remove();
      });
    })
  }  

  document.querySelector('.modal').addEventListener('click',function(event) {
    if(event.srcElement.name != 'anonymous') {
      event.preventDefault();
    }
    // if they clicked outside modal window, on background
    if(!checkParents(event, 'modal-dialog')) {
      document.querySelector('.modal-backdrop').remove();
      document.querySelector('.js-identityModal').remove();
    }
  })
}

export function showIdentityModal(contractId) {
  let modalInfo = {
    title: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg> Unlock access to thousands of contracts`,
    body: `<p>Enter your government email address to immediately get full free access - including contract downloads.</p>
      <form method="post" action="">
        <label>
          <span class="field-description">Your email address</span>
          <input type="text" name="email">
        </label>
        <button type="submit" class="add-email">Submit</button>
      </form>`,
    close: false,
    contractId: contractId
  }
  showModal(modalInfo);
}

export function showShareModal(contractId) {  
  let modalInfo = {
    title: 'Share this contract',
    body: `<form method="post" action="" class="share-modal">
        <label>
          <span class="multi-labels">
            <span class="field-description">Share by link:</span>
            <span class="success-label">Success! Link copied to clipboard.</span>
          </span>
          <input type="text" name="link" value="https://www.coprocure.us/contract.html?contractId=${contractId}">
        </label>
      </form>`,
    close: false,
    contractId: contractId
  }
  showModal(modalInfo);

  document.querySelector('.modal-body input[name="link"').select();
  document.execCommand('copy');
  
}

export function showContactVendorModal(contractId) {
  let modalInfo = {
    title: '',
    extraClass: 'mega',
    body: `<form method="post" action="/" class="multisection-modal">
      <div class="modal-explanation-section">
        <span class="coprocure-logo--white">
          <svg width="19" height="27" viewBox="0 0 19 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.83033 26.875L6.56411 24.6539V9.8681L15.2705 3.91278L18.5893 5.93271V17.17L11.0661 22.4327V18.4335L15.2705 15.3359V8.55052L9.83033 12.2711V26.875Z" fill="white"/>
            <path d="M0.0141602 17.17L5.07453 20.7668V16.3903L3.53069 15.2159V7.99523L8.5543 4.66735L10.2907 5.23814L13.5779 2.99763L8.5543 0.221191L0.0141602 5.93271V17.17Z" fill="white"/>
          </svg>
          <h5 class="coprocure-logo--text">CoProcure</h5>
        </span>
        <p><strong>Get answers to your questions anonymously.</strong><br> Share Your information when you're ready, or not at all.</p>
        <p><strong>Save time.</strong><br> Let CoProcure find the right supplier contact to answer your questions and/or start a new purchase.</p>
      </div>
      <div class="modal-business-section">
        <h5 class="modal-title">Connect with a supplier through CoProcure</h5>
        <label>
          <span class="label-text">Email</span>
          <input type="text" name="email" value="${getUser()}" />
        </label>
        <label>
          <span class="field-description">Inquiry</span>
          <textarea name="purchase-info"></textarea>
        </label>
        <label style="display: flex;align-items: center;margin: 0 0 20px 0;">
          <input type="checkbox" name="anonymous" id="anonymous">
          <span class="field-description checkbox-label">Keep my inquiry anonymous for now.</span>
        </label>
        <button type="submit" class="contact-vendor">Connect</button>
      </div>
    </form>`,
    close: false,
    contractId: contractId
  }
  showModal(modalInfo);
}

export function showAdditionalDocsModal(infoObject) {
  let modalInfo = {
    title: 'Missing Documents? Let Us Know',
    body: `<form method="post" action="">
        <span class="field-description">Thanks for letting us know that you'd like some additional documentation for this record. What documents would you like to request? Contract, bid tabulation, bid solicitation, amendments, other (please explain)</span>
        <label>
          <span class="label-text">Email</span>
          <input type="text" name="email" value="${getUser()}" />
        </label>
        <label>
          <span class="label-text">Inquiry</span>
          <textarea name="additional-documents"></textarea>
        </label>
        <button type="submit" class="additional-documents">Send</button>
      </form>`,
    close: false,
    contractId: infoObject.contractId
  }      

  if(infoObject.type == 'questions') {
    modalInfo = {
      title: 'Have a General Question?',
      body: `<form method="post" action="">
      <span class="field-description">We'd love to hear from you. Send us a message and we will get back to you as soon as we can.</span>
      <label>
        <span class="label-text">Email</span>
        <input type="text" name="email" value="${getUser()}" />
      </label>
      <label>
        <span class="label-text">Inquiry</span>
        <textarea name="general-question"></textarea>
      </label>
      <button type="submit" class="general-question">Send</button>
    </form>`,
      close: false
    }      
  }

  showModal(modalInfo);
}