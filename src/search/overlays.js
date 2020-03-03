import { checkParents } from "./check-parents.js";
import { getUser, setUser } from "./user.js";
import { trackEvent } from "./tracking.js";

const MODALTYPE = {
  ADDITIONAL_DOCS: "additional-docs",
  FOUND_YES_NO: "found-yes-no",
  GENERAL_QUESTION: "general-question",
  IDENTITY: "identity",
  PRODUCT: "product",
  SHARE: "share",
  VENDOR_CONTACT: "vendor-contact"
}

function showModal(modalInfo) {
  console.log('Showing', modalInfo.type, "modal");
  let modalBackdrop = `<div class="modal-backdrop fade"></div>`;
  let modalHTML = `<div class="js-identityModal modal fade ${modalInfo.type}" tabindex="-1" role="dialog">
      <div class="modal-dialog ${modalInfo.extraClass}" role="document">
        <div class="modal-content">
          <div class="close-modal">X</div>
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
  document.body
    .querySelector("coprocure-search")
    .insertAdjacentHTML("beforeend", modalBackdrop);
  document.body
    .querySelector("coprocure-search")
    .insertAdjacentHTML("beforeend", modalHTML);
  setTimeout(function() {
    document
      .querySelector(".js-identityModal .modal-dialog")
      .classList.add("show");
  }, 50);

  document
  .querySelector(".js-identityModal .close-modal")
  .addEventListener("click", function() {
    const modalType = document.querySelector(".js-identityModal").classList;
    if (modalType.contains('found-yes-no') || modalType.contains('search-feedback')) {
      trackEvent("feedback-modal", "closed", "close circle");
    }
    closeModal('close-clicked');
  });

  // TODO: Change these to switch based on modalInfo.type
  if (document.querySelector(".js-identityModal button.contact-vendor")) {
    setupContactVendorModal();
  }

  if (document.querySelector(".js-identityModal .product-request.button")) {
    setupProductModal();
  }

  if (document.querySelector(".js-identityModal button.additional-documents")) {
    setupAdditionalDocumentsModal();
  }

  if (document.querySelector(".js-identityModal button.general-question")) {
    setupGeneralQuestionModal();
  }

  if (document.querySelector(".js-identityModal button.search-feedback")) {
    setupSearchFeedbackModal();
  }

  if (modalInfo.type === "found-yes-no") {
    setupFoundYesNoModal(modalInfo.trigger);
  }

  document.querySelector(".modal").addEventListener("click", function(event) {
    if (event.srcElement.name != "anonymous") {
      event.preventDefault();
    }

    // if they clicked outside modal window, on background
    if (!checkParents(event, "modal-dialog")) {
      closeModal('background-click', modalInfo);
    }
  });
}

function closeModal(source, modalInfo) {
  console.log("Closing modal from", source);
  document.querySelector(".modal-backdrop").remove();
  document.querySelector(".js-identityModal").remove();
  document.querySelector("body").classList.remove("noscroll");
  if (modalInfo && modalInfo.type === "found-yes-no"){
    trackEvent("feedback-modal", "closed", "clicked out");
  }
}

export function showIdentityModal(contractId) {
  let modalInfo = {
    type: MODALTYPE.IDENTITY,
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
  };
  showModal(modalInfo);
}

export function showShareModal(contractId) {
  let modalInfo = {
    type: MODALTYPE.SHARE,
    title: "Share this contract",
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
  };
  showModal(modalInfo);

  document.querySelector('.modal-body input[name="link"').select();
  document.execCommand("copy");
}

function setupContactVendorModal() {
  document
  .querySelector(".js-identityModal button.contact-vendor")
  .addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    let url =
      "https://cncx06eah4.execute-api.us-east-1.amazonaws.com/production/vendor-contact";
    let email = document.querySelector('.modal input[name="email"]').value;
    if (email) {
      setUser(email);
    } else {
      document.getElementById("errors").innerHTML = "Please enter an email*";;
      document.querySelector('.modal input[name="email"]').focus();
      return;
    }
    let description = document.querySelector(
      'textarea[name="purchase-info"]'
    ).value;
    let contract = document.querySelector("input.contractId").value;
    let requestType = "Vendor contact request";
    if (document.querySelector('input[name="anonymous"]').checked) {
      requestType = "Anonymous " + requestType;
    }

    fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, requestType, description, contract })
    })
    .then(function(response) {
      return response.text();
    })
    .then(function(data) {
      console.log(data);
      closeModal('form-submitted');
    });
    trackEvent("convert", "foundSomething", "vendor contact");
  });
}

export function showContactVendorModal(contractId) {
  let modalInfo = {
    type: MODALTYPE.VENDOR_CONTACT,
    title: "",
    extraClass: "mega",
    body: `<form method="post" action="/" class="multisection-modal">
      <div class="modal-explanation-section">
        <span class="coprocure-logo--white">
          <svg width="19" height="27" viewBox="0 0 19 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.83033 26.875L6.56411 24.6539V9.8681L15.2705 3.91278L18.5893 5.93271V17.17L11.0661 22.4327V18.4335L15.2705 15.3359V8.55052L9.83033 12.2711V26.875Z" fill="white"/>
            <path d="M0.0141602 17.17L5.07453 20.7668V16.3903L3.53069 15.2159V7.99523L8.5543 4.66735L10.2907 5.23814L13.5779 2.99763L8.5543 0.221191L0.0141602 5.93271V17.17Z" fill="white"/>
          </svg>
          <h5 class="coprocure-logo--text">CoProcure</h5>
        </span>
        <p><strong>Get answers to your questions anonymously.</strong><br> Share your information when you're ready, or not at all.</p>
        <p><strong>Save time.</strong><br> Let CoProcure find the right supplier contact to answer your questions and/or start a new purchase.</p>
      </div>
      <div class="modal-business-section">
        <h5 class="modal-title">Connect with a supplier through CoProcure</h5>
        <div id="errors"> </div>
        <label>
          <span class="label-text">Email</span>
          <input type="text"  name="email" value="${getUser()}" />
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
  };
  showModal(modalInfo);
}

