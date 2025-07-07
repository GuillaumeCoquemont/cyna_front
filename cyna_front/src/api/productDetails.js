import { API_BASE_URL } from './config';
const BASE_URL = `${API_BASE_URL}/orders`;

export const fetchProductById = async (id) => {
  try {
    console.log('fetchProductById URL:', `${BASE_URL}/details/product/${id}`);
    const response = await fetch(`${BASE_URL}/details/product/${id}`);
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
    console.log('fetchServiceById URL:', `${BASE_URL}/details/service/${id}`);
    const response = await fetch(`${BASE_URL}/details/service/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};