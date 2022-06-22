import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import BackButton from '../../components/BackButton';
import Button from '../../components/SubmitButton';

const ChoosePaymentMethodScreen = ({navigation}) => {
  const buttonClicked = () => {
    //do smth
  };
  const [checked, setChecked] = useState('first');
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <SafeAreaView style={{flex: 1}}>
        <Text style={styles.headerText}>Phương thức thanh toán</Text>
        <ScrollView
          style={{
            paddingHorizontal: 20,
            flex: 1,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#CACACA',
          }}>
          <View style={styles.box}>
            <RadioButton
              value="first"
              status={checked === 'first' ? 'checked' : 'unchecked'}
              color="#FFBC00"
              onPress={() => {
                setChecked('first');
              }}
            />
            <Image
              source={require('../../../assets/images/payment_method/VNPay.png')}
              style={styles.image}
            />
            <Text style={styles.text}>VNPAY</Text>
          </View>
          <View style={styles.box}>
            <RadioButton
              value="second"
              status={checked === 'second' ? 'checked' : 'unchecked'}
              color="#FFBC00"
              onPress={() => {
                setChecked('second');
              }}
            />
            <Image
              source={require('../../../assets/images/payment_method/cash.png')}
              style={styles.image}
            />
            <Text style={styles.text}>Tiền mặt</Text>
          </View>
        </ScrollView>
        <View>
          <Button
            style={{
              marginTop: 10,
              marginBottom: 30,
              width: '85%',
              alignSelf: 'center',
            }}
            onPress={buttonClicked}
            buttonText="ĐỒNG Ý"
          />
        </View>
      </SafeAreaView>
      <BackButton onPressHandler={navigation.goBack} color="black" />
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
  box: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    height: 70,
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  image: {
    height: '85%',
    aspectRatio: 1,
    marginLeft: 10,
    marginRight: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ChoosePaymentMethodScreen;
