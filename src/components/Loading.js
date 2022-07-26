import {ActivityIndicator} from 'react-native';
import React from 'react';

const Loading = () => {
  return (
    <ActivityIndicator
      size="small"
      color="#FEC54B"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
};

export default Loading;
