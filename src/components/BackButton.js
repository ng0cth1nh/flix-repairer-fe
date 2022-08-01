import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {TouchableOpacity} from 'react-native';

export default function BackButton({color, onPressHandler}) {
  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        zIndex: 1,
        marginTop: getStatusBarHeight(),
        left: '4%',
      }}
      onPress={onPressHandler}>
      <Icon name="ios-arrow-back-outline" color={color} size={34} />
    </TouchableOpacity>
  );
}
