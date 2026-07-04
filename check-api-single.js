const https = require('https');

const options = {
  hostname: 'ea-online-league.onrender.com',
  port: 443,
  path: '/api/tournaments/f2736398-4595-4a0f-9a36-df7770df206e',
  method: 'GET'
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const data = JSON.parse(body);
    console.log('Tournament ID:', data.id);
    console.log('isLocked:', data.isLocked);
    console.log('adminPin:', data.adminPin);
  });
});

req.on('error', error => console.error(error));
req.end();
