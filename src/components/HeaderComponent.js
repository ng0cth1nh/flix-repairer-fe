import React, {memo} from 'react';
import {ImageBackground, StatusBar} from 'react-native';
const HeaderComponent = ({height}) => {
  return (
    <ImageBackground
      source={require('../../assets/images/login_register_bg/bg.jpg')}
      resizeMode="cover"
      style={{
        width: '100%',
        height,
        justifyContent: 'center',
        position: 'absolute',
      }}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
        style={{position: 'absolute'}}
      />
    </ImageBackground>
  );
};
export default memo(HeaderComponent);
