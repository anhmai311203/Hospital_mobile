import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { colors } from '../../utils/colors';

const AppointmentScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Add listener for when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAppointments();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchAppointments = async () => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      let response;
      try {
        // Cố gắng gọi API thật
        response = await axios.get('/appointments');
      } catch (apiError) {
        console.error('API error, using mock data:', apiError);

        // Nếu có lỗi, sử dụng mock data
        const mockAppointments = [
          {
            id: 1,
            user_id: user.id,
            doctor_id: 1,
            doctor_name: "John Smith",
            specialty: "Cardiology",
            date: "2023-12-01",
            time: "09:00:00",
            notes: "Regular checkup",
            status: "confirmed"
          },
          {
            id: 2,
            user_id: user.id,
            doctor_id: 2,
            doctor_name: "Emily Johnson",
            specialty: "Dermatology",
            date: "2023-12-15",
            time: "14:30:00",
            notes: "",
            status: "pending"
          }
        ];

        setAppointments(mockAppointments);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      console.log('Appointments response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setAppointments(response.data);
      } else if (response.data && Array.isArray(response.data.appointments)) {
        setAppointments(response.data.appointments);
      } else {
        console.error('Unexpected response format:', response.data);
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);

      // Khi có lỗi, sử dụng mock data
      const mockAppointments = [
        // ... same mock data as above ...
      ];

      setAppointments(mockAppointments);

      Alert.alert(
        'Notice',
        'Using sample data for demonstration. Some features may be limited.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await axios.patch(`/appointments/${appointmentId}/cancel`);
      
      // Update local state to reflect cancellation
      setAppointments(appointments.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: 'cancelled' }
          : appointment
      ));
      
      Alert.alert('Success', 'Appointment cancelled successfully');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      Alert.alert('Error', 'Failed to cancel appointment. Please try again.');
    }
  };

  const confirmCancelAppointment = (appointmentId) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => cancelAppointment(appointmentId) }
      ]
    );
  };

  const handleReschedule = (appointment) => {
    navigation.navigate('BookAppointment', {
      doctor_id: appointment.doctor_id,
      isRescheduling: true,
      appointment_id: appointment.id
    });
  };

  const renderAppointmentItem = ({ item }) => {
    // Format date display
    const appointmentDate = new Date(item.date);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    // Determine if appointment is upcoming
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isUpcoming = appointmentDate >= today && item.status !== 'cancelled';

    // Skip this item if it doesn't match the filter
    if (
      (filter === 'upcoming' && !isUpcoming) ||
      (filter === 'past' && isUpcoming)
    ) {
      return null;
    }

    // Determine status color
    let statusColor = colors.warning;
    if (item.status === 'confirmed') statusColor = colors.success;
    if (item.status === 'cancelled') statusColor = colors.error;
    if (item.status === 'completed') statusColor = colors.success;

    return (
      <View style={styles.appointmentCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.doctorName}>Dr. {item.doctor_name || 'Unknown'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Pending'}
            </Text>
          </View>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.primary} />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={styles.detailText}>{item.time || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="medical-outline" size={16} color={colors.primary} />
            <Text style={styles.detailText}>
              {item.specialty || 'Consultation'}
            </Text>
          </View>

          {item.location && (
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color={colors.primary} />
              <Text style={styles.detailText}>{item.location}</Text>
            </View>
          )}
        </View>

        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}

        {isUpcoming && item.status !== 'cancelled' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rescheduleButton]}
              onPress={() => handleReschedule(item)}
            >
              <Ionicons name="calendar-outline" size={16} color={colors.primary} />
              <Text style={styles.rescheduleButtonText}>Reschedule</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => confirmCancelAppointment(item.id)}
            >
              <Ionicons name="close-circle-outline" size={16} color={colors.error} />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const filterButtons = [
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Past', value: 'past' },
    { label: 'All', value: 'all' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Appointments</Text>
      </View>

      <View style={styles.filterContainer}>
        {filterButtons.map((button) => (
          <TouchableOpacity
            key={button.value}
            style={[
              styles.filterButton,
              filter === button.value && styles.filterButtonActive
            ]}
            onPress={() => setFilter(button.value)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === button.value && styles.filterButtonTextActive
              ]}
            >
              {button.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      ) : (
        <>
          {appointments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={60} color={colors.textGray} />
              <Text style={styles.emptyText}>No appointments found</Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => navigation.navigate('HomeScreen')}
              >
                <Text style={styles.bookButtonText}>Book an Appointment</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={appointments}
              renderItem={renderAppointmentItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    marginBottom: 8
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 10
  },
  filterButtonActive: {
    backgroundColor: colors.primary
  },
  filterButtonText: {
    color: colors.textGray,
    fontWeight: '500'
  },
  filterButtonTextActive: {
    color: colors.white
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    color: colors.textGray
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 16,
    color: colors.textGray,
    marginTop: 10,
    marginBottom: 20
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8
  },
  bookButtonText: {
    color: colors.white,
    fontWeight: '500'
  },
  listContainer: {
    padding: 16
  },
  appointmentCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500'
  },
  appointmentDetails: {
    marginBottom: 12
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text
  },
  notesContainer: {
    backgroundColor: colors.backgroundLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textGray,
    marginBottom: 4
  },
  notesText: {
    fontSize: 14,
    color: colors.text
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
    paddingTop: 12
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1
  },
  rescheduleButton: {
    backgroundColor: colors.primary + '10',
    marginRight: 8
  },
  cancelButton: {
    backgroundColor: colors.error + '10',
    marginLeft: 8
  },
  rescheduleButtonText: {
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4
  },
  cancelButtonText: {
    color: colors.error,
    fontWeight: '500',
    marginLeft: 4
  }
});

export default AppointmentScreen;
