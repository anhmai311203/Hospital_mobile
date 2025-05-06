import axios from './axios';

export const getUserProfile = async () => {
  try {
    const response = await axios.get('/users/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await axios.post('/users/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
