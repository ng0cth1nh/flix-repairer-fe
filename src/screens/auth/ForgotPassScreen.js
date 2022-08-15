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
const {height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderComponent from '../../components/HeaderComponent';
import BackButton from '../../components/BackButton';
import Button from '../../components/SubmitButton';
import {Context as AuthContext} from '../../context/AuthContext';
import {removeAscent} from '../../utils/util';

export default function ForgotPassScreen({navigation}) {
  const {showLoader, state, resetPassword} = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [coverPassword, setCoverPassword] = useState(true);
  const [repassword, setRepassword] = useState('');
  const [coverRepassword, setCoverRepassword] = useState(true);
  const [passwordInputError, setPasswordInputError] = useState(null);
  const [repasswordInputError, setRePasswordInputError] = useState(null);

  const checkPasswordValid = () => {
    if (password.trim() === '') {
      setPasswordInputError('Không được bỏ trống');
      return false;
    } else if (
      !/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9\s]{6,10}$/.test(
        removeAscent(password.slice()),
      )
    ) {
      setPasswordInputError('Độ dài từ 6 đến 10 ký tự, bao gồm chữ và số');
      return false;
    } else if (password.indexOf(' ') >= 0) {
      setPasswordInputError('Độ dài từ 6 đến 10 ký tự, bao gồm chữ và số');
      return false;
    }
    setPasswordInputError(null);
    return true;
  };

  const checkRepasswordValid = () => {
    if (!repassword || repassword === '') {
      setRePasswordInputError('Không được bỏ trống');
      return false;
    }
    if (!checkPasswordValid()) {
      return true;
    }
    if (repassword !== password && password.trim() !== '') {
      setRePasswordInputError('Mật khẩu không khớp');
      return false;
    }
    setRePasswordInputError(null);
    return true;
  };

  const handleChangePassClick = () => {
    let isPasswordValid = checkPasswordValid();
    let isRepasswordValid = checkRepasswordValid();
    if (isPasswordValid && isRepasswordValid) {
      console.log(password);
      showLoader();
      resetPassword({
        newPassword: password,
        tempAccessToken: state.tempAccessToken,
      });
    }
  };
  return (
    <>
      <HeaderComponent height={0.8 * height} />
      <BackButton onPressHandler={navigation.goBack} color="#FEC54B" />
      <SafeAreaView>
        <View style={styles.loginForm}>
          <Text style={styles.headerText}>Quên Mật Khẩu</Text>
          <View style={{height: '60%'}}>
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
                      coverPassword === true && password.trim() !== ''
                        ? 20
                        : 14,
                  },
                ]}
                secureTextEntry={coverPassword}
                onChangeText={text => setPassword(text)}
                onFocus={() => {
                  setPasswordInputError(null);
                  setRePasswordInputError(null);
                }}
                value={password}
                placeholder="Nhập mật khẩu mới"
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
            </View>
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
                onFocus={() => {
                  setPasswordInputError(null);
                  setRePasswordInputError(null);
                }}
                value={repassword}
                placeholder="Nhập lại mật khẩu mới"
              />
              <TouchableOpacity
                style={styles.iconView}
                onPress={() => setCoverRepassword(!coverRepassword)}>
                {coverRepassword ? (
                  <Icon name="eye" size={18} />
                ) : (
                  <Icon name="eye-slash" size={18} />
                )}
              </TouchableOpacity>
              {repasswordInputError && (
                <Text style={styles.errorMessage}>{repasswordInputError}</Text>
              )}
            </View>
          </View>
          <Button
            style={{marginBottom: 30}}
            onPress={handleChangePassClick}
            buttonText="ĐỔI MẬT KHẨU"
          />
        </View>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  loginForm: {
    marginTop: 0.56 * height,
    width: '100%',
    height: 0.48 * height,
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
});
