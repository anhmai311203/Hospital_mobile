import axios from './axios';

export const processPayment = async (paymentData) => {
  try {
    const response = await axios.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserPayments = async () => {
  try {
    const response = await axios.get('/payments');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaymentById = async (id) => {
  try {
    const response = await axios.get(`/payments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};