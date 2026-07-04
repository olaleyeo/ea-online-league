const https = require('https');

const data = JSON.stringify({
  name: 'Auth Test Node',
  ownerId: 'local',
  adminPin: '1234'
});

const options = {
  hostname: 'ea-online-league.onrender.com',
  port: 443,
  path: '/api/tournaments',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
