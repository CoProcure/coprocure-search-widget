import { getUser, getLocalActivity, setLocalActivity, postActivity } from './user.js';

export function trackEvent(category, action, label) {
  if(typeof(ga)!=='undefined') {
    ga('gtag_UA_121612479_1.send', {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label
    });
    if(category == 'search' && action == 'query') {
      gtag('config', 'UA-121612479-1', {
        'page_title' : 'Search Results',
        'page_path': '/contracts.html'
      });
    }
    if(category == 'view' && action == 'contract') {
      gtag('config', 'UA-121612479-1', {
        'page_title' : 'Contract Detail Page',
        'page_path': '/contract.html'
      });
    }
    if(category == 'convert') {
      gtag('config', 'UA-121612479-1', {
        'page_title' : 'Successful Session',
        'page_path': '/foundSomething'
      });
      gtag('config', 'UA-121612479-1', {
        'custom_map': {'dimension2': 'successfulSession'}
      });
      gtag('event', 'successfulSession_dimension', {'successfulSession': 'convert'});
    }
  }
  if(getUser()) {
    // post to dynamodb
    postActivity(getUser(), category, action, label);
  } else {
    // put it in localStorage stringified
    let item = {};
    item.category = category;
    item.action = action;
    item.label = label;
    let data = [];
    if(getLocalActivity()) {
      data = JSON.parse(getLocalActivity());
    }
    data.push(item)
    setLocalActivity(JSON.stringify(data));
  }
}