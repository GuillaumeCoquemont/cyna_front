const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3007';

export async function login({ email, password }) {
  try {
    console.log('Tentative de connexion à:', `${BASE_URL}/api/auth/login`);
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Statut de la réponse:', response.status);
    const data = await response.json();
    console.log('Données de réponse complètes:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Échec de la connexion');
    }

    // Stocker le token dans le localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw new Error(error.message || 'Erreur de connexion au serveur');
  }
}

export async function register({ name, email, password }) {
  try {
    console.log('Tentative d\'inscription à:', `${BASE_URL}/api/auth/signup`);
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    console.log('Statut de la réponse:', response.status);
    const data = await response.json();
    console.log('Données de réponse complètes:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data.error || data.message || "Échec de l'inscription");
    }

    // Stocker le token dans le localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    throw new Error(error.message || 'Erreur de connexion au serveur');
  }
}