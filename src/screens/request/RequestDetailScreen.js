import React, {useState} from 'react';
import {Text, View, SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import moment from 'moment';

import BackButton from '../../components/BackButton';
import RequestForm from '../../components/RequestForm';

const RequestDetailScreen = ({navigation}) => {
  const [date, setDate] = useState(moment());
  const [description, setDiscription] = useState('');
  function handlerButtonClick() {
    console.log(date);
  }
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <BackButton onPressHandler={navigation.goBack} color="black" />
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            borderBottomWidth: 1,
            borderBottomColor: '#CACACA',
            paddingRight: 20,
          }}>
          <View style={{flex: 1, marginLeft: 20}}>
            <Text style={styles.headerText}>Yêu cầu sửa chữa</Text>
          </View>
        </View>
        <RequestForm
          buttonClicked={handlerButtonClick}
          buttonText="Cập nhật trạng thái"
          date={date}
          setDate={setDate}
          description={description}
          setDiscription={setDiscription}
          editable={false}
          isRequestIdVisible={true}
        />
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'black',
    marginTop: getStatusBarHeight(),
    paddingBottom: 15,
    alignSelf: 'center',
  },
});

export default RequestDetailScreen;
