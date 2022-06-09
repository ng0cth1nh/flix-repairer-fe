import React, {useState} from 'react';
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
import BackButton from '../../components/BackButton';
import Button from '../../components/Button';

export default function ForgotPassScreen({navigation}) {
  const [password, setPassword] = useState('');
  const [coverPassword, setCoverPassword] = useState(true);
  const [repassword, setRepassword] = useState('');
  const [coverRepassword, setCoverRepassword] = useState(true);
  const [passwordInputError, setPasswordInputError] = useState(null);
  const [repasswordInputError, setRePasswordInputError] = useState(null);
  const checkPasswordValid = () => {
    if (password.trim() === '') {
      setPasswordInputError('Vui lòng nhập mật khẩu!');
      return false;
    } else if (password.length < 6 || password.length > 10) {
      setPasswordInputError('Mật khẩu phải từ 6 đến 10 kí tự!');
      return false;
    } else if (password.indexOf(' ') >= 0) {
      setPasswordInputError('Mật khẩu không bao gồm khoảng trắng!');
      return false;
    }
    setPasswordInputError(null);
    return true;
  };
  const checkRepasswordValid = () => {
    if (repassword !== password && password.trim() !== '') {
      setRePasswordInputError('Mật khẩu nhập lại không khớp!');
      return false;
    }
    setRePasswordInputError(null);
    return true;
  };
  const changePassHandler = () => {
    let isPasswordValid = checkPasswordValid();
    let isRepasswordValid = checkRepasswordValid();
    if (isPasswordValid && isRepasswordValid) {
      // do smth
    }
  };
  return (
    <>
      <HeaderComponent height={0.55 * height} />
      <BackButton onPressHandler={navigation.goBack} color="#FEC54B" />
      <SafeAreaView>
        <Card cornerRadius={20} elevation={10} style={styles.loginForm}>
          <Text style={styles.headerText}>Đổi Mật Khẩu</Text>
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
              secureTextEntry={coverPassword}
              onChangeText={text => setPassword(text)}
              value={password}
              placeholder="Mật khẩu"
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
          <View
            style={[
              styles.inputView,
              {borderColor: repasswordInputError ? '#FF6442' : '#CACACA'},
            ]}>
            <TextInput
              style={[
                styles.input,
                {
                  fontSize:
                    coverRepassword === true && password.trim() !== ''
                      ? 20
                      : 14,
                },
              ]}
              secureTextEntry={coverRepassword}
              onChangeText={text => setRepassword(text)}
              value={repassword}
              placeholder="Nhập lại mật khẩu"
            />
            <TouchableOpacity
              style={styles.iconView}
              onPress={() => setCoverRepassword(!coverRepassword)}>
              <Icon name="eye-slash" size={18} />
            </TouchableOpacity>
          </View>
          {repasswordInputError && (
            <Text style={styles.errorMessage}>{repasswordInputError}</Text>
          )}
          <Button
            style={{marginBottom: 30}}
            onPress={changePassHandler}
            buttonText="ĐỔI MẬT KHẨU"
          />
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
});
