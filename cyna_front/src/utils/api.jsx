import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3006',
  headers: { 'Content-Type': 'application/json' }
});

// Auto-attach JWT token if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Mock adapter setup in development ---
if (process.env.NODE_ENV === 'development') {
  const MockAdapter = require('axios-mock-adapter');
  const mock = new MockAdapter(api, { delayResponse: 300 });

  // Mock login endpoint
  mock.onPost('/users/login').reply(({ data }) => {
    const { email, password } = JSON.parse(data);
    if (email === 'admin' && password === 'Admin123!') {
      return [200, { token: 'fake-jwt-token', role: 'admin' }];
    }
    return [401, { message: 'Identifiants invalides' }];
  });

  // Mock registration endpoint
  mock.onPost('/users/register').reply(200, { token: 'fake-jwt-token', role: 'user' });

  // Mock fetching promo codes
  let promoCodes = [
    { id: 1, code: 'SUMMER10', discount: 10, expires: '2025-08-31' }
  ];
  mock.onGet('/admin/promo-codes').reply(200, promoCodes);

  // Mock creating a promo code
  mock.onPost('/admin/promo-codes').reply(({ data }) => {
    const newCode = JSON.parse(data);
    newCode.id = promoCodes.length + 1;
    promoCodes.push(newCode);
    return [201, newCode];
  });
}
// --------------------------------------------

export default api;
