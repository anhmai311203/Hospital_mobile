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
import { isValidEmail } from '../../utils/helpers'; // Chỉ giữ lại isValidEmail nếu cần
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useContext(AuthContext); // Lấy hàm login từ context

  const validate = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (loading) return;
    if (!validate()) return;
    
    setLoading(true);
    try {
      const result = await login(email, password); // Gọi hàm login từ context
      if (!result.success) {
        // Nếu login không thành công (do context trả về), hiển thị lỗi
        throw new Error(result.message || 'Invalid email or password.');
      }
      // Không cần navigation.replace('Main') ở đây
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error.message || 'An unexpected error occurred. Please try again.'
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to your account</Text>
        </View>

        <View style={styles.formContainer}>
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
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors({ ...errors, email: null });
                  }
                }}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.grey} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={Colors.grey}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors({ ...errors, password: null });
                  }
                }}
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

          <TouchableOpacity 
            style={styles.forgotPasswordButton}
            onPress={() => Alert.alert('Reset Password', 'Password reset functionality would be implemented here.')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require('../../../assets/images/google.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require('../../../assets/images/facebook.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupButtonText}>Sign Up</Text>
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
    paddingTop: dimensions.padding.xl * 2,
    paddingBottom: dimensions.padding.xl,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: dimensions.padding.xl,
  },
  logo: {
    width: 80,
    height: 80,
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
    marginBottom: dimensions.padding.large,
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: dimensions.padding.large,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: dimensions.fontSize.medium,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: dimensions.radius.medium,
    paddingVertical: dimensions.padding.medium,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: dimensions.fontSize.large,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: dimensions.padding.large,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.lightGrey,
  },
  orText: {
    color: Colors.grey,
    marginHorizontal: dimensions.padding.medium,
    fontSize: dimensions.fontSize.medium,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: dimensions.padding.large,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: dimensions.radius.medium,
    paddingVertical: dimensions.padding.medium,
    width: '48%',
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: dimensions.padding.small,
  },
  socialButtonText: {
    color: Colors.dark,
    fontSize: dimensions.fontSize.medium,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: dimensions.padding.large,
  },
  signupText: {
    color: Colors.grey,
    fontSize: dimensions.fontSize.medium,
  },
  signupButtonText: {
    color: Colors.primary,
    fontSize: dimensions.fontSize.medium,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default LoginScreen;