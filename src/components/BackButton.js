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
        marginLeft: 20,
      }}
      onPress={onPressHandler}>
      <Icon name="arrow-back" color={color} size={35} />
    </TouchableOpacity>
  );
}
