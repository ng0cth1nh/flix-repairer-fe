import React, {useState, useCallback} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  depositMoney,
  selectUser,
  selectIsLoading,
  setIsLoading,
  fetchProfile,
  setIsShowToast,
  selectIsShowToast,
} from '../../features/user/userSlice';
import CustomModal from '../../components/CustomModal';
import {RadioButton} from 'react-native-paper';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Button from '../../components/SubmitButton';
import TopHeaderComponent from '../../components/TopHeaderComponent';
import {numberWithCommas} from '../../utils/util';
import {formatCurrency, removeCommas} from '../../utils/FormattingCurrency';
import useAxios from '../../hooks/useAxios';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';
import ProgressLoader from 'rn-progress-loader';
import {VnPayCode} from '../../constants/Error';

const DepositScreen = ({route, navigation}) => {
  const {vnp_ResponseCode, vnp_TxnRef} = route.params;
  const user = useSelector(selectUser);
  const [money, setMoney] = useState(0);
  const [moneyInputError, setMoneyInputError] = useState(null);
  const repairerAPI = useAxios();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const isShowToast = useSelector(selectIsShowToast);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmitClick = async () => {
    try {
      setModalVisible(false);
      await dispatch(setIsLoading());
      let body = {
        amount: +removeCommas(money),
        orderInfo: `${user.phone} nap ${+removeCommas(money)} vao vi`,
        bankCode: 'NCB',
      };
      console.log('Deposit body: ', body);
      let response = await dispatch(
        depositMoney({
          repairerAPI,
          body,
        }),
      ).unwrap();
      console.log('response.data: ' + response.data);
      await Linking.openURL(response.data);
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    } finally {
      await dispatch(setIsShowToast(false));
    }
  };
  const checkMoney = async () => {
    if (money === 0 || +removeCommas(money) < 5000) {
      setMoneyInputError('Vui lòng nhập số tiền thối thiểu 5,000 vnđ');
    } else if (+removeCommas(money) > 100000000) {
      setMoneyInputError('Vui lòng nhập số tiền tối đa 100,000,000 vnđ');
    } else {
      setMoneyInputError(null);
      setModalVisible(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (vnp_ResponseCode && vnp_TxnRef) {
          console.log(
            'FOCUS - vnp_ResponseCode - vnp_TxnRef - isSHowTOAST: ',
            vnp_ResponseCode,
            vnp_TxnRef,
            isShowToast,
          );
          if (vnp_ResponseCode && vnp_ResponseCode === '00' && !isShowToast) {
            await dispatch(fetchProfile(repairerAPI));
            Toast.show({
              type: 'customToast',
              text1: VnPayCode.get(vnp_ResponseCode),
            });
          } else if (
            vnp_ResponseCode &&
            vnp_ResponseCode !== '00' &&
            !isShowToast
          ) {
            Toast.show({
              type: 'customErrorToast',
              text1: VnPayCode.get(vnp_ResponseCode),
            });
          }
          navigation.navigate('ProfileStackScreen', {
            screen: 'ProfileScreen',
          });
          await dispatch(setIsShowToast(true));
        }
      })();
    }, [vnp_ResponseCode, vnp_TxnRef]),
  );

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Nạp tiền vào tài khoản"
        isBackButton={true}
        statusBarColor="white"
        screen="DepositScreen"
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
                moneyInputError ? {borderColor: '#FF6442'} : null,
              ]}>
              <TextInput
                keyboardType="numeric"
                value={money}
                onFocus={() => setMoneyInputError(null)}
                placeholder="0"
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
              {moneyInputError && (
                <Text style={styles.errorMessage}>{moneyInputError}</Text>
              )}
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
          <View style={[styles.box, {marginBottom: 10}]}>
            <RadioButton value="V" status="checked" color="#FFBC00" />
            <Image
              source={require('../../../assets/images/payment_method/VNPay.png')}
              style={[styles.image, {borderRadius: 0, width: 30, height: 30}]}
            />
            <Text style={styles.text}>VNPAY</Text>
          </View>
        </ScrollView>
        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          modalRatio={0.3}>
          <Text style={styles.modalText}>
            Bạn có chắc chắn muốn nạp {money} vnđ từ ví VNPAY không?
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              style={[styles.button, styles.buttonOpen]}
              onPress={handleSubmitClick}>
              <Text style={styles.textStyle}>XÁC NHẬN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>ĐÓNG</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
        <Button
          style={{
            marginVertical: 16,
          }}
          onPress={checkMoney}
          buttonText="NẠP TIỀN"
        />
        <ProgressLoader
          visible={isLoading && !isShowToast ? true : false}
          isModal={true}
          isHUD={true}
          hudColor={'#FEC54B'}
          color={'#000000'}
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
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
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
  errorMessage: {
    position: 'absolute',
    bottom: -14,
    left: 5,
    fontSize: 10,
    color: '#FF6442',
  },
  buttonOpen: {
    backgroundColor: '#FEC54B',
  },
  buttonClose: {
    backgroundColor: '#F0F0F0',
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 40,
    textAlign: 'center',
  },
  iconView: {
    height: '100%',
    width: '12%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 16,
    color: 'black',
  },
  button: {
    width: '40%',
    borderRadius: 20,
    paddingVertical: 10,
  },
});

export default DepositScreen;
