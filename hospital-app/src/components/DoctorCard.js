import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../utils/colors';
import dimensions from '../utils/dimensions';
import ICONS from '../constants/icons';
import Rating from './Rating';

const DoctorCard = ({
  doctor,
  onPress,
  horizontal = false,
  showRating = true,
  showLocation = true,
  style = {},
}) => {
  const { id, name, specialty, location, rating } = doctor;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        horizontal ? styles.horizontalContainer : styles.verticalContainer,
        style,
      ]}
      onPress={() => onPress(doctor)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${id % 100}.jpg` }}
        style={horizontal ? styles.horizontalImage : styles.verticalImage}
      />
      <View style={horizontal ? styles.horizontalContent : styles.verticalContent}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.specialty} numberOfLines={1}>
          {specialty}
        </Text>
        {showLocation && (
          <View style={styles.locationContainer}>
            <Icon name={ICONS.location} size={dimensions.smallIcon} color={Colors.darkGray} />
            <Text style={styles.location} numberOfLines={1}>
              {location}
            </Text>
          </View>
        )}
        {showRating && <Rating value={rating} size="small" />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: dimensions.radius,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: dimensions.margin / 2,
    overflow: 'hidden',
  },
  verticalContainer: {
    width: dimensions.width / 2 - dimensions.margin * 1.5,
  },
  horizontalContainer: {
    flexDirection: 'row',
    width: dimensions.width - dimensions.margin * 2,
  },
  verticalImage: {
    width: '100%',
    height: dimensions.width / 3,
    resizeMode: 'cover',
  },
  horizontalImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: dimensions.margin,
  },
  verticalContent: {
    padding: dimensions.padding,
  },
  horizontalContent: {
    flex: 1,
    padding: dimensions.padding,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    color: Colors.darkGray,
    marginLeft: 4,
    flex: 1,
  },
});

export default DoctorCard;