function setupAdditionalDocumentsModal() {
  document
  .querySelector(".js-identityModal button.additional-documents")
  .addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    let url =
      "https://cncx06eah4.execute-api.us-east-1.amazonaws.com/production/vendor-contact";
    let email = document.querySelector(
      '.modal-dialog form input[name="email"]'
    ).value;
    if (email) {
      setUser(email);
    } else {
      document.getElementById("errors").innerHTML = "Please enter an email*";;
      document.querySelector('.modal input[name="email"]').focus();
      return;
    }
    let description = document.querySelector(
      'textarea[name="additional-documents"]'
    ).value;
    let contract = document.querySelector("input.contractId").value;
    let requestType = "Request for additional documents";

    fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, requestType, description, contract })
    })
    .then(function(response) {
      return response.text();
    })
    .then(function(data) {
      console.log(data);
      closeModal('form-submitted');
    });
  });
  trackEvent("convert", "foundSomething", "additional documents");
}

function setupGeneralQuestionModal() {
  document
  .querySelector(".js-identityModal button.general-question")
  .addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    let url =
      "https://cncx06eah4.execute-api.us-east-1.amazonaws.com/production/vendor-contact";
    let email = document.querySelector(
      '.modal-dialog form input[name="email"'
    ).value;
    if (email) {
      setUser(email);
    } else {
      document.getElementById("errors").innerHTML = "Please enter an email*";;
      document.querySelector('.modal input[name="email"]').focus();
      return;
    }
    let description = document.querySelector(
      'textarea[name="general-question"]'
    ).value;
    let contract = document.querySelector("input.contractId").value;
    let requestType = "General Question";

    fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, requestType, description, contract })
    })
      .then(function(response) {
        return response.text();
      })
      .then(function(data) {
        console.log(data);
        closeModal('form-submitted');
      });
  });
}

export function showAdditionalDocsModal(infoObject) {
  let modalInfo = {
    type: MODALTYPE.ADDITIONAL_DOCS,
    title: "Missing Documents? Let Us Know",
    body: `<form method="post" action="">
        <span class="field-description">
          Thanks for letting us know that you'd like some additional documentation for this record.
          What documents would you like to request? Contract, bid tabulation, bid solicitation,
          amendments, other (please explain)
        </span>
        <div id="errors"> </div>
        <label>
          <span class="label-text">Email</span>
          <input type="text" name="email"  value="${getUser()}" />
        </label>
        <label>
          <span class="label-text">Inquiry</span>
          <textarea name="additional-documents"></textarea>
        </label>
        <button type="submit" class="additional-documents">Send</button>
      </form>`,
    close: false,
    contractId: infoObject.contractId
  };

  showModal(modalInfo);
}

