import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../utils/colors';
import dimensions from '../utils/dimensions';
import ICONS from '../constants/icons';

const Rating = ({ value = 0, total = 5, size = 'medium', style = {} }) => {
  const getStarSize = () => {
    switch (size) {
      case 'small':
        return dimensions.smallIcon;
      case 'large':
        return dimensions.largeIcon;
      default:
        return dimensions.mediumIcon;
    }
  };

  const renderStars = () => {
    const stars = [];
    const starSize = getStarSize();
    const starColor = Colors.secondary;

    for (let i = 1; i <= total; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= value ? ICONS.star : ICONS.starEmpty}
          size={starSize}
          color={starColor}
          style={styles.star}
        />
      );
    }

    return stars;
  };

  return <View style={[styles.container, style]}>{renderStars()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
});

export default Rating;
