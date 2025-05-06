import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '../utils/colors';
import dimensions from '../utils/dimensions'; 


const Button = ({ 
  title, 
  onPress, 
  type = 'primary', 
  size = 'normal',
  disabled = false,
  loading = false,
  icon = null,
  style = {},
  textStyle = {}
}) => {
  const getButtonStyle = () => {
    let buttonStyle = [styles.button];
    
    if (type === 'primary') {
      buttonStyle.push(styles.primaryButton);
    } else if (type === 'secondary') {
      buttonStyle.push(styles.secondaryButton);
    } else if (type === 'outline') {
      buttonStyle.push(styles.outlineButton);
    } else if (type === 'transparent') {
      buttonStyle.push(styles.transparentButton);
    }
    
    if (size === 'small') {
      buttonStyle.push(styles.smallButton);
    } else if (size === 'large') {
      buttonStyle.push(styles.largeButton);
    }
    
    if (disabled) {
      buttonStyle.push(styles.disabledButton);
    }
    
    return [...buttonStyle, style];
  };
  
  const getTextStyle = () => {
    let textStyleArr = [styles.buttonText];
    
    if (type === 'primary') {
      textStyleArr.push(styles.primaryButtonText);
    } else if (type === 'secondary') {
      textStyleArr.push(styles.secondaryButtonText);
    } else if (type === 'outline') {
      textStyleArr.push(styles.outlineButtonText);
    } else if (type === 'transparent') {
      textStyleArr.push(styles.transparentButtonText);
    }
    
    if (size === 'small') {
      textStyleArr.push(styles.smallButtonText);
    } else if (size === 'large') {
      textStyleArr.push(styles.largeButtonText);
    }
    
    if (disabled) {
      textStyleArr.push(styles.disabledButtonText);
    }
    
    return [...textStyleArr, textStyle];
  };
  
  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={type === 'primary' ? Colors.white : Colors.primary} />
      ) : (
        <>
          {icon && icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: dimensions.buttonHeight, // ✅ dùng đúng tên
    borderRadius: dimensions.radius,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: dimensions.padding * 1.5,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  transparentButton: {
    backgroundColor: 'transparent',
  },
  smallButton: {
    height: dimensions.buttonHeight * 0.75,
    paddingHorizontal: dimensions.padding,
  },
  largeButton: {
    height: dimensions.buttonHeight * 1.25,
    paddingHorizontal: dimensions.padding * 2,
  },
  disabledButton: {
    backgroundColor: Colors.gray,
    borderColor: Colors.gray,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  primaryButtonText: {
    color: Colors.white,
  },
  secondaryButtonText: {
    color: Colors.white,
  },
  outlineButtonText: {
    color: Colors.primary,
  },
  transparentButtonText: {
    color: Colors.primary,
  },
  smallButtonText: {
    fontSize: 14,
  },
  largeButtonText: {
    fontSize: 18,
  },
  disabledButtonText: {
    color: Colors.darkGray,
  },
});

export default Button;
