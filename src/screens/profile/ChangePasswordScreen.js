import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import SubmitButton from '../../components/SubmitButton';
import TopHeaderComponent from '../../components/TopHeaderComponent';
import ApiConstants from '../../constants/Api';
import useAxios from '../../hooks/useAxios';
import getErrorMessage from '../../utils/getErrorMessage';
import ProgressLoader from 'rn-progress-loader';

const ChangePasswordScreen = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [coverPassword, setCoverPassword] = useState(true);
  const [coverNewPassword, setCoverNewPassword] = useState(true);
  const [coverReNewPassword, setCoverReNewPassword] = useState(true);
  const [newPasswordInputError, setNewPasswordInputError] = useState(null);
  const [passwordInputError, setPasswordInputError] = useState(null);
  const [reNewPasswordInputError, setReNewPasswordInputError] = useState(null);
  const repairerAPI = useAxios();
  const [loading, setLoading] = useState(false);

  const checkPasswordValid = () => {
    if (password.trim() === '') {
      setPasswordInputError('Vui lòng nhập mật khẩu hiện tại');
      return false;
    }
    setPasswordInputError(null);
    return true;
  };

  const checkNewPasswordValid = () => {
    if (newPassword.trim() === '') {
      setNewPasswordInputError('Vui lòng nhập mật khẩu mới');
      return false;
    } else if (
      !/((?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,10})\b/.test(newPassword)
    ) {
      setNewPasswordInputError(
        'Mật khẩu phải từ 6 đến 10 kí tự và bao gồm ít nhất 1 số hoặc 1 kí tự',
      );
      return false;
    } else if (newPassword.indexOf(' ') >= 0) {
      setNewPasswordInputError('Mật khẩu không bao gồm khoảng trắng');
      return false;
    }
    setNewPasswordInputError(null);
    return true;
  };

  const checkReNewPasswordValid = () => {
    if (reNewPassword !== newPassword && newPassword.trim() !== '') {
      setReNewPasswordInputError('Mật khẩu nhập lại không khớp');
      return false;
    }
    setReNewPasswordInputError(null);
    return true;
  };

  const handleChangePassword = async () => {
    if (
      checkPasswordValid() &&
      checkNewPasswordValid() &&
      checkReNewPasswordValid()
    ) {
      try {
        await setLoading(true);
        const body = {
          oldPassword: password,
          newPassword,
        };
        const response = await repairerAPI.put(
          ApiConstants.CHANGE_PASSWORD_API,
          JSON.stringify(body),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (response.status === 200) {
          Toast.show({
            type: 'customToast',
            text1: 'Đổi mật khẩu thành công',
          });
          navigation.goBack();
        }
      } catch (err) {
        setPasswordInputError(getErrorMessage(err));
      } finally {
        await setLoading(false);
      }
    }
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Đổi mật khẩu"
        isBackButton={true}
        statusBarColor="white"
      />
      <SafeAreaView style={{flex: 1, marginHorizontal: '4%'}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{paddingTop: 10}}>
          <View style={styles.inputField}>
            <Text style={styles.inputLabel}>Nhập mật khẩu hiện tại *</Text>
            <View
              style={[
                styles.valueSpace,
                passwordInputError
                  ? {borderColor: '#FF6442', borderWidth: 1}
                  : null,
              ]}>
              <TextInput
                style={[
                  styles.valueText,
                  {
                    fontSize:
                      coverPassword === true && password.trim() !== ''
                        ? 20
                        : 14,
                  },
                ]}
                secureTextEntry={coverPassword}
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
            </View>
            {passwordInputError && (
              <Text style={styles.errorMessage}>{passwordInputError}</Text>
            )}
          </View>
          <View style={styles.inputField}>
            <Text style={styles.inputLabel}>Nhập mật khẩu mới *</Text>
            <View
              style={[
                styles.valueSpace,
                newPasswordInputError
                  ? {borderColor: '#FF6442', borderWidth: 1}
                  : null,
              ]}>
              <TextInput
                style={[
                  styles.valueText,
                  {
                    fontSize:
                      coverNewPassword === true && newPassword.trim() !== ''
                        ? 20
                        : 14,
                  },
                ]}
                secureTextEntry={coverNewPassword}
                onChangeText={text => setNewPassword(text)}
                defaultValue={newPassword}
              />
              <TouchableOpacity
                style={styles.iconView}
                onPress={() => setCoverNewPassword(!coverNewPassword)}>
                {coverNewPassword ? (
                  <Icon name="eye" size={18} />
                ) : (
                  <Icon name="eye-slash" size={18} />
                )}
              </TouchableOpacity>
            </View>
            {newPasswordInputError && (
              <Text style={styles.errorMessage}>{newPasswordInputError}</Text>
            )}
          </View>
          <View style={styles.inputField}>
            <Text style={styles.inputLabel}>Nhập lại mật khẩu mới *</Text>
            <View
              style={[
                styles.valueSpace,
                reNewPasswordInputError
                  ? {borderColor: '#FF6442', borderWidth: 1}
                  : null,
              ]}>
              <TextInput
                style={[
                  styles.valueText,
                  {
                    fontSize:
                      coverReNewPassword === true && reNewPassword.trim() !== ''
                        ? 20
                        : 14,
                  },
                ]}
                secureTextEntry={coverReNewPassword}
                onChangeText={text => setReNewPassword(text)}
                defaultValue={reNewPassword}
              />
              <TouchableOpacity
                style={styles.iconView}
                onPress={() => setCoverReNewPassword(!coverReNewPassword)}>
                {coverReNewPassword ? (
                  <Icon name="eye" size={18} />
                ) : (
                  <Icon name="eye-slash" size={18} />
                )}
              </TouchableOpacity>
            </View>
            {reNewPasswordInputError && (
              <Text style={styles.errorMessage}>{reNewPasswordInputError}</Text>
            )}
          </View>
        </ScrollView>
        <SubmitButton
          style={{
            marginVertical: 8,
            width: '100%',
            alignSelf: 'center',
          }}
          onPress={handleChangePassword}
          buttonText="ĐỔI MẬT KHẨU"
        />
        <ProgressLoader
          visible={loading}
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
    borderBottomWidth: 1,
    borderBottomColor: '#CACACA',
    width: '100%',
    marginBottom: 10,
  },
  box: {
    borderRadius: 20,
    paddingHorizontal: '4%',
  },
  boxHeader: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  tittleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginLeft: 15,
  },
  inputField: {marginVertical: 6},
  inputLabel: {
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    fontSize: 14,
  },
  valueSpace: {
    height: 'auto',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderColor: '#F0F0F0',
    borderWidth: 1,
  },
  valueText: {
    fontSize: 20,
    color: 'black',
    flex: 15,
  },
  pickerStyle: {
    inputIOS: {
      fontSize: 16,
      color: 'black',
    },
    inputAndroid: {
      fontSize: 16,
      color: 'black',
    },
  },
  iconView: {
    flex: 1,
  },
  errorMessage: {
    position: 'absolute',
    bottom: -14,
    left: 5,
    fontSize: 10,
    color: '#FF6442',
  },
});

export default ChangePasswordScreen;
