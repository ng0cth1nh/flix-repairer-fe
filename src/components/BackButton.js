import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export default function BackButton({color, onPressHandler}) {
  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        marginTop: getStatusBarHeight() + 10,
        marginLeft: 20,
      }}
      onPress={onPressHandler}>
      <Icon name="arrow-back" color={color} size={35} />
    </TouchableOpacity>
  );
}
