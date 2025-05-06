import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from '../api/axios';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null); // Đổi tên state
  const [isLoading, setIsLoading] = useState(true); // Đổi tên state
  const [isFirstLaunch, setIsFirstLaunch] = useState(null); // Thêm state isFirstLaunch

  // Hàm lưu token và user vào SecureStore và Axios
  const storeAuthData = async (token, user) => {
    await SecureStore.setItemAsync('userToken', token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
    });
    await SecureStore.setItemAsync('userData', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUserToken(token); // Sửa thành setUserToken
    setUser(user); // Giữ lại setUser nếu bạn vẫn cần state user riêng
  };

  // Load dữ liệu từ SecureStore khi app khởi động
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        const storedUserJson = await SecureStore.getItemAsync('userData');
        const alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched');

        if (alreadyLaunched === null) {
          await AsyncStorage.setItem('alreadyLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }

        if (storedToken && storedUserJson) {
          const storedUser = JSON.parse(storedUserJson);
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setUserToken(storedToken); // Cập nhật state userToken
          setUser(storedUser); // Cập nhật state user
        } else {
          // Đảm bảo isFirstLaunch không phải null nếu không có token
          if (isFirstLaunch === null) setIsFirstLaunch(false);
        }
      } catch (error) {
        console.log('Lỗi khi load dữ liệu đăng nhập:', error);
        if (isFirstLaunch === null) setIsFirstLaunch(false); // Xử lý lỗi
      } finally {
        setIsLoading(false); // Luôn đặt isLoading thành false sau khi thử load xong
      }
    };

    loadStoredData();
  }, []);

  // Interceptor để xử lý token hết hạn
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          await logout(); // Token không hợp lệ => logout
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Đăng nhập
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/users/login', { email, password }); // Sửa lại thành /users/login
      const { token: receivedToken, user: receivedUser } = response.data;

      await storeAuthData(receivedToken, receivedUser); // Gọi hàm lưu trữ đã sửa
      setUserToken(receivedToken); // Cập nhật state trực tiếp
      setUser(receivedUser);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi đăng nhập';
      console.error('[AuthContext] Login API Error:', error.response || error); // Thêm log chi tiết lỗi API
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng ký
  const register = async (userData) => {
    try {
      setIsLoading(true); // Sửa thành setIsLoading
      const response = await axios.post('/users/register', userData);
      const { token, user } = response.data;

      await storeAuthData(token, user); // Gọi hàm lưu trữ đã sửa
      setUserToken(token); // Cập nhật state trực tiếp
      setUser(user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi đăng ký';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng xuất
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      delete axios.defaults.headers.common['Authorization'];
      setUserToken(null); // Cập nhật state userToken
      setUser(null);
    } catch (error) {
      console.log('Lỗi khi đăng xuất:', error);
    }
  };

  // Cập nhật hồ sơ người dùng
  const updateUserProfile = async (updatedData) => {
    try {
      setIsLoading(true);
      const response = await axios.put(`/users/${user.id}`, updatedData);
      const updatedUser = response.data;

      await SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi cập nhật hồ sơ';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Hiển thị loading khi chưa load xong dữ liệu
  if (isLoading) { // Sử dụng isLoading
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userToken, // Cung cấp userToken
        isLoading, // Cung cấp isLoading
        isFirstLaunch, // Cung cấp isFirstLaunch
        login,
        register,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

