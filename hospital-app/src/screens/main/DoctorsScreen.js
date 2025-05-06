import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { colors } from '../../utils/colors';
import dimensions from '../../utils/dimensions';// chuẩn và không lỗi


const specialties = [
  'All', 'Dermatology', 'Cardiology', 'Pediatrics', 'Neurology', 'Orthopedics'
];

const DoctorsScreen = ({ navigation }) => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchQuery, selectedSpecialty, doctors]);

  const fetchDoctors = async () => {
    try {
      // Sử dụng axios instance và đường dẫn tương đối
      const response = await axios.get('/doctors'); 
      setDoctors(response.data);
      setFilteredDoctors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
      
      // For demo purposes, let's add some mock data
      const mockDoctors = [
        { id: 1, name: 'John Smith', specialty: 'Dermatology', location: 'New York Medical Center', rating: 4.8 },
        { id: 2, name: 'Sarah Johnson', specialty: 'Cardiology', location: 'Heart Institute', rating: 4.9 },
        { id: 3, name: 'Michael Brown', specialty: 'Pediatrics', location: 'Children\'s Hospital', rating: 4.7 },
        { id: 4, name: 'Emily Davis', specialty: 'Neurology', location: 'Brain & Spine Center', rating: 4.5 },
        { id: 5, name: 'Robert Wilson', specialty: 'Orthopedics', location: 'Sports Medicine Clinic', rating: 4.6 },
        { id: 6, name: 'Jessica Miller', specialty: 'Dermatology', location: 'Skin Care Clinic', rating: 4.3 },
      ];
      
      setDoctors(mockDoctors);
      setFilteredDoctors(mockDoctors);
    }
  };

  const filterDoctors = () => {
    let filtered = [...doctors];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by specialty
    if (selectedSpecialty !== 'All') {
      filtered = filtered.filter(doctor => 
        doctor.specialty === selectedSpecialty
      );
    }
    
    setFilteredDoctors(filtered);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={14} color="#FFD700" style={{ marginRight: 2 }} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={14} color="#FFD700" style={{ marginRight: 2 }} />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={14} color="#FFD700" style={{ marginRight: 2 }} />
        );
      }
    }
    
    return stars;
  };

  const renderDoctorItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.doctorCard}
        onPress={() => navigation.navigate('DoctorDetails', { doctor_id: item.id })}
      >
        <View style={styles.doctorAvatar}>
          <Text style={styles.doctorInitials}>
            {item.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>Dr. {item.name}</Text>
          <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color={colors.textGray} />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
          
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {renderStars(item.rating)}
            </View>
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Doctors</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.textGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors, specialties..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.specialtiesContainer}>
        <FlatList
          data={specialties}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.specialtiesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.specialtyItem,
                selectedSpecialty === item && styles.selectedSpecialtyItem
              ]}
              onPress={() => setSelectedSpecialty(item)}
            >
              <Text
                style={[
                  styles.specialtyText,
                  selectedSpecialty === item && styles.selectedSpecialtyText
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredDoctors.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search" size={60} color={colors.lightGray} />
          <Text style={styles.noResultsText}>No doctors found</Text>
          <Text style={styles.noResultsSubText}>Try different search criteria</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDoctorItem}
          contentContainerStyle={styles.doctorsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  specialtiesContainer: {
    marginBottom: 16,
  },
  specialtiesList: {
    paddingHorizontal: 20,
  },
  specialtyItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedSpecialtyItem: {
    backgroundColor: colors.primary,
  },
  specialtyText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedSpecialtyText: {
    color: colors.white,
    fontWeight: '500',
  },
  doctorsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  doctorInitials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: colors.textGray,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 12,
    color: colors.textGray,
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  noResultsSubText: {
    fontSize: 14,
    color: colors.textGray,
    marginTop: 8,
  },
});

export default DoctorsScreen;