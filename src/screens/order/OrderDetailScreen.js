import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';

import BackButton from '../../components/BackButton';
import RequestForm from '../../components/RequestForm';

const OrderDetailScreen = ({navigation}) => {
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
            marginBottom: 10,
            paddingRight: 20,
          }}>
          <View style={{flex: 1, marginLeft: 20}}>
            <Text style={styles.headerText}>Yêu cầu sửa chữa</Text>
          </View>
          <TouchableOpacity style={{marginLeft: 'auto'}}>
            <Icon name="edit" size={30} style={{color: 'black'}} />
          </TouchableOpacity>
        </View>
        <RequestForm
          buttonClicked={handlerButtonClick}
          buttonText="Hủy yêu cầu"
          date={date}
          setDate={setDate}
          description={description}
          setDiscription={setDiscription}
          editable={false}
          isOrderIdVisible={true}
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

export default OrderDetailScreen;
