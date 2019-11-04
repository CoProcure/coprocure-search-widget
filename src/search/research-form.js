export function researchform() {
  let postUrl = 'https://93flntoz36.execute-api.us-east-1.amazonaws.com/production/contact/';
// stage: postUrl = 'https://6ab48q8ys2.execute-api.us-east-1.amazonaws.com/staging/contact/'

  document.querySelector('.contact-us button').addEventListener('click', function(event) {
    event.preventDefault()
    
    let opts = {
      name: document.querySelector('.contact-us input[name="fullname"]').value,
      email: document.querySelector('.contact-us input[name="email"]').value,
      description: 'Research request: ' + document.querySelector('.contact-us textarea[name="description"]').value
    }

    let fetchOpts = {
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