export function showGeneralQuestionModal(infoObject) {
  let modalInfo = {
    type: MODALTYPE.GENERAL_QUESTION,
    title: "Have a General Question?",
    body: `<form method="post" action="">
    <span class="field-description">We'd love to hear from you. Send us a message and we will get back to you as soon as we can.</span>
    <div id="errors"> </div>
    <label>
      <span class="label-text">Email</span>
      <input type="text" name="email"  value="${getUser()}" />
    </label>
    <label>
      <span class="label-text">Inquiry</span>
      <textarea name="general-question"></textarea>
    </label>
    <button type="submit" class="general-question">Send</button>
  </form>`,
    close: false,
    contractId: infoObject.contractId
  };

  showModal(modalInfo);
}

function setupProductModal() {
  document
  .querySelector(".js-identityModal .button.product-request")
  .addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    let url =
      "https://93flntoz36.execute-api.us-east-1.amazonaws.com/production/contact/";
    let email = document.querySelector('.modal input[name="email"]').value;
    let name = document.querySelector('input[name="fullname"]').value;
    let workplace = document.querySelector(
      'input[name="agency/government"]'
    ).value;
    let want = document.querySelector('select[name="product-want"]').value;
    let description = `Jurisdiction: ${workplace}\nRequest: ${want}`
    document.getElementById("errors").innerHTML = "";
    if (name == "") {
      document.getElementById("errors").innerHTML =
        "Please enter your name*";
      return false;
    }
    if (email == "") {
      document.getElementById("errors").innerHTML =
        "Please enter an email*";
      return false;
    }
    fetch(url, {
      method: "post",
      body: `fullname=${name}&email=${email}&description=${description}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then(function(response) {
      return response.text();
    })
    .then(function(data) {
      console.log(data);
      closeModal('form-submitted');
    });
  });
}

export function showProductModal() {
  let modalInfo = {
    type: MODALTYPE.PRODUCT,
    title: "Learn how CoProcure can be used on your website",
    body: `<form method="post" class="product-overlay" action="">
    <span class="field-description">Our team will follow up to connect with you</span>
    <div class="expert-photo">
      <img src="img/about/mariel.png" class="">
      <img src="img/about/andrew.png" class="">
    </div>
    <div id="errors"> </div>
    <label>
      <span class="label-text">Full Name</span>
      <input type="text"  name="fullname"/>
    </label>
    <label>
      <span class="label-text">Government/Agency Name</span>
      <input type="text" name="agency/government"/>
    </label>
    <label>
      <span class="label-text">Work Email</span>
      <input type="text"  name="email" value="${getUser()}" />
    </label>
    <label>
    <span class="label-text">What free tool are you interested in?</span>
    <select name="product-want" id="products">
      <option value="I want to publish my agency's contracts using CoProcure">I want to publish my agency's contracts using CoProcure</option>
      <option value="I want to add CoProcure search to my website">I want to add CoProcure search to my website</option>
      <option value="Interested in both">Interested in both</option>
      <option value="I'm looking for more information">I'm looking for more information</option>
    </select>
    </label>
    <input type="submit" class="product-request button" value="Submit">
  </form>
  `,
    close: false
  };
  showModal(modalInfo);
}

function setupSearchFeedbackModal() {
  document
  .querySelector(".js-identityModal button.search-feedback")
  .addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();

    let url =
    "https://93flntoz36.execute-api.us-east-1.amazonaws.com/production/contact/";
    let email = document.querySelector('.modal input[name="email"]').value;
    if (email) {
      setUser(email);
    } else {
      document.getElementById("errors").innerHTML = "Please enter an email*";;
      document.querySelector('.modal input[name="email"]').focus();
      return;
    }
    let searchTerm = window.location.search.split('=')[1];

    const feedbackType = document.querySelector('.field-description').id;
    let description = `Search Term: ${searchTerm} Type: ${feedbackType} Feedback: `;
    description += document.querySelector(
      'textarea[name="search-feedback"]'
    ).value;
    fetch(url, {
      method: "post",
      body: `fullname=${name}&email=${email}&description=${description}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then(function(response) {
      return response.text();
    })
    .then(function(data) {
      console.log(data);
      if (feedbackType == 'search-failure'){
        trackEvent("feedback-modal", "modal 2 response", "modal 2 failure details");
      } else {
        trackEvent("feedback-modal", "modal 2 response", "modal 2 feedback");
      }
      closeModal('form-submitted');
    });
  });
}

