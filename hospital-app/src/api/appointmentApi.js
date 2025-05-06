import axios from './axios';

export const getUserAppointments = async (status = '') => {
  try {
    const response = await axios.get('/appointments', { params: { status } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAppointmentById = async (id) => {
  try {
    const response = await axios.get(`/appointments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await axios.post('/appointments', appointmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAppointment = async (id, updateData) => {
  try {
    const response = await axios.put(`/appointments/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelAppointment = async (id) => {
  try {
    const response = await axios.put(`/appointments/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDoctorAvailability = async (doctorId, date) => {
  try {
    const response = await axios.get(`/appointments/availability/${doctorId}`, {
      params: { date },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};