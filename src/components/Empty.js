import {View, Text, Image} from 'react-native';
import React from 'react';

const Empty = () => {
  return (
    <View
      style={{
        alignItems: 'center',
        marginTop: 100,
      }}>
      <Image
        source={require('../../assets/images/type/box.png')}
        style={{width: 46, height: 46}}
      />
      <Text style={{fontSize: 18, fontWeight: '600', color: 'black'}}>
        Không có yêu cầu nào
      </Text>
    </View>
  );
};

export default Empty;
