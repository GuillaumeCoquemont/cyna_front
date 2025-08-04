import { API_BASE_URL } from './config';
const BASE_URL = `${API_BASE_URL}/services`;
const SERVICE_TYPES_URL = `${API_BASE_URL}/service-types`;

// GET all services
export async function fetchServices() {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    return res.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    return [];
  }
}

// POST add a new service
export async function addService(data, isMultipart = false) {
  const token = localStorage.getItem('token');
  let options = {
    method: 'POST',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: data
  };
  if (!isMultipart) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }
  const res = await fetch(BASE_URL, options);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

// PUT update a service by key
export async function updateService(keyOrData, dataOrIsMultipart, maybeIsMultipart) {
  let id, data, isMultipart;
  if (keyOrData instanceof FormData) {
    id = keyOrData.get('id');
    data = keyOrData;
    isMultipart = dataOrIsMultipart || false;
  } else {
    id = keyOrData;
    data = dataOrIsMultipart;
    isMultipart = maybeIsMultipart || false;
  }
  const token = localStorage.getItem('token');
  let options = {
    method: 'PUT',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: data
  };
  if (!isMultipart) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, options);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

// DELETE a service by key
export async function deleteService(key) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(key)}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}

// GET all service types
export async function fetchServiceTypes() {
  const res = await fetch(SERVICE_TYPES_URL);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function checkServiceDependencies(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/${id}/dependencies`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}