import React from 'react';
import {Text, View, StatusBar, StyleSheet} from 'react-native';
import BackButton from './BackButton';
import EditButton from './EditButton';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const TopHeaderComponent = ({
  navigation,
  title,
  isBackButton,
  statusBarColor,
  isEditButton = false,
  onPressEdit = null,
  style = null,
  isNavigateFromNotiScreen = false,
}) => {
  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      if (isNavigateFromNotiScreen) {
        navigation.navigate('RequestHistoryScreen');
      } else {
        navigation.goBack();
      }
    } else {
      navigation.navigate('HomeScreen');
    }
  };

  return (
    <View
      style={[
        {
          height: 'auto',
          borderBottomWidth: 1,
          borderBottomColor: '#CACACA',
          paddingBottom: 20,
          paddingHorizontal: '12%',
          flexDirection: 'row',
        },
        style,
      ]}>
      <StatusBar barStyle="dark-content" backgroundColor={statusBarColor} />
      {isBackButton && (
        <BackButton onPressHandler={handleGoBack} color="black" size={18} />
      )}
      {isEditButton && <EditButton onPressHandler={onPressEdit} />}
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    alignSelf: 'center',
    marginTop: getStatusBarHeight(),
    width: '100%',
  },
});

export default TopHeaderComponent;
