const EMAILJS_SERVICE_ID = 'service_js7tgz8';
const EMAILJS_TEMPLATE_ID = 'guf1axx';
const EMAILJS_USER_ID = 'lnfsoU0tZZVZk15EY';      // Public Key
const EMAILJS_PRIVATE_KEY = 'U6F85h13cCGXN3D6L6Egn'; // Private Key

async function run() {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_USER_ID,
      accessToken: EMAILJS_PRIVATE_KEY,
      template_params: {
        to_email: 'youthclimatenetworkbd@gmail.com',
        user_email: 'youthclimatenetworkbd@gmail.com',
        email: 'youthclimatenetworkbd@gmail.com',
        name: 'Climate Advocate',
        reply_to: 'youthclimatenetworkbd@gmail.com'
      }
    })
  });
  console.log('Status with guf1axx:', res.status);
  const text = await res.text();
  console.log('Response:', text);
}
run();
