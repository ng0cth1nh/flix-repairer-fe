import React, {useState} from 'react';
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

import Icon from 'react-native-vector-icons/Ionicons';
import BackButton from '../../components/BackButton';
const {width, height} = Dimensions.get('window');
export default function ConfirmOTPScreen({route, navigation}) {
  const {phone, avatar} = route.params;
  const [code, setCode] = useState('');

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
        <OTPInputView
          style={styles.otpView}
          pinCount={6}
          onCodeChanged={pin => {
            setCode(pin);
            console.log(code);
          }}
          autoFocusOnLoad
          codeInputFieldStyle={styles.otpTextStyle}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
        />
        <Text style={styles.resendOTP}>Gửi lại mã(16 giây)</Text>
        <View style={styles.continueContainer}>
          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.buttonText}>TIẾP TỤC</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1},
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
    width: '50%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#CACACA',
  },
  phoneText: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  otpInstruction: {
    width: '90%',
    alignSelf: 'center',
    paddingBottom: 30,
    paddingTop: 20,
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
  },
  otpView: {
    width: '70%',
    alignSelf: 'center',
    height: 0.08 * width,
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
  },
  continueContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  continueButton: {
    marginBottom: 30,
    width: '80%',
    height: 0.075 * height,
    borderRadius: 30,
    backgroundColor: '#FEC54B',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
});
