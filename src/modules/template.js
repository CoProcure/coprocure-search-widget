export function template() {
  return `
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  
    <form method="GET" action="" class="search-form">
      <input type="text" name="query" class="query" autocomplete="off" placeholder="Search for cooperative contracts by keyword, vendor, lead agency, and more...">
      <i class="material-icons search-icon">search</i>
      <input type="submit" value="Search" id="submit-search" class="draw">
      <span class="customize-results" style="display: none;">
        <span>
          <input type="checkbox" name="show-non-coop"> Show Non Cooperative Contracts
        </span>
        <span>
          <input type="checkbox" name="show-expired"> Show Expired Contracts
        </span>
        <a href="#submit-request-for-help" class="js-goto-request">Submit a research request</a>
      </span>
    </form>

    <div class="search-results">

    </div>

    <a name="submit-request-for-help"></a>
    <div class="submit-request" style="display:none; width:700px">
      <form method="post" action="">
        <h3>Submit a request</h3>
        <p>Not finding what you are looking for? Would you like some assistance? Let us know what you need and we'll get in touch <strong>within 24 hours</strong></p>
        <label>
          <span class="field-description">Your email</span>
          <input name="email" type="email" />
        </label>

        <label>
          <span class="field-description">What goods, services and/or vendors are you looking for?</span>
          <textarea name="my-request" style="width:600px"></textarea>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  `;
}