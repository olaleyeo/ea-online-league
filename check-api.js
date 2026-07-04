const https = require('https');

const options = {
  hostname: 'ea-online-league.onrender.com',
  port: 443,
  path: '/api/tournaments',
  method: 'GET'
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', body.substring(0, 1000)));
});

req.on('error', error => console.error(error));
req.end();
