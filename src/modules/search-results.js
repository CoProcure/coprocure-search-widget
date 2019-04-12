import { isDate } from './is-date';
import { getUser } from './user';
import { trackEvent } from './tracking';

function formatFilename(name) {
  if(name) {
    return decodeURIComponent(name.replace('.php',''));
  }
  return 'Contract document';
}

function offset() {
  let timezone_offset_min = new Date().getTimezoneOffset() + 60,
  offset_hrs = parseInt(Math.abs(timezone_offset_min/60)),
  offset_min = Math.abs(timezone_offset_min%60),
  timezone_standard;

   if(offset_hrs < 10)
  offset_hrs = '0' + offset_hrs;

   if(offset_min < 10)
  offset_min = '0' + offset_min;

   // Add an opposite sign to the offset
  // If offset is 0, it means timezone is UTC
  if(timezone_offset_min < 0)
  timezone_standard = '+' + offset_hrs + ':' + offset_min;
  else if(timezone_offset_min > 0)
  timezone_standard = '-' + offset_hrs + ':' + offset_min;
  else if(timezone_offset_min == 0)
  timezone_standard = 'Z';

   // Timezone difference in hours and minutes
  // String such as +5:30 or -6:00 or Z
  return timezone_standard;
}

export function displayResults(data, numResults, showState) {
  let currentOffset = offset();
  if(!window.trackEvent) {
    window.trackEvent = trackEvent;
  }
  let clampWidth = '';
  if(!showState) {
    clampWidth = 'style="max-width:700px;"'
  }
  let html = `
  <ul class="results-list" ${clampWidth}>
    <li class="header">
      <span class="contract-name js-sortable">
        Contract name 
        <svg class="icon icon-caret icon-caret--down" id="icon--dropdown-carrot" viewBox="0 0 9.7667 6.7638" ><title>Dropdown Caret</title><path d="M5.5819,6.4285,9.5683,1.4552A.8953.8953,0,0,0,8.87,0H.8969A.8953.8953,0,0,0,.1984,1.4552L4.1848,6.4285A.8953.8953,0,0,0,5.5819,6.4285Z"></path></svg>
      </span>
      <span class="contract-expiration js-sortable">
        Expiration 
        <svg class="icon icon-caret icon-caret--down" id="icon--dropdown-carrot" viewBox="0 0 9.7667 6.7638" ><title>Dropdown Caret</title><path d="M5.5819,6.4285,9.5683,1.4552A.8953.8953,0,0,0,8.87,0H.8969A.8953.8953,0,0,0,.1984,1.4552L4.1848,6.4285A.8953.8953,0,0,0,5.5819,6.4285Z"></path></svg>
      </span>
      <span class="contract-agency js-sortable">
        Lead agency
        <svg class="icon icon-caret icon-caret--down" id="icon--dropdown-carrot" viewBox="0 0 9.7667 6.7638" ><title>Dropdown Caret</title><path d="M5.5819,6.4285,9.5683,1.4552A.8953.8953,0,0,0,8.87,0H.8969A.8953.8953,0,0,0,.1984,1.4552L4.1848,6.4285A.8953.8953,0,0,0,5.5819,6.4285Z"></path></svg>
      </span>
      <span class="contract-vendor js-sortable">
        Vendor
        <svg class="icon icon-caret icon-caret--down" id="icon--dropdown-carrot" viewBox="0 0 9.7667 6.7638" ><title>Dropdown Caret</title><path d="M5.5819,6.4285,9.5683,1.4552A.8953.8953,0,0,0,8.87,0H.8969A.8953.8953,0,0,0,.1984,1.4552L4.1848,6.4285A.8953.8953,0,0,0,5.5819,6.4285Z"></path></svg>
      </span>
      ${(function() {
        if(showState) { 
          return `<span class="contract-state js-sortable">
          State
          <svg class="icon icon-caret icon-caret--down" id="icon--dropdown-carrot" viewBox="0 0 9.7667 6.7638" ><title>Dropdown Caret</title><path d="M5.5819,6.4285,9.5683,1.4552A.8953.8953,0,0,0,8.87,0H.8969A.8953.8953,0,0,0,.1984,1.4552L4.1848,6.4285A.8953.8953,0,0,0,5.5819,6.4285Z"></path></svg>
        </span>`;
        } else {
          return '';
        }
      })()}
    </li>
  ${data.hits.hit.map(function(result) {
    if(isDate(result.fields.expiration)) {
      if(result.fields.expiration < new Date().toISOString()) {
        // hiding expired contracts here for now
        return '';
      }
    }
    let contracts = [];
    if(result.fields.contract_files) {
      contracts = result.fields.contract_files;
    }
    let amendments = null;
    let pricing = null;
    let bid_tabulation = null;
    let bid_solicitation = null;
    let other_docs = null;
    if(result.fields.amendments_files) {
      amendments = result.fields.amendments_files;
    }
    if(result.fields.pricing_files) {
      pricing = result.fields.pricing_files;
    }
    if(result.fields.bid_tabulation_files) {
      bid_tabulation = result.fields.bid_tabulation_files;
    }
    if(result.fields.bid_solicitation_files) {
      bid_solicitation = result.fields.bid_solicitation_files;
    }
    if(result.fields.other_docs_files) {
      other_docs = result.fields.other_docs_files;
    }
    return `
    <li class="expandable-contract" data-hit-id="${result.id}">
      <span class="contract-name">
        <div>${result.fields.title}</div>
        ${(function() {
          if(result.fields.summary && result.fields.summary != 'undefined') { 
            return `<div class="summary">${result.fields.summary}</div>`;
          } else {
            return '';
          }
        })()}
      </span>
      <span class="contract-expiration">
        ${(function() {
          if(isDate(result.fields.expiration)) {
            let contractExpDate = result.fields.expiration;
            if(result.fields.expiration.indexOf('Z') > -1) {
              contractExpDate = result.fields.expiration.replace('Z',currentOffset);
            }
            return new Date(contractExpDate).toLocaleDateString();
          } else {
            return '';
          }
        })()}
      </span>
      <span class="contract-agency">${(function() {
        if(result.fields.buyer_lead_agency) { 
          return `${result.fields.buyer_lead_agency}`;
        } else {
          return '';
        }
      })()}
      </span>
      <span class="contract-vendor">${(function() {
        if(result.fields.suppliers) { 
          return `${result.fields.suppliers.toString()}`;
        } else {
          if(result.fields.vendor_info) { 
            return `${result.fields.vendor_info.replace('undefined','')}`;
          } else {
            return '';
          }
        }
      })()}</span>
      ${(function() {
        if(showState) { 
          return `<span class="contract-state">${(function() {
            if(result.fields.states) { 
              return `${result.fields.states}`;
            } else {
              return '';
            }
          })()}</span>`;
        } else {
          return '';
        }
      })()}
    </li>
    <li class="contracts" data-hit-id="${result.id}" style="display: none;">
      <div class="all-files">
        <div class="files">
          <p>Contract</p>
          ${contracts.map(function(doc) {
            let file = JSON.parse(doc);
            return `<div class="fileset">
              <a href="${file.url}" target="_new" class="file-name-link">${formatFilename(file.name)}</a>
            </div>`;
          }).join('\n      ')}
        </div>
        ${(function() {
          if(amendments) {
            return `<div class="files">
              <p>Amendments</p>
              ${amendments.map(function(doc) {
                let file = JSON.parse(doc);
                return `<div class="fileset">
                  <a href="${file.url}" target="_new" class="file-name-link">${formatFilename(file.name)}</a>
                </div>`;
              }).join('\n      ')}
            </div>`;
          } else {
            return '';
          }
        })()}
        ${(function() {
          if(pricing) {
            return `<div class="files">
            <p>Pricing</p>
            ${pricing.map(function(doc) {
              let file = JSON.parse(doc);
              return `<div class="fileset">
                <a href="${file.url}" target="_new" class="file-name-link">${formatFilename(file.name)}</a>
              </div>`;
            }).join('\n      ')}
            </div>`;
          } else {
            return '';
          }
        })()}
        ${(function() {
          if(bid_tabulation) {
            return `<div class="files">
            <p>Bid Tabulation</p>
            ${bid_tabulation.map(function(doc) {
              let file = JSON.parse(doc);
              return `<div class="fileset">
                <a href="${file.url}" target="_new" class="file-name-link">${formatFilename(file.name)}</a>
              </div>`;
            }).join('\n      ')}
            </div>`;
          } else {
            return '';
          }
        })()}
        ${(function() {
          if(bid_solicitation) {
            return `<div class="files">
            <p>Bid Solicitation</p>
            ${bid_solicitation.map(function(doc) {
              let file = JSON.parse(doc);
              return `<div class="fileset">
                <a href="${file.url}" target="_new" class="file-name-link">${formatFilename(file.name)}</a>
              </div>`;
            }).join('\n      ')}
            </div>`;
          } else {
            return '';
          }
        })()}
        ${(function() {
          if(other_docs) {
            return `<div class="files">
            <p>Other Documents</p>
            ${other_docs.map(function(doc) {
              let file = JSON.parse(doc);
              return `<div class="fileset">
                <a href="${file.url}" target="_new" class="file-name-link">${formatFilename(file.name)}</a>
              </div>`;
            }).join('\n      ')}
            </div>`;
          } else {
            return '';
          }
        })()}
      </div>
      <div class="buttons">
        <button class="contact-vendor">Contact Vendor</button>
        <button class="additional-documents">Request additional documents---</button>
        <button class="share-record">Share this record</button>
      </div>
    </li>`;
  }).join('\n      ')}
  ${(function() {
    let startPoint = data.hits.start + 1;
    let endPoint = startPoint + (numResults - 1);
    if(data.hits.found < numResults) {
      endPoint = data.hits.found;
    }
    let hitDescription = 'result';
    if(data.hits.found > 1) {
      hitDescription = 'results';
    }
    let moreLink = '';
    let lessLink = '';
    if(data.hits.found > startPoint + numResults) {
      moreLink = `<a href="javascript:trackEvent('search','next','${document.querySelector('input[name="query"]').value}');getResults(false,${data.hits.start + numResults});">>></a>`
    }
    if(data.hits.start > 0) {
      lessLink = `<a href="javascript:trackEvent('search','previous','${document.querySelector('input[name="query"]').value}');getResults(false,${data.hits.start - numResults});"><<</a>`
    }
    return `<li class="result-counter"><span style="margin: 0 20px 0 0;">${lessLink}</span>  Showing ${startPoint} - ${endPoint} of ${data.hits.found} ${hitDescription}  <span style="margin: 0 0 0 20px;">${moreLink}</span></li>
  </ul>`
  }())}`

  document.querySelector('.search-results').innerHTML = html;
  if(window.highlightItem) {
    document.querySelector(window.highlightItem).classList.add('highlit');
    if(window.reverseSort) {
      document.querySelector('.'+window.reverseSort).classList.add('reverse');
    }
  }
  
  document.querySelector('.submit-request').style.display = 'block';
  let email = getUser();
  let emailField = document.querySelector('.submit-request input[name="email"]');
  if(email) {
    emailField.value = email;
    emailField.parentNode.style.display = 'none';
  }
  document.querySelector('.submit-request button').addEventListener('click',function(event) {
    event.preventDefault();
    let url = 'https://cncx06eah4.execute-api.us-east-1.amazonaws.com/production/govpurchase';
    let email = emailField.value;

    fetch(url, {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "email": email, "description": document.querySelector('.submit-request textarea').value })
    }).then(function(response) {
      return response.text();
    }).then(function(data) {
      console.log(data);
    });
    document.querySelector('.submit-request').innerHTML = `<h3>Thank you for your request!</h3>`
    return false;

  })
}

