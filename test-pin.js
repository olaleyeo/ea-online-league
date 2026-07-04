const https = require('https');

async function doRequest(path, method, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(data);
    const options = {
      hostname: 'ea-online-league.onrender.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': dataStr.length,
        ...headers
      }
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', d => { body += d; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(dataStr);
    req.end();
  });
}

async function test() {
  console.log('1. Creating tournament with PIN 1234...');
  const res1 = await doRequest('/api/tournaments', 'POST', { name: 'Test Auth PIN', ownerId: 'local', adminPin: '1234' });
  console.log(res1.status, res1.body);
  
  if (res1.status !== 200) return;
  const t = JSON.parse(res1.body);
  
  console.log('\n2. Adding players WITHOUT PIN (Should fail)...');
  const res2 = await doRequest(`/api/tournaments/${t.id}/players`, 'POST', { players: [{name: 'p1', pot: 1}] });
  console.log(res2.status, res2.body);

  console.log('\n3. Adding players WITH PIN (Should succeed)...');
  const res3 = await doRequest(`/api/tournaments/${t.id}/players`, 'POST', { players: [{name: 'p1', pot: 1}] }, { 'X-Admin-Pin': '1234' });
  console.log(res3.status, res3.body);
}

test();
