/* eslint-disable prettier/prettier */
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ForwardButton({ color, onPressHandler }) {
  return (
    <TouchableOpacity
      onPress={onPressHandler}>
      <Icon name="arrow-forward" color={color} size={30} />
    </TouchableOpacity>
  );
}
