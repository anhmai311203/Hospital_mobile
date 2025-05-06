import React, { useState, useEffect, useContext } from 'react'; // Thêm useContext
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from '../../api/axios'; // Import instance đã cấu hình
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const PaymentScreen = ({ navigation, route }) => {
  const { appointment } = route.params || {};
  const { user } = useContext(AuthContext); // Lấy user từ context
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [amount, setAmount] = useState(appointment?.price || '150.00');
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  useEffect(() => {
    if (appointment?.id) {
      fetchAppointmentDetails();
    }
  }, []);

  const fetchAppointmentDetails = async () => {
    try {
      // In a real app, you would fetch details from the API
      // For now, we'll use the data passed in route.params
      setAppointmentDetails(appointment);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      Alert.alert('Error', 'Could not fetch appointment details');
    }
  };

  const formatCardNumber = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/[^0-9]/g, '');
    
    // Add spaces after every 4 digits
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += cleaned[i];
    }
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/[^0-9]/g, '');
    
    // Add slash after first 2 digits
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i === 2) {
        formatted += '/';
      }
      formatted += cleaned[i];
    }
    
    // Limit to 5 characters (MM/YY)
    return formatted.slice(0, 5);
  };

  const handlePayment = async () => {
    // Validate inputs
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number');
      return;
    }

    if (!cardHolder) {
      Alert.alert('Error', 'Please enter the card holder name');
      return;
    }

    if (!expiryDate || expiryDate.length !== 5) {
      Alert.alert('Error', 'Please enter a valid expiry date (MM/YY)');
      return;
    }

    if (!cvv || cvv.length !== 3) {
      Alert.alert('Error', 'Please enter a valid CVV');
      return;
    }

    try {
      setLoading(true);

      // Kiểm tra user từ context
      if (!user || !user.id) {
        Alert.alert('Error', 'You need to be logged in to make a payment');
        navigation.navigate('LoginScreen');
        return;
      }

      // Process payment with backend using configured axios instance
      const response = await axios.post('http://192.168.2.80:3000/payments', {
        appointment_id: appointment.id,
        card_number: cardNumber.replace(/\s/g, ''),
        card_holder: cardHolder,
        amount: parseFloat(amount),
        status: 'completed',
      });

      if (response.status === 201) {
        if (saveCard) {
          // Lưu ý: Lưu thẻ vào AsyncStorage không an toàn cho production
          // await AsyncStorage.setItem('savedCard', JSON.stringify({
          //   cardNumber: cardNumber.replace(/\s/g, '').slice(-4),
          //   cardHolder,
          //   expiryDate,
          // }));
        }

        Alert.alert(
          'Payment Successful',
          'Your appointment has been confirmed.',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('Appointments') // Sửa tên màn hình
            }
          ]
        );
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Failed', 'There was an error processing your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A73E8" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.appointmentSummary}>
          <Text style={styles.summaryTitle}>Appointment Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Doctor:</Text>
            <Text style={styles.summaryValue}>
              {appointmentDetails?.doctorName || 'Dr. Sarah Johnson'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={styles.summaryValue}>
              {appointmentDetails?.date || 'May 15, 2025'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Time:</Text>
            <Text style={styles.summaryValue}>
              {appointmentDetails?.time || '10:00 AM'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Service:</Text>
            <Text style={styles.summaryValue}>
              {appointmentDetails?.service || 'Consultation'}
            </Text>
          </View>
          <View style={[styles.summaryItem, styles.totalItem]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${amount}</Text>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <View style={styles.cardLogos}>
            <FontAwesome name="cc-visa" size={32} color="#1A1A1A" />
            <FontAwesome name="cc-mastercard" size={32} color="#1A1A1A" style={styles.cardLogo} />
            <FontAwesome name="cc-amex" size={32} color="#1A1A1A" style={styles.cardLogo} />
          </View>

          <Text style={styles.inputLabel}>Card Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              keyboardType="numeric"
              maxLength={19}
            />
            <FontAwesome name="credit-card" size={24} color="#9E9E9E" style={styles.inputIcon} />
          </View>

          <Text style={styles.inputLabel}>Cardholder Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              value={cardHolder}
              onChangeText={setCardHolder}
            />
            <FontAwesome name="user" size={24} color="#9E9E9E" style={styles.inputIcon} />
          </View>

          <View style={styles.row}>
            <View style={styles.halfColumn}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  keyboardType="numeric"
                  maxLength={5}
                />
                <FontAwesome name="calendar" size={24} color="#9E9E9E" style={styles.inputIcon} />
              </View>
            </View>
            
            <View style={styles.halfColumn}>
              <Text style={styles.inputLabel}>CVV</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  value={cvv}
                  onChangeText={(text) => setCvv(text.replace(/[^0-9]/g, '').slice(0, 3))}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
                <MaterialCommunityIcons name="credit-card-lock" size={24} color="#9E9E9E" style={styles.inputIcon} />
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.saveCardContainer}
            onPress={() => setSaveCard(!saveCard)}
          >
            <View style={[styles.checkbox, saveCard ? styles.checkboxChecked : {}]}>
              {saveCard && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
            <Text style={styles.saveCardText}>Save card for future payments</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.payButton, loading ? styles.payButtonDisabled : {}]}
          onPress={handlePayment}
          disabled={loading}
        >
          <Text style={styles.payButtonText}>
            {loading ? 'Processing...' : `Pay $${amount}`}
          </Text>
        </TouchableOpacity>

        <View style={styles.secureNote}>
          <Ionicons name="lock-closed" size={16} color="#4CAF50" />
          <Text style={styles.secureText}>Your payment information is secure and encrypted</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By proceeding with payment, you agree to our Terms and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  appointmentSummary: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  totalItem: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A73E8',
  },
  paymentSection: {
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
  cardLogos: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cardLogo: {
    marginLeft: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  inputIcon: {
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfColumn: {
    width: '48%',
  },
  saveCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1A73E8',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1A73E8',
  },
  saveCardText: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  payButton: {
    backgroundColor: '#1A73E8',
    borderRadius: 8,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  secureText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 6,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
  },
});

export default PaymentScreen;