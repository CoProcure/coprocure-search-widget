import { isDate } from './is-date';
import { offset } from './offset.js';
import { getSearchFeedbackEmbed } from './search-feedback.js';

export function resultLayout(json, query, sort, expired, noncoop, states, buyers, coops, selectedStates, selectedBuyers, selectedCoops, headless, restrictedSearch, restrictionLifted) {
  let stateList = states();
  let buyerList = buyers();
  let coopList = coops();
  let currentOffset = offset();
  return `
  ${(function() {
    if(!headless) {
      let alignmentMod = '';
      let restrictCheckbox =  '';
      if(restrictedSearch) {
        restrictCheckbox = `<p style="text-align: right; color: #3ea8eb; font-size: 14px;"><input type="checkbox" style="vertical-align: text-top;" name="release" ${restrictionLifted ? '' : 'checked'} value="1"> Search all of CoProcure</p>`;
        alignmentMod = 'margin-top: 33px;'
      }
      return `<div class="search-interior">
      <a href="https://www.coprocure.us" class="company-identifier powered-by" style="text-decoration: none;">
        <span class="powered-by-text">Powered by</span>
        <img width="150px" src="https://www.coprocure.us/img/logo-svg.svg" alt="CoProcure logo">
      </a>
      <form class="search-query">
        <div class="search-container" style="opacity: 1;${alignmentMod}">
          <input class="search-box" autocomplete="off" name="coprocure_query" placeholder="Keyword, supplier, lead agency...">
          <svg class="search-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.053 11.8788C18.053 15.0669 15.4547 17.6607 12.238 17.6607C9.02125 17.6607 6.42301 15.0669 6.42301 11.8788C6.42301 8.6907 9.02125 6.09683 12.238 6.09683C15.4547 6.09683 18.053 8.6907 18.053 11.8788Z" stroke="#37A8EB" stroke-width="2.32599"></path>
            <path d="M16.3083 16.5088L23.8678 23.4537" stroke="#37A8EB" stroke-width="2.32599"></path>
          </svg>
          <button class="search-now">Search</button>
          </div>
          ${restrictCheckbox}
      </form>
    </div>`
    } else {
      return ''
    }
  })()}
  <div class="search-results-container">
    <div class="search-filters">
      <form method="get" action="/contracts.html">
        <div class="filter-section-title">Filters</div> <a class="remove-all js-filter-reset"> Remove All Filters </a>
        <div class="field-group-header">Contract Term</div>
        <div class="field--checkbox">
          <input type="checkbox" name="expired" id="expired" ${(expired) ? 'checked' : ''}>
          <label for="expired">Include expired contracts</label>
        </div>
        <div class="field-group-header">Contract Language</div>
        <div class="field--checkbox">
          <input type="checkbox" name="noncoop" id="noncoop" ${(noncoop) ? 'checked' : ''}>
          <label for="noncoop">Include contracts without cooperative language</label>
        </div>

        <div class="field-group-header">Contract Creator</div>

        <div class="field--select">
          <label for="buyer_lead_agency_state">Lead agency location</label>
          <select class="ui fluid search dropdown" multiple="" name="buyer_lead_agency_state" id="buyer_lead_agency_state">
            <option value="">All states</option>
            ${stateList.map(function(state) {
              let checked = false;
              if(selectedStates) {
                selectedStates.forEach( (selectedState) => {
                  if(state.abbrev == selectedState) {
                    checked = true;
                  }
                })
              }
              return `<option value="${state.abbrev}" ${(checked) ? 'selected' : ''}>${state.name}</option>`
            }).join('   ')}
          </select>
        </div>
        <div class="field--select">
          <label for="buyer_lead_agency">Lead agencies</label>
          <select name="buyer_lead_agency" multiple id="lead_agencies">
            <option value="">All agencies</option>
            ${buyerList.map(function(buyer) {
              let checked = false;
              if(selectedBuyers) {
                selectedBuyers.forEach( (selectedBuyer) => {
                  if(buyer == selectedBuyer) {
                    checked = true;
                  }
                })
              }
              return `<option value="${buyer}" ${(checked) ? 'selected' : ''}>${buyer}</option>`
            }).join('   ')}
          </select>
        </div>
        <div class="field--select">
          <label for="coop_list">Purchasing cooperatives/consortiums</label>
          <select name="coop_list" id="coop_list">
            <option value="">All cooperatives/consortiums</option>
            ${coopList.map(function(coop) {
              let checked = false;
              if(selectedCoops) {
                selectedCoops.forEach( (selectedCoop) => {
                  if(coop == selectedCoop) {
                    checked = true;
                  }
                })
              }
              return `<option value="${coop}" ${(checked) ? ' selected' : ''}>${coop}</option>`
            }).join('   ')}
          </select>
        </div>

        <button class="filters-apply">Apply</button>

        <p class="research-help">Not seeing what you are looking for? <a href="#contactanchor">Submit a research request</a> for extra help finding the contracts you need</p>
      </form>

    </div>
    <div class="search-results">
    <div class="search-header">
      <div class="search-header-left">
        <h1>${(query) ? decodeURIComponent(query) : selectedBuyers} contracts</h1>
        <div class="search-query-controls">
          <a href="#" class="show-filters">Filters</a>
          <span class="result-count">Showing ${json.hits.start+1}-${json.hits.start + 10} of ${json.hits.found} results</span>
        </div>
      </div>
      <div class="search-header-right">
        <select name="search-sort" class="search-sort">
            <option value="">Sort by Relevance</option>
            <option value="suppliers%20asc" ${(sort=='suppliers%20asc') ? 'selected' : ''}>Supplier A - Z</option>
            <option value="suppliers%20desc" ${(sort=='suppliers%20desc') ? 'selected' : ''}>Supplier Z - A</option>
            <option value="buyer_lead_agency%20asc" ${(sort=='buyer_lead_agency%20asc') ? 'selected' : ''}>Buyer A - Z</option>
            <option value="buyer_lead_agency%20desc" ${(sort=='buyer_lead_agency%20desc') ? 'selected' : ''}>Buyer Z - A</option>
            <option value="expiration%20desc" ${(sort=='expiration%20desc') ? 'selected' : ''}>Expiration</option>
            <option value="title%20asc" ${(sort=='title%20asc') ? 'selected' : ''}>Title A - Z</option>
            <option value="title%20desc" ${(sort=='title%20desc') ? 'selected' : ''}>Title Z - A</option>
            <option value="buyer_lead_agency_state%20asc" ${(sort=='buyer_lead_agency_state%20asc') ? 'selected' : ''}>Buyer State A - Z</option>
            <option value="buyer_lead_agency_state%20desc" ${(sort=='buyer_lead_agency_state%20desc') ? 'selected' : ''}>Buyer State Z - A</option>
          </select>
        <div>
        </div>
        </div>
        </div>
      <ul>
        ${json.hits.hit.map( (item) => {
          let targetString = '';
          let contractUrl = `/contract.html?contractId=${item.id}`;
          if(!headless) {
            targetString = `target="_new"`;
            contractUrl = `https://www.coprocure.us/contract.html?contractId=${item.id}`;
          }
          return `<li>
          <a href="${contractUrl}" ${targetString} class="result-link">
           <div class="search-results-card-details">
              <div class="result-title">${(item.fields.title) ? item.fields.title : ''}</div>
              <div class="parties">
                ${(item.fields.buyer_lead_agency) ? `<div class="author">
                  <span class="field-name">Contract Creator</span>
                  <span class="field-value">${item.fields.buyer_lead_agency}</span>
                </div>` : ''}
                ${(item.fields.suppliers) ? `<div class="buyer">
                  <span class="field-name">Supplier</span>
                  <span class="field-value">${item.fields.suppliers}</span>
                  ${(function() {
                    let output = '';
                    if(item.fields.cooperative_language == "false" || item.fields.cooperative_language == "False" ) {
                        output += `<div class="warning"> <img src="https://www.coprocure.us/img/exclamation-point.svg" class=""> Non-cooperative contract</div>`
                    }
                    return output;
                    })()}
                </div>` : ''}
                <div class="cooperative-agency">
                  <span class="field-name">Purchasing cooperative/consortium</span>
                  <span class="field-value">${(item.fields.cooperative_affiliation) ? item.fields.cooperative_affiliation : 'N/A'}</span>
                </div>
              </div>
              ${(function() {
                let output = '';
                if(item.fields.summary) {
                  output += `<p>${item.fields.summary.substr(0,300)}`;
                  if(item.fields.summary.length > 300) {
                    output += '...';
                  }
                  output += `</p>`;
                }
                return output;
              })()}
            </div>
            <div class="search-results-card-controls">
              <div class="result-expiration">
                <span class="field-name">Expires on</span>
                <span class="field-value">${(function() {
                  if(isDate(item.fields.expiration)) {
                    // the replace might be a no-op
                    let contractExpDate = new Date(
                      item.fields.expiration.replace('Z',currentOffset)
                    );
                    let ret = '';
                    if(contractExpDate < new Date()) {
                      ret += `<div class="warning"> <img src="https://www.coprocure.us/img/exclamation-point.svg" class=""> </div>`;
                    }
                    ret += contractExpDate.toLocaleDateString("en-US");
                    return ret;
                  } else {
                    return '';
                  }
                })()}</span>
              </div>
            </div>
            </a>
          </li>`
        }).join('\n      ')}
        ${(function() {
          // Show the search feedback modal if no results
          return getSearchFeedbackEmbed(json.hits.found);
        })()}
      </ul>
      <coprocure-pagination current="${(json.hits.start + 10) / 10}" total="${json.hits.found}"></coprocure-pagination>
    </div>
  </div>
  <div class="overlay-background"></div>

  ${(function() {
    let output = '';
    // if numHits is zero, we will show the search feedback
    if (!headless && json.hits.found !== 0) {
      output = `<section class="contact-us blue-back">
      <a name="contactanchor"></a>
      <div class="section-interior">
        <h2>Submit a request</h2>
        <p class="subtext--medium">Not finding what you are looking for? Would you like some assistance? Let us know what you need and we'll get in touch within 24 hours</p>
        <form method="POST" action="https://5o1jg1o9n4.execute-api.us-west-2.amazonaws.com/staging/contact">
          <div class="fields row">
            <div class="submitter-info">
              <label>Name</label>
              <input name="fullname" type="text" />
              <label>Email</label>
              <input name="email" type="text" />
            </div>
            <div class="message-info">
              <label>What goods, services and/or vendors are you looking for?</label>
              <textarea name="description"></textarea>
            </div>
          </div>
          <div class="">
            <button class="highlight">Submit</button>
          </div>
        </form>
      </div>
    </section>`
    }
    return output;
  })()}
  `
}
