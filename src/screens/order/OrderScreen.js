import React, {useState} from 'react';
import {Text, View, SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import moment from 'moment';

import BackButton from '../../components/BackButton';
import RequestForm from '../../components/RequestForm';

const OrderScreen = ({navigation}) => {
  const [date, setDate] = useState(moment());
  const [description, setDiscription] = useState('');
  function handlerButtonClick() {
    console.log(date);
  }
  const test = handlerButtonClick.bind(RequestForm);
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <BackButton onPressHandler={navigation.goBack} color="black" />
      <SafeAreaView style={{flex: 1}}>
        <Text style={styles.headerText}>Đặt lịch</Text>
        <RequestForm
          buttonClicked={test}
          buttonText="ĐẶT LỊCH"
          date={date}
          setDate={setDate}
          description={description}
          setDiscription={setDiscription}
          editable={true}
        />
      </SafeAreaView>
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
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CACACA',
    width: '100%',
    marginBottom: 10,
  },
});

export default OrderScreen;
