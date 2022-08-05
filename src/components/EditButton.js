import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export default function EditButton({onPressHandler}) {
  return (
    <TouchableOpacity
      onPress={onPressHandler}
      style={{
        position: 'absolute',
        zIndex: 1,
        top: getStatusBarHeight() + 8,
        right: 20,
      }}>
      <Image
        style={{width: 24, height: 24}}
        source={require('../../assets/images/type/edit.png')}
      />
    </TouchableOpacity>
  );
}
