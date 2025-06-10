const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3007';

export const fetchProductById = async (id) => {
  try {
    console.log('fetchProductById URL:', `${API_URL}/api/details/product/${id}`);
    const response = await fetch(`${API_URL}/api/details/product/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchServiceById = async (id) => {
  try {
    console.log('fetchServiceById URL:', `${API_URL}/api/details/service/${id}`);
    const response = await fetch(`${API_URL}/api/details/service/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};