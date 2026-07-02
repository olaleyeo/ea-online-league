import axios from 'axios';

// React Native doesn't have process.env out of the box in the same way,
// but for standard setups or expo we can use process.env.EXPO_PUBLIC_API_URL
const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3001/api';

export const api = axios.create({
  baseURL,
});

export const getTournaments = async () => {
  const { data } = await api.get('/tournaments');
  return data;
};

// ... other API methods will be mirrored from the web frontend