export function showSearchFeedbackModal(successfulSearch) {
  let title = "We're glad to help!";
  let description = "Is there anything else you'd like to share with us?";
  let feedbackType = "search-success";
  let feedbackLabel = "Feedback";
  let placeholder = "It would be great if...";
  if (!successfulSearch) {
    title = "Sorry we couldn't be more helpful";
    description = "If you share a little more information about what you're looking for, we may be able to provide additional support on your request.";
    feedbackType = "search-failure";
    feedbackLabel = "Please tell us in more detail what you are looking for:";
    placeholder = "I'm looking for...";
  }
  let modalInfo = {
    type: "search-feedback",
    title: `${title}`,
    body: `<form method="post" action="">
    <span class="field-description" id="${feedbackType}">
      ${description}
    </span>
    <div id="errors"> </div>
    <label>
      <span class="label-text">Email</span>
      <input type="text" name="email"  value="${getUser()}" />
      <div class='email-disclaimer'>We're committed to keeping your information secure. We will not share your email with any third party.</div>
    </label>
    <label>
      <span class="label-text">${feedbackLabel}</span>
      <textarea name="search-feedback" placeholder="${placeholder}"></textarea>
    </label>
    <button type="submit" class="search-feedback">Send</button>
  </form>`,
    close: false
  };

  showModal(modalInfo);
}

function setupFoundYesNoModal(trigger) {
  document
  .querySelector(".js-identityModal .found-yes")
  .addEventListener("click", yesNoOnClick);

  document
  .querySelector(".js-identityModal .found-no")
  .addEventListener("click", yesNoOnClick);

  document
  .querySelector(".still-searching")
  .addEventListener("click", function(){
    console.log('clicked on still searching');
    closeModal('still-searching');
    trackEvent("feedback-modal", "closed", "still searching");
  });

  trackEvent("feedback-modal", "triggered", trigger);
}

function yesNoOnClick(event) {
  event.preventDefault();
  event.stopPropagation();
  // GA event tracking:
  const clickedYes = (
    event.target.className === "found-yes" ||
    event.target.className === "yes-img" ||
    event.target.className === "yes-text");
  if (clickedYes) {
    trackEvent("feedback-modal", "modal 1 response", "modal 1 yes");
  } else{
    trackEvent("feedback-modal", "modal 1 response", "modal 1 no");
  }
  // This is kind of a disgusting way to show the next modal. But it works?
  closeModal('search-feedback-next-modal');
  console.log("User clicked on", event.target.className);
  showSearchFeedbackModal(clickedYes);
}

const SEARCH_FEEDBACK_SHOW_STORAGE_KEY = "coprocure-search-feedback-shown";

export function maybeShowFoundYesNoModal(trigger) {
  // This will not show the modal if the user's already seen it this session. It returns
  // true if modal pops up, false if already shown.
  if (window.sessionStorage.getItem(SEARCH_FEEDBACK_SHOW_STORAGE_KEY) !== null) {
    console.log("Search feedback modal already shown this session!");
    return false;
  }
  window.sessionStorage.setItem(SEARCH_FEEDBACK_SHOW_STORAGE_KEY, "yes");
  let modalInfo = {
    type: MODALTYPE.FOUND_YES_NO,
    trigger: trigger,
    title: "Did you find what you were looking for today?",
    body: `<form method="post" action="">
    <div id="errors"> </div>
    <div class="yes-no-container">
      <div class="found-no">
        <img class="no-img" src="img/thumbs.png">
        <div class="no-text">No</div>
      </div>
      <div class="found-yes">
        <img class="yes-img" src="img/thumbs.png">
        <div class="yes-text">Yes</div>
      </div>
    </div>
    <div class="still-searching">I'm still searching...</div>
  </form>`,
    close: false
  };

  showModal(modalInfo);

  return true;
}
