import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  export const formatTime = (time) => {
    if (!time) return '';
    
    const parts = time.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    
    return `${formattedHours}:${minutes} ${period}`;
  };
  
  export const getStatusColor = (status) => {
    const statusColors = {
      pending: '#F2C94C',
      confirmed: '#29D697',
      completed: '#5B8EF4',
      cancelled: '#FF4D4F'
    };
    
    return statusColors[status.toLowerCase()] || '#CCCCCC';
  };

// --- Thêm các hàm xác thực và API ---

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  // Basic phone validation (e.g., 10 digits) - adjust as needed
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

export const register = async (userData) => {
  try {
    console.log('[helpers.register] Sending POST request to /register with data:', userData);
    // Thay thế bằng endpoint API đăng ký thực tế của bạn
    const response = await axios.post('http://10.0.2.2:3000/users/register', userData); // <-- Thay đổi IP cho máy ảo Android
    console.log('[helpers.register] Received response:', response.status, response.data);

    // Giả sử API trả về token và thông tin user khi thành công
    if (response.data && response.data.token && response.data.user) {
      console.log('[helpers.register] Response contains token and user. Saving to AsyncStorage...');
      // Lưu token và thông tin user vào AsyncStorage
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userId', response.data.user.id.toString());
      await AsyncStorage.setItem('userName', response.data.user.name);
      await AsyncStorage.setItem('userEmail', response.data.user.email);
      console.log('[helpers.register] AsyncStorage save complete. Returning user data.');
      // Lưu các thông tin khác nếu cần
      return response.data.user; // Trả về thông tin user nếu cần
    } else {
      console.warn('[helpers.register] Response format invalid. Expected token and user in response.data.');
      // Nếu API không trả về định dạng mong đợi
      throw new Error('Registration successful, but invalid response from server.');
    }
  } catch (error) {
    console.error('[helpers.register] Error during registration request or processing:', error);
    if (error.response) {
      // Lỗi từ phía server (status code không phải 2xx)
      console.error('[helpers.register] Error response data:', error.response.data);
      console.error('[helpers.register] Error response status:', error.response.status);
    } else if (error.request) {
      // Request đã được gửi nhưng không nhận được response (ví dụ: network error)
      console.error('[helpers.register] No response received:', error.request);
    } else {
      // Lỗi xảy ra khi thiết lập request
      console.error('[helpers.register] Error setting up request:', error.message);
    }
    // Xử lý lỗi từ axios hoặc API (ví dụ: email đã tồn tại)
    const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
    throw new Error(errorMessage); // Ném lỗi để màn hình RegisterScreen xử lý
  }
};

export const login = async (email, password) => {
  try {
    console.log('[helpers.login] Sending POST request to /login with data:', { email });
    // Gọi đúng endpoint với tiền tố /users
    const response = await axios.post(
      'http://10.0.2.2:3000/users/login',
      { email, password },
      { timeout: 15000 } // Thêm timeout 15 giây
    );
    console.log('[helpers.login] Received response:', response.status, response.data);

    if (response.data && response.data.token && response.data.user) {
      console.log('[helpers.login] Response contains token and user. Saving to AsyncStorage...');
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userId', response.data.user.id.toString());
      await AsyncStorage.setItem('userName', response.data.user.name);
      await AsyncStorage.setItem('userEmail', response.data.user.email);
      // Lưu các thông tin khác nếu cần
      console.log('[helpers.login] AsyncStorage save complete. Returning user data.');
      return response.data.user;
    } else {
      console.warn('[helpers.login] Response format invalid. Expected token and user in response.data.');
      throw new Error('Login successful, but invalid response from server.');
    }
  } catch (error) {
    console.error('[helpers.login] Error during login request or processing:', error);
    if (error.response) {
      console.error('[helpers.login] Error response data:', error.response.data);
      console.error('[helpers.login] Error response status:', error.response.status);
    }
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    throw new Error(errorMessage);
  }
};