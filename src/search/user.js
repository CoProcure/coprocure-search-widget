import { checkParents } from './check-parents.js';

export function getUser() {
  let user = localStorage.getItem('coProcureUser');
  if(!user) {
    return '';
  }
  return user;
}

export function getLocalActivity() {
  let activity = localStorage.getItem('coProcureActivity');
  if(!activity) {
    return false;
  }
  return activity;
}

export function setUser(id) {
  localStorage.setItem('coProcureUser',id);
}

export function setLocalActivity(data) {
  localStorage.setItem('coProcureActivity',data);
}

export function postActivity(email, category, action ,label) {
  let userAgent = navigator.userAgent;
  let screenSize = `${window.innerWidth} ${window.innerHeight}`;
  let postBody = { email, category, action, label, userAgent, screenSize }
  // post to dynamodb
  let url = 'https://cncx06eah4.execute-api.us-east-1.amazonaws.com/production/activity';
  fetch(url, {
    method: 'post',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postBody)
  }).then(function(response) {
    return response.text();
  }).then(function(data) {
    console.log(data);
  });
}