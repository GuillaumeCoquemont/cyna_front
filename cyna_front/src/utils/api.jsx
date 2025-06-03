// Configuration de l'API
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3006';

// Fonction utilitaire pour les requêtes
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// API methods
const api = {
  get: (endpoint) => fetchWithAuth(endpoint),
  post: (endpoint, data) => fetchWithAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint, data) => fetchWithAuth(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (endpoint) => fetchWithAuth(endpoint, {
    method: 'DELETE',
  }),
};

// --- Mock setup in development ---
if (process.env.NODE_ENV === 'development') {
  // Mock data
  let promoCodes = [
    { id: 1, code: 'SUMMER10', discount: 10, expires: '2025-08-31' }
  ];

  // Mock login
  const originalFetch = window.fetch;
  window.fetch = async (url, options) => {
    if (url === `${BASE_URL}/users/login` && options?.method === 'POST') {
      const { email, password } = JSON.parse(options.body);
      if (email === 'admin' && password === 'Admin123!') {
        return new Response(JSON.stringify({ token: 'fake-jwt-token', role: 'admin' }));
      }
      return new Response(JSON.stringify({ message: 'Identifiants invalides' }), { status: 401 });
    }

    if (url === `${BASE_URL}/users/register` && options?.method === 'POST') {
      return new Response(JSON.stringify({ token: 'fake-jwt-token', role: 'user' }));
    }

    if (url === `${BASE_URL}/admin/promo-codes`) {
      if (options?.method === 'GET') {
        return new Response(JSON.stringify(promoCodes));
      }
      if (options?.method === 'POST') {
        const newCode = JSON.parse(options.body);
        newCode.id = promoCodes.length + 1;
        promoCodes.push(newCode);
        return new Response(JSON.stringify(newCode), { status: 201 });
      }
    }

    return originalFetch(url, options);
  };
}
// --------------------------------------------

export default api;
