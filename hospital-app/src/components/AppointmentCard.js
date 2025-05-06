import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../utils/colors';
import dimensions from '../utils/dimensions'; 
import ICONS from '../constants/icons';
import { formatDate, formatTime, getStatusColor } from '../utils/helpers';

const AppointmentCard = ({ appointment, onPress, style = {} }) => {
  const { doctor, date, time, status } = appointment;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress(appointment)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(status) }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Icon name={ICONS.date} size={dimensions.smallIcon} color={Colors.darkGray} />
          <Text style={styles.infoText}>{formatDate(date)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name={ICONS.time} size={dimensions.smallIcon} color={Colors.darkGray} />
          <Text style={styles.infoText}>{formatTime(time)}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Icon name={ICONS.location} size={dimensions.smallIcon} color={Colors.darkGray} />
          <Text style={styles.infoText} numberOfLines={1}>
            {doctor.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: dimensions.radius,
    padding: dimensions.padding,
    marginBottom: dimensions.margin,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: dimensions.margin,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
    textTransform: 'capitalize',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: dimensions.margin,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 6,
  },
});