// Thay thế import
// import axios from 'axios';
import axiosInstance from '../api/axios';

// ... code khác không thay đổi ...

const fetchDoctorDetails = async () => {
  if (!doctor_id) {
    setError("Missing doctor ID");
    setLoading(false);
    return;
  }
  
  try {
    setLoading(true);
    
    // Log URL đầy đủ để debug
    console.log(`Fetching doctor details from: /doctors/${doctor_id}`);
    
    // Sử dụng axiosInstance thay vì axios
    const response = await axiosInstance.get(`/doctors/${doctor_id}`);
    
    console.log('API Response:', response.data);
    
    if (response.data && response.data.doctor) {
      setDoctor(response.data.doctor);
    } else {
      setError('API response format is invalid');
    }
  } catch (error) {
    console.error('Error fetching doctor:', error);
    // Hiển thị lỗi cụ thể hơn
    setError(`Không thể kết nối đến server. ${error.message}`);
    Alert.alert(
      'Connection Error', 
      'Could not connect to the server. Please check your internet connection and try again later.'
    );
  } finally {
    setLoading(false);
  }
};