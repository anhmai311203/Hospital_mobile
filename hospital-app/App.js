import React, { useState, useEffect, useContext } from 'react'; // Thêm useContext
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, AuthContext } from './src/context/AuthContext'; // Import AuthProvider và AuthContext
import { StatusBar } from 'expo-status-bar';


// Auth Screens
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/auth/OnboardingScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
// import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen'; // Chưa có


// Main Screens
import HomeScreen from './src/screens/main/HomeScreen';
import DoctorsScreen from './src/screens/main/DoctorsScreen';
import DoctorDetailsScreen from './src/screens/main/DoctorDetailScreen'; // Corrected filename
import AppointmentsScreen from './src/screens/main/AppointmentsScreen'; // Corrected filename (plural)
import BookAppointmentScreen from './src/screens/main/BookAppointmentScreen'; // Corrected filename
import PaymentScreen from './src/screens/main/PaymentScreen'; // Assuming path
// import PaymentSuccessScreen from './src/screens/main/PaymentSuccessScreen'; // Chưa có
// import NotificationsScreen from './src/screens/main/NotificationsScreen'; // Chưa có
// import AppointmentDetailsScreen from './src/screens/main/AppointmentDetailsScreen'; // Chưa có
import ProfileScreen from './src/screens/main/ProfileScreen';

import FeedbackScreen from './src/screens/main/FeedbackScreen'; // Import FeedbackScreen


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- Auth Stack ---
const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ headerTitle: 'Create Account' }}
    />
    {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerTitle: 'Forgot Password' }} /> */}
  </Stack.Navigator>
);

// --- Main Tab Navigator ---
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Doctors') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2B65EC',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Doctors" component={DoctorsScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// --- Main Stack (Includes Tabs and other screens) ---
const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="DoctorDetails" component={DoctorDetailsScreen} options={{ headerTitle: 'Doctor Details' }} />
    <Stack.Screen name="Booking" component={BookAppointmentScreen} options={{ headerTitle: 'Book Appointment' }} />
    <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerTitle: 'Payment' }} />
    <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ headerTitle: 'Feedback' }} />
  </Stack.Navigator>
);

// Component mới để xử lý logic điều hướng dựa trên AuthContext
const AppNavigator = () => {
  const { isLoading, userToken, isFirstLaunch } = useContext(AuthContext); // Lấy state từ context

  if (isLoading) {
    return <SplashScreen />; // Hiển thị Splash khi đang tải
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isFirstLaunch ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : userToken ? (
        // Nếu đã đăng nhập, hiển thị Main Stack
        <Stack.Screen name="Main" component={MainStack} />
      ) : (
        // Nếu chưa đăng nhập (và không phải lần đầu), hiển thị Auth Stack
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  // Không cần quản lý state isLoading, userToken, isFirstLaunch ở đây nữa
  // AuthProvider sẽ quản lý chúng

  return (
    // Bao bọc toàn bộ ứng dụng bằng AuthProvider
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        {/* Sử dụng AppNavigator để quyết định hiển thị stack nào */}
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}