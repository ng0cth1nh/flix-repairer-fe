import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {Context as AuthContext} from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import BackButton from '../../components/BackButton';
import Button from '../../components/SubmitButton';
const {width} = Dimensions.get('window');
export default function ConfirmOTPScreen({route, navigation}) {
  const {
    confirmOTP,
    state,
    clearErrorMessage,
    showLoader,
    reRegister,
    confirmOTPForgotPassword,
    reSendOTPForgotPassword,
  } = useContext(AuthContext);
  const {phone, type} = route.params;
  const [code, setCode] = useState('');
  const handleConfirmOTP = () => {
    if (state.errorMessage !== '') {
      clearErrorMessage();
    }
    showLoader();
    if (type === 'REGISTER') {
      confirmOTP({...route.params, otp: code});
    } else {
      confirmOTPForgotPassword({...route.params, otp: code});
    }
  };

  const Ref = useRef(null);
  const [timer, setTimer] = useState('00:00:60');
  const getTimeRemaining = e => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = e => {
    let {total, hours, minutes, seconds} = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (hours > 9 ? hours : '0' + hours) +
          ':' +
          (minutes > 9 ? minutes : '0' + minutes) +
          ':' +
          (seconds > 9 ? seconds : '0' + seconds),
      );
    }
  };
  const clearTimer = e => {
    setTimer('00:00:60');
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 60);
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  const handleResendOTP = () => {
    if (state.errorMessage !== '') {
      clearErrorMessage();
    }
    clearTimer(getDeadTime());
    showLoader();
    if (type === 'REGISTER') {
      reRegister({
        ...route.params,
      });
    } else {
      reSendOTPForgotPassword({
        ...route.params,
      });
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <BackButton onPressHandler={navigation.goBack} color="#FEC54B" />
      <SafeAreaView style={styles.container}>
        <View style={styles.logoArea}>
          <View style={styles.logo}>
            <Image
              style={styles.imageLogo}
              source={require('../../../assets/images/logo/logo.png')}
            />
          </View>
        </View>
        <View style={styles.phoneNumberView}>
          <Icon name="phone-portrait-outline" color="black" size={28} />
          <Text style={styles.phoneText}>{phone}</Text>
        </View>
        <Text style={styles.otpInstruction}>
          Vui lòng nhập mã xác thực được gửi về số điện thoại của bạn
        </Text>
        <View>
          <OTPInputView
            style={styles.otpView}
            pinCount={6}
            onCodeChanged={pin => {
              setCode(pin);
            }}
            autoFocusOnLoad
            codeInputFieldStyle={styles.otpTextStyle}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
          />
          {state.errorMessage !== '' && (
            <Text
              style={{
                alignSelf: 'center',
                bottom: -10,
                width: '60%',
                position: 'absolute',
                fontSize: 10,
                color: '#FF6442',
                textAlign: 'center',
              }}>
              {state.errorMessage}
            </Text>
          )}
        </View>
        {timer !== '00:00:00' ? (
          <Text style={styles.resendOTP}>
            Gửi lại mã ({timer.substring(6, 9)} giây)
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResendOTP}>
            <Text
              style={[
                styles.resendOTP,
                {color: '#FEC54B', fontWeight: 'bold'},
              ]}>
              Gửi lại mã
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.continueContainer}>
          <Button
            style={{marginBottom: 30, width: '92%', alignSelf: 'center'}}
            onPress={handleConfirmOTP}
            buttonText="TIẾP TỤC"
          />
        </View>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  logoArea: {
    width: '100%',
    height: '25%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  logo: {
    width: '25%',
    aspectRatio: 1,
  },
  imageLogo: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  phoneNumberView: {
    height: 'auto',
    width: 'auto',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingBottom: 8,
    backgroundColor: '#CACACA',
  },
  phoneText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  otpInstruction: {
    width: '90%',
    alignSelf: 'center',
    paddingBottom: 30,
    paddingTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
  },
  otpView: {
    width: '70%',
    alignSelf: 'center',
    height: 0.04 * width,
    marginBottom: 40,
  },
  otpTextStyle: {
    width: 0.1 * width,
    height: 0.1 * width,
    borderRadius: width * 0.05,
    borderWidth: 1,
    borderColor: '#CACACA',
    color: 'black',
    fontWeight: 'bold',
  },
  underlineStyleHighLighted: {
    borderColor: '#FEC54B',
  },
  resendOTP: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#888B96',
    marginTop: 20,
  },
  continueContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  errorMessage: {
    position: 'absolute',
    bottom: 6,
    left: width * 0.22,
    fontSize: 12,
    color: '#FF6442',
  },
});
