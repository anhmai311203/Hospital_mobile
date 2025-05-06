import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons'; // Giữ lại icons
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const ProfileScreen = ({ navigation }) => {
  const { user, updateUserProfile: contextUpdateProfile, logout: contextLogout } = useContext(AuthContext); // Lấy từ context
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    profileImage: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        profileImage: user.profileImage || null, // Giả sử context có profileImage
      });
    } else {
      // Nếu không có user trong context (chưa đăng nhập), có thể chuyển hướng
        Alert.alert(
          'Not Logged In',
          'Please log in to view your profile',
          [
            { text: 'OK', onPress: () => navigation.navigate('LoginScreen') }
          ]
      );
    }
  }, [user]); // Chạy lại khi user trong context thay đổi

  const handleSaveProfile = async () => {
    try {
      // Validate data if needed

      // Try to update
      const response = await axios.put(`/users/${userData.id}`, {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address
      });

      // Cập nhật user context nếu cần
      if (contextUpdateProfile) {
        await contextUpdateProfile(response.data);
      }
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);

      // Vẫn lưu cập nhật local để không làm mất dữ liệu người dùng đã nhập
                setIsEditing(false);
      Alert.alert(
        'Limited Functionality',
        'Your profile has been updated locally, but changes may not be saved to the server.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutModalVisible(false);
      await contextLogout(); // Gọi hàm logout từ context
      
      // Navigate to login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const pickImage = async () => {
    if (!isEditing) return;
    
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to change your profile picture');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setUserData({ ...userData, profileImage: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const renderProfileContent = () => {
    if (isEditing) {
      return (
        <View style={styles.profileForm}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
              placeholder="Enter your full name"
            />
          </View>

          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.inputLabel}>Phone</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={userData.phone}
              onChangeText={(text) => setUserData({ ...userData, phone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.inputLabel}>Address</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={userData.address}
              onChangeText={(text) => setUserData({ ...userData, address: text })}
              placeholder="Enter your address"
              multiline
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                // Reset form về trạng thái user hiện tại trong context
                setIsEditing(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.profileInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={20} color="#9E9E9E" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{userData.name || 'Not set'}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="mail-outline" size={20} color="#9E9E9E" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{userData.email || 'No email set'}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={20} color="#9E9E9E" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{userData.phone || 'Not set'}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={20} color="#9E9E9E" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{userData.address || 'Not set'}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A73E8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
            {userData.profileImage ? (
              <Image
                source={{ uri: userData.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <FontAwesome name="user" size={40} color="#FFFFFF" />
              </View>
            )}
            {isEditing && (
              <View style={styles.cameraIconContainer}>
                <Feather name="camera" size={16} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.profileName}>{userData.name || 'User'}</Text>
          <Text style={styles.profileEmail}>{userData.email || 'No email set'}</Text>
        </View>

        {renderProfileContent()}

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="notifications-outline" size={22} color="#1A73E8" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingText}>Notifications</Text>
              <Text style={styles.settingDescription}>Get notified about appointments</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E0E0E0', true: '#BED8FF' }}
              thumbColor={notificationsEnabled ? '#1A73E8' : '#F4F3F4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="moon-outline" size={22} color="#1A73E8" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingText}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Enable dark theme</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#E0E0E0', true: '#BED8FF' }}
              thumbColor={darkModeEnabled ? '#1A73E8' : '#F4F3F4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="finger-print-outline" size={22} color="#1A73E8" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingText}>Biometric Authentication</Text>
              <Text style={styles.settingDescription}>Login using fingerprint or face ID</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#E0E0E0', true: '#BED8FF' }}
              thumbColor={biometricEnabled ? '#1A73E8' : '#F4F3F4'}
            />
          </View>
        </View>

        <View style={styles.linkSection}>
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => navigation.navigate('Appointments')}
          >
            <Ionicons name="calendar-outline" size={22} color="#1A73E8" />
            <Text style={styles.linkText}>My Appointments</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#9E9E9E" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => navigation.navigate('Feedback')}
          >
            <MaterialIcons name="feedback" size={22} color="#1A73E8" />
            <Text style={styles.linkText}>Give Feedback</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#9E9E9E" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="help-circle-outline" size={22} color="#1A73E8" />
            <Text style={styles.linkText}>Help & Support</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#9E9E9E" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="information-circle-outline" size={22} color="#1A73E8" />
            <Text style={styles.linkText}>About</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#9E9E9E" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => setLogoutModalVisible(true)}
        >
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="log-out" size={40} color="#FF3B30" />
            </View>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalText}>
              Are you sure you want to logout from your account?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
                style={[styles.modalButton, styles.logoutModalButton]}
                onPress={handleLogout}
              >
                <Text style={styles.logoutModalButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
        </View>
      </Modal>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <Ionicons name="home-outline" size={24} color="#9E9E9E" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Appointments')}
        >
          <Ionicons name="calendar-outline" size={24} color="#9E9E9E" />
          <Text style={styles.navText}>Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Feedback')}
        >
          <MaterialIcons name="feedback" size={24} color="#9E9E9E" />
          <Text style={styles.navText}>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="user" size={24} color="#1A73E8" />
          <Text style={[styles.navText, styles.activeNavText]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profileImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#BDBDBD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1A73E8',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  profileInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  infoValue: {
    fontSize: 16,
    color: '#1A1A1A',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: '#1A73E8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  profileForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  input: {
    height: 48,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#1A73E8',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#4A4A4A',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  settingDescription: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 2,
  },
  linkSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  linkText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  // Styles cho logout button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Styles cho modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelModalButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  logoutModalButton: {
    backgroundColor: '#FF3B30',
    marginLeft: 8,
  },
  cancelModalButtonText: {
    color: '#4A4A4A',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Style cho footer
  footer: {
    alignItems: 'center',
    marginBottom: 80, // Để không bị che bởi bottom navigation
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  // Styles cho bottom navigation
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
  },
  activeNavText: {
    color: '#1A73E8',
    fontWeight: '600',
  },
});

export default ProfileScreen;