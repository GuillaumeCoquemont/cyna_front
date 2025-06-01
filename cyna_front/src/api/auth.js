const BASE_URL = `${process.env.REACT_APP_API_URL}/api/auth`;

export async function login({ email, password }) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  console.log('Réponse login backend:', response.status, data);
  if (!response.ok) {
    throw new Error(data.message || 'Échec de la connexion');
  }
  return data;
}

export async function register({ name, email, password }) {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) throw new Error("Échec de l'inscription");
  return res.json();
}