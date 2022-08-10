import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
const {height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderComponent from '../../components/HeaderComponent';
import Button from '../../components/SubmitButton';
import {Context as AuthContext} from '../../context/AuthContext';
import ProgressLoader from 'rn-progress-loader';
import Toast from 'react-native-toast-message';
import {removeAscent} from '../../utils/util';

export default function LoginScreen({navigation}) {
  const {
    login,
    showLoader,
    state,
    sendOTPForgotPassword,
    clearErrorMessage,
    clearIsChangePassSuccess,
  } = useContext(AuthContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [phoneInputError, setPhoneInputError] = useState(null);
  const [passwordInputError, setPasswordInputError] = useState(null);
  const [coverPassword, setCoverPassword] = useState(true);
  const [isForgotPass, setIsForgotPass] = useState(false);

  useEffect(() => {
    (async () => {
      if (state.isChangePassSuccess) {
        Toast.show({
          type: 'customToast',
          text1: 'Đổi mật khẩu thành công',
        });
        clearIsChangePassSuccess();
      }
    })();
  }, []);

  const checkPhoneNumberValid = type => {
    if (phoneNumber.trim() === '') {
      if (type === 'LOGIN') {
        setPhoneInputError('Không được bỏ trống');
      } else {
        setPhoneInputError('Nhập số điện thoại trước khi bấm quên mật khẩu');
      }
      return false;
    } else if (!/(03|05|07|08|09|01[2|6|8|9])([0-9]{8})\b/.test(phoneNumber)) {
      setPhoneInputError('Số điện thoại không hợp lệ');
      return false;
    }
    setPhoneInputError(null);
    return true;
  };

  const checkPasswordValid = () => {
    if (password.trim() === '') {
      setPasswordInputError('Không được bỏ trống');
      return false;
    } else if (!/^[a-zA-Z0-9\s]{6,10}$/.test(removeAscent(password.slice()))) {
      setPasswordInputError('Độ dài từ 6 đến 10 ký tự, bao gồm chữ và số');
      return false;
    } else if (password.indexOf(' ') >= 0) {
      setPasswordInputError('Độ dài từ 6 đến 10 ký tự, bao gồm chữ và số');
      return false;
    }
    setPasswordInputError(null);
    return true;
  };

  const handleLoginClick = () => {
    if (state.errorMessage !== '') {
      clearErrorMessage();
    }
    let phoneValid = checkPhoneNumberValid('LOGIN');
    let passwordValid = checkPasswordValid();
    const isValidForm = phoneValid && passwordValid;
    if (isValidForm) {
      showLoader();
      login({username: phoneNumber, password, roleType: 'REPAIRER'});
    }
  };

  const handleForgotPasswordClick = () => {
    let phoneValid = checkPhoneNumberValid('FORGOT');
    if (phoneValid) {
      showLoader();
      setIsForgotPass(true);
      clearErrorMessage();
      sendOTPForgotPassword({
        phone: phoneNumber,
        type: 'FORGOT_PASSWORD',
        roleType: 'REPAIRER',
      });
    }
  };

  return (
    <>
      <HeaderComponent height={0.8 * height} />
      <SafeAreaView>
        <View style={styles.loginForm}>
          <Text style={styles.headerText}>Đăng nhập</Text>
          <View
            style={[
              styles.inputView,
              {
                borderColor:
                  phoneInputError || (state.errorMessage && isForgotPass)
                    ? '#FF6442'
                    : '#CACACA',
              },
            ]}>
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              textContentType="telephoneNumber"
              onChangeText={text => setPhoneNumber(text)}
              onFocus={() => {
                setPhoneInputError(null);
                clearErrorMessage();
                setIsForgotPass(false);
              }}
              defaultValue={phoneNumber}
              keyboardType="number-pad"
            />
            {(phoneInputError && !isForgotPass) ||
            (!phoneInputError && isForgotPass && state.errorMessage) ? (
              <Text style={styles.errorMessage}>
                {phoneInputError ? phoneInputError : state.errorMessage}
              </Text>
            ) : null}
          </View>
          <View
            style={[
              styles.inputView,
              {
                borderColor:
                  passwordInputError || (state.errorMessage && !isForgotPass)
                    ? '#FF6442'
                    : '#CACACA',
              },
            ]}>
            <TextInput
              style={[
                styles.input,
                {
                  fontSize:
                    coverPassword === true && password.trim() !== '' ? 20 : 14,
                },
              ]}
              placeholder="Mật khẩu"
              secureTextEntry={coverPassword}
              onFocus={() => {
                setPasswordInputError(null);
                clearErrorMessage();
              }}
              onChangeText={text => setPassword(text)}
              defaultValue={password}
            />
            <TouchableOpacity
              style={styles.iconView}
              onPress={() => setCoverPassword(!coverPassword)}>
              {coverPassword ? (
                <Icon name="eye" size={18} />
              ) : (
                <Icon name="eye-slash" size={18} />
              )}
            </TouchableOpacity>
            {passwordInputError && (
              <Text style={styles.errorMessage}>{passwordInputError}</Text>
            )}
            {state.errorMessage !== '' && !isForgotPass ? (
              <Text style={styles.errorMessage}>{state.errorMessage}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.forgotPassView}
            onPress={handleForgotPasswordClick}>
            <Text style={styles.forgotPassText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          <Button
            style={{marginTop: 10}}
            onPress={handleLoginClick}
            buttonText="ĐĂNG NHẬP"
          />

          <View style={styles.registerView}>
            <Text style={[styles.registerText, {color: 'black'}]}>
              Bạn chưa có tài khoản?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.push('RegisterScreen')}>
              <Text
                style={[
                  styles.registerText,
                  {textDecorationLine: 'underline'},
                ]}>
                Đăng ký
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <ProgressLoader
        visible={state.loading ? state.loading : false}
        isModal={true}
        isHUD={true}
        hudColor={'#FEC54B'}
        color={'#000000'}
      />
    </>
  );
}
const styles = StyleSheet.create({
  loginForm: {
    marginTop: 0.45 * height,
    width: '100%',
    height: 0.75 * height,
    position: 'absolute',
    paddingTop: 15,
    paddingHorizontal: '8%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  inputView: {
    marginTop: (0.075 * height) / 2,
    height: 0.075 * height,
    borderRadius: 30,
    borderWidth: 1,
    paddingLeft: 18,
    paddingRight: 18,
    fontSize: 15,
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    alignItems: 'center',
  },
  errorMessage: {
    position: 'absolute',
    bottom: -14,
    left: 5,
    fontSize: 10,
    color: '#FF6442',
  },
  iconView: {
    height: '100%',
    width: '12%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  forgotPassView: {
    width: '100%',
    marginTop: (0.075 * height) / 3,
    alignItems: 'center',
  },
  forgotPassText: {
    color: '#E67F1E',
  },
  registerView: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#E67F1E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
