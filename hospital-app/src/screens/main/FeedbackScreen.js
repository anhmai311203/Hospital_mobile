// Trong FeedbackScreen.js - Cập nhật lại toàn bộ component

import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext';

const FeedbackScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localFeedbacks, setLocalFeedbacks] = useState([]);
  
  // Load stored feedbacks
  useEffect(() => {
    const loadStoredFeedbacks = async () => {
      try {
        const storedFeedbacks = await AsyncStorage.getItem('userFeedbacks');
        if (storedFeedbacks) {
          setLocalFeedbacks(JSON.parse(storedFeedbacks));
        }
      } catch (error) {
        console.error('Error loading stored feedbacks:', error);
      }
    };
    
    loadStoredFeedbacks();
  }, []);

  const saveFeedbackLocally = async () => {
    try {
      setIsSubmitting(true);
      
      // Tạo feedback object mới
      const newFeedback = {
        id: Date.now(),
        content: feedback,
        rating: rating,
        timestamp: new Date().toISOString(),
        userName: user?.name || 'Anonymous',
        userId: user?.id || 'guest'
      };
      
      // Thêm vào danh sách local
      const updatedFeedbacks = [...localFeedbacks, newFeedback];
      setLocalFeedbacks(updatedFeedbacks);
      
      // Lưu vào AsyncStorage
      await AsyncStorage.setItem('userFeedbacks', JSON.stringify(updatedFeedbacks));
      
      return true;
    } catch (error) {
      console.error('Error saving feedback locally:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (feedback.trim() === '') {
      Alert.alert('Error', 'Please enter your feedback');
      return;
    }
    
    if (rating === 0) {
      Alert.alert('Error', 'Please rate your experience');
      return;
    }
    
    // Check if user is logged in
    if (!user || !user.id) {
      Alert.alert(
        'Sign in Required', 
        'You need to be logged in to submit feedback. Would you like to sign in now?',
        [
          {
            text: 'Sign In',
            onPress: () => navigation.navigate('LoginScreen')
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
      return;
    }
    
    // Save feedback locally
    const saved = await saveFeedbackLocally();
    
    if (saved) {
      Alert.alert(
        'Thank you!', 
        'Your feedback has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              setFeedback('');
              setRating(0);
              navigation.navigate('HomeScreen');
            }
          }
        ]
      );
    } else {
      Alert.alert('Error', 'Could not save your feedback. Please try again.');
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <AntDesign
            name={i <= rating ? 'star' : 'staro'}
            size={30}
            color={i <= rating ? '#FFD700' : '#ccc'}
            style={styles.star}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A73E8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>How was your experience?</Text>
        
        <Text style={styles.subtitle}>Rate your experience</Text>
        <View style={styles.ratingContainer}>
          {renderStars()}
        </View>

        <Text style={styles.subtitle}>Share your thoughts</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Tell us what you think about our service..."
          value={feedback}
          onChangeText={setFeedback}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
        />
        
        <TouchableOpacity 
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          )}
        </TouchableOpacity>

        {localFeedbacks.length > 0 && (
          <View style={styles.previousFeedbacks}>
            <Text style={styles.previousFeedbacksTitle}>Your Previous Feedbacks</Text>
            {localFeedbacks.map((item) => (
              <View key={item.id} style={styles.feedbackItem}>
                <View style={styles.feedbackHeader}>
                  <View style={styles.starsSmall}>
                    {[...Array(5)].map((_, i) => (
                      <AntDesign
                        key={i}
                        name={i < item.rating ? 'star' : 'staro'}
                        size={16}
                        color={i < item.rating ? '#FFD700' : '#ccc'}
                        style={{marginRight: 2}}
                      />
                    ))}
                  </View>
                  <Text style={styles.feedbackDate}>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.feedbackContent}>{item.content}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  star: {
    marginRight: 8,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 24,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#1A73E8',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    height: 56,
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9FC2F0',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  previousFeedbacks: {
    marginTop: 40,
  },
  previousFeedbacksTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  feedbackItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  starsSmall: {
    flexDirection: 'row',
  },
  feedbackDate: {
    fontSize: 12,
    color: '#757575',
  },
  feedbackContent: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 20,
  },
});

export default FeedbackScreen;