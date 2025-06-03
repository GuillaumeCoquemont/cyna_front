const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3007/api';

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/details/product/${id}`);
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
    const response = await fetch(`${API_URL}/details/service/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}; 