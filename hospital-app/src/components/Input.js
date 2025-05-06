import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../utils/colors';
import dimensions from '../utils/dimensions';
import ICONS from '../constants/icons';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  style = {},
  containerStyle = {},
  onBlur,
  onFocus,
  multiline = false,
  numberOfLines = 1,
  icon = null,
  iconPosition = 'left',
  editable = true,
  rightComponent = null,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const getInputContainerStyle = () => {
    return [
      styles.inputContainer,
      isFocused && styles.inputContainerFocused,
      error && styles.inputContainerError,
      !editable && styles.inputContainerDisabled,
    ];
  };

  const renderPasswordToggle = () => {
    if (secureTextEntry) {
      return (
        <TouchableOpacity
          style={styles.passwordToggle}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon
            name={showPassword ? ICONS.eye : ICONS.eyeOff}
            size={dimensions.mediumIcon}
            color={Colors.darkGray}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderIcon = () => {
    if (icon) {
      return (
        <View style={[styles.icon, iconPosition === 'right' && styles.iconRight]}>
          {icon}
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={getInputContainerStyle()}>
        {iconPosition === 'left' && renderIcon()}
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            iconPosition === 'left' && icon && styles.inputWithLeftIcon,
            iconPosition === 'right' && icon && styles.inputWithRightIcon,
            secureTextEntry && styles.inputWithPasswordToggle,
            style,
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.darkGray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={editable}
        />
        {iconPosition === 'right' && renderIcon()}
        {renderPasswordToggle()}
        {rightComponent && <View style={styles.rightComponent}>{rightComponent}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: dimensions.margin,
    width: '100%',
  },
  label: {
    color: Colors.text,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    height: dimensions.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: dimensions.radius,
    backgroundColor: Colors.white,
    paddingHorizontal: dimensions.padding,
  },
  inputContainerFocused: {
    borderColor: Colors.primary,
  },
  inputContainerError: {
    borderColor: Colors.danger,
  },
  inputContainerDisabled: {
    backgroundColor: Colors.lightGray,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    height: '100%',
  },
  multilineInput: {
    height: dimensions.inputHeight * 2,
    textAlignVertical: 'top',
    paddingTop: dimensions.padding,
  },
  icon: {
    marginRight: dimensions.margin / 2,
  },
  iconRight: {
    marginRight: 0,
    marginLeft: dimensions.margin / 2,
  },
  inputWithLeftIcon: {
    paddingLeft: dimensions.padding / 2,
  },
  inputWithRightIcon: {
    paddingRight: dimensions.padding / 2,
  },
  inputWithPasswordToggle: {
    paddingRight: dimensions.padding * 2,
  },
  passwordToggle: {
    position: 'absolute',
    right: dimensions.padding,
  },
  rightComponent: {
    marginLeft: dimensions.margin / 2,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;