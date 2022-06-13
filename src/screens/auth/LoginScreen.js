import React, {useState, useContext} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Card} from 'react-native-shadow-cards';
const {height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderComponent from '../../components/HeaderComponent';
import Button from '../../components/SubmitButton';
import {Context as AuthContext} from '../../context/AuthContext';

export default function LoginScreen({navigation}) {
  const {login, state, clearErrorMessage} = useContext(AuthContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [phoneInputError, setPhoneInputError] = useState(null);
  const [passwordInputError, setPasswordInputError] = useState(null);
  const [coverPassword, setCoverPassword] = useState(true);
  const checkPhoneNumberValid = () => {
    if (phoneNumber.trim() === '') {
      setPhoneInputError('Vui lòng nhập số điện thoại!');
      return false;
    } else if (!/(03|05|07|08|09|01[2|6|8|9])([0-9]{8})\b/.test(phoneNumber)) {
      setPhoneInputError('Số điện thoại không đúng!');
      return false;
    }
    setPhoneInputError(null);
    return true;
  };
  const checkPasswordValid = () => {
    if (password.trim() === '') {
      setPasswordInputError('Vui lòng nhập mật khẩu!');
      return false;
    } else if (!/((?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,10})\b/.test(password)) {
      setPasswordInputError(
        'Mật khẩu phải từ 6 đến 10 kí tự và bao gồm ít nhất 1 số hoặc 1 kí tự!',
      );
      return false;
    } else if (password.indexOf(' ') >= 0) {
      setPasswordInputError('Mật khẩu không bao gồm khoảng trắng!');
      return false;
    }
    setPasswordInputError(null);
    return true;
  };
  const loginHandler = () => {
    if (state.errorMessage !== '') {
      clearErrorMessage();
    }
    let phoneValid = checkPhoneNumberValid();
    let passwordValid = checkPasswordValid();
    const isValidForm = phoneValid && passwordValid;
    if (isValidForm) {
      login({username: phoneNumber, password});
    }
  };

  return (
    <>
      <HeaderComponent height={0.55 * height} />
      <SafeAreaView>
        <Card cornerRadius={20} elevation={10} style={styles.loginForm}>
          <Text style={styles.headerText}>Đăng nhập</Text>
          <View
            style={[
              styles.inputView,
              {borderColor: phoneInputError ? '#FF6442' : '#CACACA'},
            ]}>
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              textContentType="telephoneNumber"
              onChangeText={text => setPhoneNumber(text)}
              defaultValue={phoneNumber}
              keyboardType="number-pad"
            />
          </View>
          {phoneInputError && (
            <Text style={styles.errorMessage}>{phoneInputError}</Text>
          )}
          {/* <ActivityIndicator size="large" animating={true} /> */}
          <View
            style={[
              styles.inputView,
              {borderColor: passwordInputError ? '#FF6442' : '#CACACA'},
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
              onChangeText={text => setPassword(text)}
              defaultValue={password}
            />
            <TouchableOpacity
              style={styles.iconView}
              onPress={() => setCoverPassword(!coverPassword)}>
              <Icon name="eye-slash" size={18} />
            </TouchableOpacity>
          </View>
          {passwordInputError && (
            <Text style={styles.errorMessage}>{passwordInputError}</Text>
          )}
          {state.errorMessage !== '' && (
            <Text style={styles.errorMessage}>{state.errorMessage}</Text>
          )}
          <TouchableOpacity
            style={styles.forgotPassView}
            onPress={() => {
              navigation.push('ForgotPassScreen');
            }}>
            <Text style={styles.forgotPassText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          <Button
            style={{marginTop: 10}}
            onPress={loginHandler}
            buttonText="ĐĂNG NHẬP"
          />
          <View style={styles.registerView}>
            <Text style={styles.registerText}>Bạn chưa có tài khoản? </Text>
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
        </Card>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  loginForm: {
    marginTop: 0.45 * height,
    width: '100%',
    height: 0.55 * height,
    position: 'absolute',
    paddingTop: 15,
    shadowOffset: {width: 5, height: 5},
    paddingLeft: 40,
    paddingRight: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
    fontSize: 12,
    color: '#FF6442',
    paddingLeft: 20,
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
});
