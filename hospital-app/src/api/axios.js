import axios from 'axios';
import { Platform } from 'react-native';

// Cấu hình baseURL dựa trên platform
const baseURL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'  // Android emulator
  : Platform.OS === 'ios'
    ? 'http://localhost:3000'  // iOS simulator
    : 'http://192.168.2.80:3000'; // Thay bằng IP thực của bạn
const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để log request & response
instance.interceptors.request.use(
  config => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config.data || {});
    return config;
  },
  error => {
    console.log('[API Request Error]', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  error => {
    console.log('[API Response Error]', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default instance;