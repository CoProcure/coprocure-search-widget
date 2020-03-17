import { setUser } from "./user.js";

export function researchform() {
  let postUrl = 'https://93flntoz36.execute-api.us-east-1.amazonaws.com/production/contact/';
// stage: postUrl = 'https://6ab48q8ys2.execute-api.us-east-1.amazonaws.com/staging/contact/'

  document.querySelector('.contact-us form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.querySelector('.contact-us input[name="email"]').value;
    if (email) {
      setUser(email); 
    }
    
    const opts = {
      name: document.querySelector('.contact-us input[name="fullname"]').value,
      email,
      description: 'Research request: ' + document.querySelector('.contact-us textarea[name="description"]').value
    }

    const fetchOpts = {
      method: 'POST',
      body: `fullname=${opts.name}&email=${opts.email}&description=${opts.description}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };

    fetch(postUrl, fetchOpts).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
      document.querySelector('.contact-us button').textContent = "Thanks!"
    });

  })
}