import React, { useState, useContext } from 'react'; // Thêm useContext
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../utils/colors';
import dimensions from '../../utils/dimensions'; // Giả sử đường dẫn đúng
import { isValidEmail, isValidPhone } from '../../utils/helpers'; // Chỉ giữ lại các hàm validation nếu cần
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useContext(AuthContext); // Lấy hàm register từ context

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };
      
      const result = await register(userData); // Gọi hàm register từ context
      if (!result.success) {
        // Nếu register không thành công (do context trả về), hiển thị lỗi
        throw new Error(result.message || 'Registration failed.');
      }
      // Không cần navigation.replace('Main') ở đây
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error.message || 'An error occurred during registration. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to continue</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
              <Ionicons name="person-outline" size={20} color={Colors.grey} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.grey}
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
              <Ionicons name="mail-outline" size={20} color={Colors.grey} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={Colors.grey}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
              <Ionicons name="call-outline" size={20} color={Colors.grey} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor={Colors.grey}
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text)}
              />
            </View>
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.grey} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor={Colors.grey}
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={Colors.grey}
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.grey} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={Colors.grey}
                secureTextEntry={!showConfirmPassword}
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={Colors.grey}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.registerButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: dimensions.padding.large,
    paddingTop: dimensions.padding.xl,
    paddingBottom: dimensions.padding.xl,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: dimensions.padding.large,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: dimensions.padding.medium,
  },
  title: {
    fontSize: dimensions.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: dimensions.padding.small,
  },
  subtitle: {
    fontSize: dimensions.fontSize.large,
    color: Colors.grey,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: dimensions.padding.medium,
  },
  inputLabel: {
    fontSize: dimensions.fontSize.medium,
    color: Colors.dark,
    marginBottom: dimensions.padding.small,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: dimensions.radius.medium,
    paddingHorizontal: dimensions.padding.medium,
    height: 50,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  inputIcon: {
    marginRight: dimensions.padding.small,
  },
  input: {
    flex: 1,
    color: Colors.dark,
    fontSize: dimensions.fontSize.medium,
  },
  errorText: {
    color: Colors.danger,
    fontSize: dimensions.fontSize.small,
    marginTop: 5,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: dimensions.radius.medium,
    paddingVertical: dimensions.padding.medium,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: dimensions.padding.medium,
  },
  registerButtonText: {
    color: Colors.white,
    fontSize: dimensions.fontSize.large,
    fontWeight: 'bold',
  },
  termsContainer: {
    marginTop: dimensions.padding.large,
    alignItems: 'center',
  },
  termsText: {
    color: Colors.grey,
    fontSize: dimensions.fontSize.small,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: dimensions.padding.large,
  },
  loginText: {
    color: Colors.grey,
    fontSize: dimensions.fontSize.medium,
  },
  loginButtonText: {
    color: Colors.primary,
    fontSize: dimensions.fontSize.medium,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default RegisterScreen;