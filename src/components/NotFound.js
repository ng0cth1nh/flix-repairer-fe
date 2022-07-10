import {View, Text, Image} from 'react-native';
import React from 'react';

const NotFound = () => {
  return (
    <View
      style={{
        alignItems: 'center',
        marginTop: 100,
      }}>
      <Image
        source={require('../../assets/images/type/cloud-computing.png')}
        style={{width: 46, height: 46}}
      />
      <Text style={{fontSize: 18, fontWeight: '600', color: 'black'}}>
        Không tìm thấy dữ liệu
      </Text>
    </View>
  );
};

export default NotFound;
