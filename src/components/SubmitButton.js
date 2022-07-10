import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Dimensions} from 'react-native';
const {height} = Dimensions.get('window');

const Button = props => {
  return (
    <TouchableOpacity
      style={[styles.loginButton, props.style]}
      onPress={props.onPress}>
      <Text style={styles.buttonText}>{props.buttonText}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  loginButton: {
    height: 0.075 * height,
    borderRadius: 16,
    backgroundColor: '#FEC54B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Button;
