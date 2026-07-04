const axios = require('axios');

const api = axios.create({
  baseURL: 'https://ea-online-league.onrender.com/api',
});

api.interceptors.request.use((config) => {
  console.log('Interceptor config headers before:', config.headers);
  return config;
});

async function test() {
  try {
    const res = await api.post('/tournaments/a6298c86-8ede-43f2-abd1-573bdcdd19d6/players', 
      { players: [{name: 'p2', pot: 2}] }, 
      { headers: { 'X-Admin-Pin': '1234' } }
    );
    console.log(res.status, res.data);
  } catch (e) {
    console.error('Error:', e.response ? e.response.status : e.message, e.response ? e.response.data : '');
  }
}
test();
