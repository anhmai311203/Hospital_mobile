import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../utils/colors'; // Thay đổi cách import

const { width: screenWidth } = Dimensions.get('window'); // Lấy width trực tiếp

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Simuler un temps de chargement
    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white, // Thay đổi cách sử dụng
  },
  logo: {
    width: screenWidth * 0.7, // Sử dụng width lấy trực tiếp
    height: screenWidth * 0.7, // Sử dụng width lấy trực tiếp
  },
});

export default SplashScreen;