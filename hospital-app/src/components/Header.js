import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../utils/colors';
import dimensions from '../utils/dimensions';
import ICONS from '../constants/icons';

const Header = ({
  title,
  leftIcon = ICONS.back,
  rightIcon = null,
  onLeftPress,
  onRightPress,
  transparent = false,
  backgroundColor = Colors.white,
  showShadow = true,
}) => {
  const getHeaderStyle = () => {
    return [
      styles.header,
      transparent ? styles.transparentHeader : { backgroundColor },
      showShadow && styles.headerShadow,
    ];
  };

  return (
    <>
      <StatusBar
        barStyle={transparent || backgroundColor === Colors.primary ? 'light-content' : 'dark-content'}
        backgroundColor={transparent ? 'transparent' : backgroundColor}
        translucent={transparent}
      />
      <View style={getHeaderStyle()}>
        <View style={styles.leftContainer}>
          {leftIcon && onLeftPress && (
            <TouchableOpacity style={styles.iconButton} onPress={onLeftPress}>
              <Icon
                name={leftIcon}
                size={dimensions.mediumIcon}
                color={transparent ? Colors.white : Colors.text}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              transparent && styles.transparentTitle,
              backgroundColor === Colors.primary && styles.whiteTitle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          {rightIcon && onRightPress && (
            <TouchableOpacity style={styles.iconButton} onPress={onRightPress}>
              <Icon
                name={rightIcon}
                size={dimensions.mediumIcon}
                color={transparent ? Colors.white : Colors.text}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: dimensions.headerHeight + (StatusBar.currentHeight || 0),
    paddingTop: StatusBar.currentHeight || 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.padding,
  },
  transparentHeader: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerShadow: {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  transparentTitle: {
    color: Colors.white,
  },
  whiteTitle: {
    color: Colors.white,
  },
  iconButton: {
    padding: 5,
  },
});

export default Header;
