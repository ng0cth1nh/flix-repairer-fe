import React from 'react';
import {Text, View, StatusBar, Dimensions, StyleSheet} from 'react-native';
import BackButton from './BackButton';
const {height} = Dimensions.get('window');
import {getStatusBarHeight} from 'react-native-status-bar-height';

const TopHeaderComponent = ({
  navigation,
  title,
  isBackButton,
  statusBarColor,
}) => {
  return (
    <View
      style={{
        height: height * 0.1,
        borderBottomWidth: 1,
        borderBottomColor: '#CACACA',
      }}>
      <StatusBar barStyle="dark-content" backgroundColor={statusBarColor} />
      {isBackButton ? (
        <BackButton onPressHandler={navigation.goBack} color="black" />
      ) : null}
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    color: 'black',
    marginTop: getStatusBarHeight(),
    width: '100%',
  },
});

export default TopHeaderComponent;
