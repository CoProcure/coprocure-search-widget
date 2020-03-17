import { getUser, setUser } from "./user.js";
import { trackEvent } from './tracking.js';
import { SEARCH_FEEDBACK_SHOW_STORAGE_KEY } from './overlays.js';

export function getSearchFeedbackEmbed(numHits) {
  if (numHits === 0) {
    // Set this key so we don't show them the popup later
    window.sessionStorage.setItem(SEARCH_FEEDBACK_SHOW_STORAGE_KEY, "yes");
    trackEvent("feedback-modal", "triggered", "zero-results");
    // Show a version of the search feedback modal embedded where the search results would
    // usually be.
    return `
  <div class="result-link search-no-results">
  <div class="search-feedback-embedded">
    <form>
      <h5>Sorry, we don't have results for your search yet</h5>
      <span class="field-description" id="search-failure">
        If you share a little more information about what you're looking for, we may be able to provide additional support on your request.
      </span>
      <div id="errors"> </div>
      <label>
        <span class="label-text">Email</span>
        <input type="email" name="email" required="required" value="${getUser()}"/>
        <div class='email-disclaimer'>We're committed to keeping your information secure. We will not share your email with any third party.</div>
      </label>
      <label>
        <span class="label-text">Please tell us in more detail what you are looking for:</span>
        <textarea name="search-feedback" placeholder="I'm looking for..." required="required"></textarea>
      </label>
      <button type="submit" class="search-feedback">Send</button>
    </form>
  </div>
  </div>`;
  } else {
    return "";
  }
}

export function connectSearchFeedback(json, searchTerm) {
  if (json.hits.found > 0) {
    // the search feedback embed isn't showing anyway
    return;
  }
  document
  .querySelector(".search-no-results form")
  .addEventListener("submit", function(event) {
    event.preventDefault();
    event.stopPropagation();

    const url = "https://93flntoz36.execute-api.us-east-1.amazonaws.com/production/contact/";
    const email = document.querySelector('.search-no-results input[name="email"]').value;
    setUser(email);

    const feedbackType = 'search-failure';
    const description = `Search Term: ${searchTerm} Type: ${feedbackType} Feedback: `;
    description += document.querySelector('textarea[name="search-feedback"]').value;
    
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
      trackEvent("feedback-modal", "modal 2 response", "modal 2 failure details");
      document.querySelector(".search-no-results button.search-feedback").textContent = "Thanks!";
    });
  });
}