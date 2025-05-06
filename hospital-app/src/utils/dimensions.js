import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const dimensions = {
  width: width,
  height: height,
  padding: {
    small: 8,
    medium: 16,
    large: 24,
    xl: 32,
  },
  margin: {
    small: 8,
    medium: 16,
    large: 24,
    xl: 32,
  },
  radius: {
    small: 4,
    medium: 8,
    large: 12,
  },
  headerHeight: 60,
  bottomTabHeight: 60,
  buttonHeight: 50,
  inputHeight: 50,
  smallIcon: 16,
  mediumIcon: 24,
  largeIcon: 32, // <-- Thêm dấu phẩy ở đây
  fontSize: { // <-- Thêm đối tượng fontSize
    small: 12,
    medium: 14,
    large: 16,
    xl: 18,
    xxl: 24, // <-- Thêm xxl và các size khác
  },
};

export default dimensions;