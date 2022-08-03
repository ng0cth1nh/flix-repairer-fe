import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useSelector} from 'react-redux';
import {selectUser} from '../../features/user/userSlice';
import {RadioButton} from 'react-native-paper';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Button from '../../components/SubmitButton';
import TopHeaderComponent from '../../components/TopHeaderComponent';
import {numberWithCommas} from '../../utils/util';
import {formatCurrency} from '../../utils/FormattingCurrency';

const DepositScreen = ({navigation}) => {
  const user = useSelector(selectUser);
  const [money, setMoney] = useState(0);
  const buttonClicked = () => {
    navigation.goBack();
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Nạp tiền vào tài khoản"
        isBackButton={true}
        statusBarColor="white"
      />
      <SafeAreaView style={{flex: 1, paddingHorizontal: '4%'}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: '#F0F0F0',
              borderRadius: 10,
              paddingHorizontal: 20,
              height: 'auto',
              paddingVertical: 20,
              marginTop: 10,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../../../assets/images/logo/logo_size.jpg')}
                style={[styles.image, {marginRight: 10, marginLeft: 0}]}
              />
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.text, {fontSize: 16}]}>Số dư: </Text>
                <Text style={[styles.text, {fontSize: 16, color: '#E9AB0D'}]}>
                  {numberWithCommas(user.balance)} VND
                </Text>
              </View>
            </View>
            <Text style={{color: 'black', fontSize: 14, marginVertical: 10}}>
              Nhập số tiền cần nạp
            </Text>
            <View
              style={[
                styles.inputField,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  paddingLeft: 20,
                },
              ]}>
              <TextInput
                keyboardType="numeric"
                value={money}
                onChangeText={newPrice => setMoney(formatCurrency(newPrice))}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  height: 50,
                  color: 'black',
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginRight: 6,
                }}
              />
              <Text style={styles.textBold}>vnđ</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <TouchableOpacity
                style={[
                  styles.moneyButton,
                  {backgroundColor: money === '200,000' ? '#FEC54B' : 'white'},
                ]}
                onPress={() => {
                  setMoney(formatCurrency('200000'));
                }}>
                <Text style={{color: 'black', fontWeight: '600'}}>
                  200,000 vnđ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.moneyButton,
                  {backgroundColor: money === '500,000' ? '#FEC54B' : 'white'},
                ]}
                onPress={() => {
                  setMoney(formatCurrency('500000'));
                }}>
                <Text style={{color: 'black', fontWeight: '600'}}>
                  500,000 vnđ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.moneyButton,
                  {
                    backgroundColor:
                      money === '1,000,000' ? '#FEC54B' : 'white',
                  },
                ]}
                onPress={() => {
                  setMoney(formatCurrency('1000000'));
                }}>
                <Text style={{color: 'black', fontWeight: '600'}}>
                  1,000,000 vnđ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.text, {marginVertical: 20}]}>Nguồn tiền</Text>
          <View style={styles.box}>
            <RadioButton value="V" status="checked" color="#FFBC00" />
            <Image
              source={require('../../../assets/images/payment_method/VNPay.png')}
              style={styles.image}
            />
            <Text style={styles.text}>VNPAY</Text>
          </View>
        </ScrollView>
        <Button
          style={{
            marginVertical: 16,
          }}
          onPress={buttonClicked}
          buttonText="NẠP TIỀN"
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
    width: '100%',
  },
  box: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  image: {
    height: 40,
    width: 40,
    marginLeft: 10,
    marginRight: 20,
    borderRadius: 8,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  textBold: {
    fontWeight: 'bold',
    color: 'black',
  },
  moneyButton: {
    backgroundColor: 'white',
    width: 'auto',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
  },
});

export default DepositScreen;
