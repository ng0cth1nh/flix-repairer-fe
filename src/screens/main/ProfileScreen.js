import React, {useRef, useState, useContext} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Context as AuthContext} from '../../context/AuthContext';
const {width: screenWidth} = Dimensions.get('window');

const ProfileScreen = props => {
  const {logout} = useContext(AuthContext);

  return (
    <TouchableOpacity
      style={{width: 50, height: 60, backgroundColor: 'yellow'}}
      onPress={logout}>
      <Text>Logout</Text>
    </TouchableOpacity>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    position: 'absolute',
    color: 'white',
    bottom: 10,
    left: 20,
    fontWeight: '700',
    fontSize: 24,
  },
  item: {
    width: screenWidth - 60,
    height: 150,
    position: 'relative',
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});
