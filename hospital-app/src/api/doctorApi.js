import axios from './axios';

export const getAllDoctors = async (filters = {}) => {
  try {
    const response = await axios.get('/doctors', { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDoctorById = async (id) => {
  try {
    const response = await axios.get(`/doctors/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchDoctors = async (query) => {
  try {
    const response = await axios.get('/doctors/search', { params: { query } });
    return response.data;
  } catch (error) {
    throw error;
  }
};
