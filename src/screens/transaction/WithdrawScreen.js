import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  withdrawMoney,
  selectUser,
  selectIsLoading,
  setIsLoading,
} from '../../features/user/userSlice';
const {width, height} = Dimensions.get('window');
import {RequestStatus} from '../../utils/util';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomModal from '../../components/CustomModal';
import {RadioButton} from 'react-native-paper';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Button from '../../components/SubmitButton';
import TopHeaderComponent from '../../components/TopHeaderComponent';
import {numberWithCommas} from '../../utils/util';
import {formatCurrency, removeCommas} from '../../utils/FormattingCurrency';
import useAxios from '../../hooks/useAxios';
import Toast from 'react-native-toast-message';
import ProgressLoader from 'rn-progress-loader';
import {BankType} from '../../utils/util';
import RNPickerSelect from 'react-native-picker-select';
import {
  fetchRequests,
  selectRequests,
} from '../../features/request/requestSlice';

const WithdrawScreen = ({navigation}) => {
  const user = useSelector(selectUser);
  const [money, setMoney] = useState(0);
  const [moneyInputError, setMoneyInputError] = useState(null);
  const repairerAPI = useAxios();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const [modalVisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState('CASH');
  const [bankCodeError, setBankCodeError] = useState(null);
  const [bankCode, setBankCode] = useState(null);
  const [bankAccountNumber, setBankAccountNumber] = useState(null);
  const [bankAccountNumberError, setBankAccountNumberError] = useState(null);
  const [bankAccountName, setBankAccountName] = useState(null);
  const [bankAccountNameError, setBankAccountNameError] = useState(null);
  const requests = useSelector(selectRequests);

  useEffect(() => {
    dispatch(fetchRequests({repairerAPI, status: RequestStatus.APPROVED}));
    dispatch(fetchRequests({repairerAPI, status: RequestStatus.FIXING}));
    dispatch(
      fetchRequests({repairerAPI, status: RequestStatus.PAYMENT_WAITING}),
    );
  }, []);

  useEffect(() => {
    setMoneyInputError(null);
  }, [money]);

  const handleSubmitClick = async () => {
    try {
      setModalVisible(false);
      await dispatch(setIsLoading());
      let body = {
        amount: +removeCommas(money),
        withdrawType: checked,
        bankCode,
        bankAccountNumber,
        bankAccountName,
      };
      let response = await dispatch(
        withdrawMoney({
          repairerAPI,
          body,
        }),
      ).unwrap();
      console.log('response.data: ' + response.data);
      Toast.show({
        type: 'customToast',
        text1: 'G???i y??u c???u r??t ti???n th??nh c??ng',
      });
      navigation.goBack();
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
  };

  const checkBankAccountNumberValid = async () => {
    if (checked === 'CASH') {
      return true;
    }
    if (!bankAccountNumber || bankAccountNumber.trim() === '') {
      setBankAccountNumberError('Kh??ng ???????c b??? tr???ng');
      return false;
    }
    setBankAccountNumberError(null);
    return true;
  };

  const checkBankAccountNameValid = async () => {
    if (checked === 'CASH') {
      return true;
    }
    if (!bankAccountName || bankAccountName.trim() === '') {
      setBankAccountNameError('Kh??ng ???????c b??? tr???ng');
      return false;
    }
    setBankAccountNameError(null);
    return true;
  };

  const checkBankCodeValid = async () => {
    if (checked === 'CASH') {
      return true;
    }
    if (!bankCode || bankCode.trim() === '') {
      setBankCodeError('Kh??ng ???????c b??? tr???ng');
      return false;
    }
    setBankCodeError(null);
    return true;
  };

  const checkMoney = async () => {
    if (money === 0 || +removeCommas(money) <= 0) {
      setMoneyInputError('Vui l??ng nh???p s??? ti???n c???n r??t');
    } else if (+removeCommas(money) > user.balance) {
      setMoneyInputError('S??? ti???n v?????t qu?? s??? d??');
    } else if (
      user.balance - +removeCommas(money) > 0 &&
      user.balance - +removeCommas(money) < 200000
    ) {
      setMoneyInputError('S??? d?? t???i thi???u l?? 200,000 vn??');
    } else if (
      user.balance - +removeCommas(money) === 0 &&
      ((requests.approved && requests.approved.length !== 0) ||
        (requests.fixing && requests.fixing.length !== 0) ||
        (requests.paymentWaiting && requests.paymentWaiting.length !== 0))
    ) {
      setMoneyInputError(
        'B???n ??ang trong qu?? tr??nh s???a y??u c???u kh??c n??n kh??ng th??? r??t h???t ti???n',
      );
    } else {
      setMoneyInputError(null);
      let isBankCodeValid = await checkBankCodeValid();
      let isAccountNumberValid = await checkBankAccountNumberValid();
      let isBankAccountNameValid = await checkBankAccountNameValid();
      if (isBankCodeValid && isAccountNumberValid && isBankAccountNameValid) {
        setModalVisible(true);
      }
    }
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Y??u c???u r??t ti???n"
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
                <Text style={[styles.text, {fontSize: 16}]}>S??? d??: </Text>
                <Text style={[styles.text, {fontSize: 16, color: '#E9AB0D'}]}>
                  {numberWithCommas(user.balance)} VND
                </Text>
              </View>
            </View>
            <Text style={{color: 'black', fontSize: 14, marginVertical: 10}}>
              Nh???p s??? ti???n c???n r??t
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
                onChangeText={newPrice => {
                  setMoney(formatCurrency(newPrice));
                  setMoneyInputError(null);
                }}
                style={styles.textInput}
              />
              <Text style={styles.textBold}>vn??</Text>
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
                  200,000 vn??
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
                  500,000 vn??
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.moneyButton,
                  {
                    backgroundColor:
                      money === formatCurrency(numberWithCommas(user.balance))
                        ? '#FEC54B'
                        : 'white',
                  },
                  {paddingHorizontal: 10},
                ]}
                onPress={() => {
                  setMoney(formatCurrency(numberWithCommas(user.balance)));
                }}>
                <Text style={{color: 'black', fontWeight: '600'}}>
                  {'T???t c???'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.text, {marginVertical: 20}]}>Ngu???n nh???n</Text>
          <TouchableOpacity
            style={[styles.box, {marginBottom: 10}]}
            onPress={() => {
              setChecked('CASH');
            }}>
            <RadioButton
              value="CASH"
              status={checked === 'CASH' ? 'checked' : 'unchecked'}
              color="#FFBC00"
              onPress={() => {
                setChecked('CASH');
              }}
            />
            <Image
              source={require('../../../assets/images/payment_method/cash.png')}
              style={[styles.image, {borderRadius: 0, width: 24, height: 24}]}
            />
            <Text style={styles.text}>Ti???n m???t</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.box, {marginBottom: 10}]}
            onPress={() => {
              setChecked('BANKING');
            }}>
            <RadioButton
              value="BANKING"
              status={checked === 'BANKING' ? 'checked' : 'unchecked'}
              color="#FFBC00"
              onPress={() => {
                setChecked('BANKING');
              }}
            />
            <Image
              source={require('../../../assets/images/payment_method/bank.png')}
              style={[styles.image, {borderRadius: 0, width: 24, height: 26}]}
            />
            <Text style={styles.text}>T??i kho???n ng??n h??ng</Text>
          </TouchableOpacity>
          {checked !== 'CASH' && (
            <View
              style={{
                backgroundColor: '#F0F0F0',
                borderRadius: 10,
                paddingHorizontal: 20,
                marginHorizontal: 10,
                height: 'auto',
                paddingVertical: 20,
              }}>
              <View
                style={[
                  styles.valueSpace,
                  {
                    borderColor: bankCodeError ? '#FF6442' : '#CACACA',
                    marginBottom: 18,
                  },
                ]}>
                <RNPickerSelect
                  value={bankCode ? bankCode : 'Ch???n lo???i y??u c???u'}
                  fixAndroidTouchableBug={true}
                  onValueChange={value => {
                    setBankCode(value);
                    setBankCodeError(null);
                  }}
                  placeholder={{
                    label: 'Ch???n ng??n h??ng',
                    value: null,
                  }}
                  textInputProps={{multiline: true}}
                  pickerProps={{numberOfLines: 2}}
                  useNativeAndroidPickerStyle={false}
                  style={styles.pickerStyle}
                  items={BankType}
                  Icon={() => (
                    <Ionicons
                      name="chevron-down-sharp"
                      size={20}
                      color="black"
                      style={{marginTop: (0.075 * height) / 4}}
                    />
                  )}
                />
                {bankCodeError && (
                  <Text style={styles.errorMessage}>{bankCodeError}</Text>
                )}
              </View>
              <View
                style={[
                  styles.inputField,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    paddingLeft: 20,
                    marginBottom: 18,
                  },
                  bankAccountNumberError ? {borderColor: '#FF6442'} : null,
                ]}>
                <TextInput
                  value={bankAccountNumber}
                  keyboardType="numeric"
                  onFocus={() => setBankAccountNumberError(null)}
                  placeholder="Nh???p s??? t??i kho???n ng??n h??ng"
                  onChangeText={text => setBankAccountNumber(text)}
                  style={[
                    styles.textInput,
                    {width: '100%', fontWeight: 'normal', color: 'black'},
                  ]}
                />
                {bankAccountNumberError && (
                  <Text style={styles.errorMessage}>
                    {bankAccountNumberError}
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.inputField,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    paddingLeft: 20,
                    marginBottom: 10,
                  },
                  bankAccountNameError ? {borderColor: '#FF6442'} : null,
                ]}>
                <TextInput
                  value={bankAccountName}
                  onFocus={() => setBankAccountNameError(null)}
                  placeholder="Nh???p t??n t??i kho???n (kh??ng d???u)"
                  autoCapitalize={'characters'}
                  onChangeText={text => setBankAccountName(text)}
                  style={[
                    styles.textInput,
                    {width: '100%', fontWeight: 'normal', color: 'black'},
                  ]}
                />
                {bankAccountNameError && (
                  <Text style={styles.errorMessage}>
                    {bankAccountNameError}
                  </Text>
                )}
              </View>
            </View>
          )}
        </ScrollView>
        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          modalRatio={
            user.balance - +removeCommas(money + '') === 0 ? 0.46 : 0.38
          }>
          <Text style={[styles.modalText, {marginBottom: 20}]}>
            B???n c?? ch???c ch???n mu???n r??t {money} vn??{' '}
            {checked === 'CASH' ? 'l???y ti???n m???t' : 'v??? t??i kho???n ng??n h??ng'}{' '}
            kh??ng?
          </Text>
          {user.balance - +removeCommas(money + '') === 0 && (
            <Text
              style={{
                color: 'black',
                fontSize: 14,
                alignSelf: 'flex-start',
                marginHorizontal: 10,
                marginVertical: 6,
                fontWeight: 'bold',
              }}>
              * B???n ??ang r??t t???t c??? ti???n n??n s??? kh??ng x??c nh???n ???????c l???ch m???i
            </Text>
          )}
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              alignSelf: 'flex-start',
              marginHorizontal: 10,
              marginVertical: 6,
            }}>
            * Y??u c???u c???a b???n s??? ???????c g???i l??n h??? th???ng cho admin x??t duy???t
          </Text>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              alignSelf: 'flex-start',
              marginHorizontal: 10,
              marginVertical: 6,
            }}>
            * Th???i gian ph???n h???i t???i ??a trong 24 gi???
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 20,
            }}>
            <TouchableOpacity
              style={[styles.button, styles.buttonOpen]}
              onPress={handleSubmitClick}>
              <Text style={styles.textStyle}>X??C NH???N</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>????NG</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
        <Button
          style={{
            marginVertical: 16,
          }}
          onPress={checkMoney}
          buttonText="R??T TI???N"
        />
        <ProgressLoader
          visible={isLoading}
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
  textInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 50,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 6,
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
  valueSpace: {
    height: 'auto',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'white',
    width: '100%',
    color: 'black',
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
  pickerStyle: {
    inputIOS: {
      fontSize: 16,
      color: 'black',
    },
    inputAndroid: {
      fontSize: 16,
      color: 'black',
      marginRight: 20,
      paddingLeft: 0,
      marginLeft: 0,
    },
  },
});

export default WithdrawScreen;
