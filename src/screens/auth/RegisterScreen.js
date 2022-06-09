import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import ImagePicker from 'react-native-image-crop-picker';
const {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import BackButton from '../../components/BackButton';
import HeaderComponent from '../../components/HeaderComponent';
import RNPickerSelect from 'react-native-picker-select';
import {Context as AuthContext} from '../../context/AuthContext';
import constants from '../../constants/Api';
import Button from '../../components/Button';
import axios from 'axios';

function removeAscent(str) {
  if (str === null || str === undefined) {
    return str;
  }
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  return str;
}

export default function RegisterScreen({navigation}) {
  const {register, state, clearErrorMessage} = useContext(AuthContext);
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [cityId, setCityId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [communeId, setCommuneId] = useState(null);
  const [password, setPassword] = useState('');
  const [coverPassword, setCoverPassword] = useState(true);
  const [repassword, setRepassword] = useState('');
  const [coverRepassword, setCoverRepassword] = useState(true);
  const [usernameInputError, setUsernameInputError] = useState(null);
  const [phoneInputError, setPhoneInputError] = useState(null);
  const [passwordInputError, setPasswordInputError] = useState(null);
  const [repasswordInputError, setRePasswordInputError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [listCity, setListCity] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listCommune, setListCommune] = useState([]);
  useEffect(() => {
    console.log(constants.GET_ALL_CITY_API);
    (async () => {
      try {
        let response = await axios.get(constants.GET_ALL_CITY_API);
        setListCity(response.data.cities);
      } catch (err) {
        setAddressError(err.message);
      }
    })();
  }, []);

  const selectAvatar = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log(image);
        setAvatar(image);
      })
      .catch(err => {
        console.log(err);
      });
  };
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
  const checkAddressValid = () => {
    if (cityId && districtId && communeId) {
      setAddressError(null);
      return true;
    }
    setAddressError('Vui lòng chọn đầy đủ thông tin địa chỉ của bạn!');
    return false;
  };
  const checkRepasswordValid = () => {
    if (repassword !== password && password.trim() !== '') {
      setRePasswordInputError('Mật khẩu nhập lại không khớp!');
      return false;
    }
    setRePasswordInputError(null);
    return true;
  };
  const checkUsernameValid = () => {
    if (username.trim() === '') {
      setUsernameInputError('Vui lòng nhập tên của bạn');
      return false;
    } else if (!/^[a-zA-Z\s]{3,}$/.test(removeAscent(username.slice()))) {
      setUsernameInputError(
        'Họ và Tên từ 3 ký tự trở lên không bao gồm số và kí tự đặc biệt!',
      );
      return false;
    }
    setUsernameInputError(null);
    return true;
  };

  const onchangeCity = async value => {
    setCityId(value);
    setDistrictId(null);
    setCommuneId(null);
    if (!value) {
      setListDistrict([]);
      setListCommune([]);
      return;
    }
    try {
      let response = await axios.get(constants.GET_DISTRICT_BY_CITY_API, {
        params: {cityId: value},
      });
      setListDistrict(response.data.districts);
    } catch (err) {
      setAddressError(err.message);
    }
  };
  const onchangeDistrict = async value => {
    setDistrictId(value);
    setCommuneId(null);
    if (!value) {
      setListCommune([]);
      return;
    }
    try {
      let response = await axios.get(constants.GET_COMMUNE_BY_DISTRICT_API, {
        params: {districtId: value},
      });
      setListCommune(response.data.communes);
    } catch (err) {
      setAddressError(err.message);
    }
  };
  const registerHandler = () => {
    if (state.errorMessage !== '') {
      clearErrorMessage();
    }
    let isUsernameValid = checkUsernameValid();
    let isAddressValid = checkAddressValid();
    let isPhoneValid = checkPhoneNumberValid();
    let isPasswordValid = checkPasswordValid();
    let isRepasswordValid = checkRepasswordValid();
    if (
      (isUsernameValid,
      isAddressValid && isPasswordValid && isPhoneValid && isRepasswordValid)
    ) {
      register({
        avatar,
        fullName: username,
        phone: phoneNumber,
        password,
        cityId,
        districtId,
        communeId,
        streetAddress: homeAddress,
      });
    }
  };

  return (
    <>
      <HeaderComponent height={0.55 * height} />
      <BackButton onPressHandler={navigation.goBack} color="#FEC54B" />
      <SafeAreaView>
        <Card cornerRadius={20} elevation={10} style={styles.registerForm}>
          <ScrollView style={styles.scrollView}>
            <ImageBackground
              source={
                avatar === null
                  ? require('../../../assets/images/login_register_bg/default_avatar.png')
                  : {uri: avatar.path}
              }
              style={styles.avatar}
              resizeMode="cover">
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={selectAvatar}>
                <Image
                  source={require('../../../assets/images/login_register_bg/camera_icon.png')}
                />
              </TouchableOpacity>
            </ImageBackground>
            <Text style={styles.headerText}>Đăng Ký Tài Khoản</Text>
            <Text style={styles.inputTittle}>Họ và tên*</Text>
            <View
              style={[
                styles.inputView,
                {borderColor: usernameInputError ? '#FF6442' : '#CACACA'},
              ]}>
              <TextInput
                style={styles.input}
                onChangeText={text => setUsername(text)}
                value={username}
              />
            </View>
            {usernameInputError && (
              <Text style={styles.errorMessage}>{usernameInputError}</Text>
            )}
            <Text style={styles.inputTittle}>Số điện thoại*</Text>
            <View
              style={[
                styles.inputView,
                {borderColor: phoneInputError ? '#FF6442' : '#CACACA'},
              ]}>
              <TextInput
                style={styles.input}
                onChangeText={text => setPhoneNumber(text)}
                value={phoneNumber}
                keyboardType="number-pad"
              />
            </View>
            {phoneInputError && (
              <Text style={styles.errorMessage}>{phoneInputError}</Text>
            )}
            <Text style={styles.inputTittle}>Địa chỉ*</Text>
            <View style={styles.addressPicker}>
              <View style={styles.addressSelectItem}>
                <RNPickerSelect
                  value={cityId}
                  fixAndroidTouchableBug={true}
                  onValueChange={onchangeCity}
                  placeholder={{
                    label: 'Tỉnh/Thành Phố',
                    value: null,
                  }}
                  useNativeAndroidPickerStyle={false}
                  style={styles.pickerStyle}
                  items={listCity}
                  Icon={() => (
                    <Icon
                      name="caret-down"
                      size={20}
                      color="#E67F1E"
                      style={{marginTop: (0.075 * height) / 4, marginRight: 5}}
                    />
                  )}
                />
              </View>
              <View style={styles.addressSelectItem}>
                <RNPickerSelect
                  value={districtId}
                  fixAndroidTouchableBug={true}
                  onValueChange={onchangeDistrict}
                  items={listDistrict}
                  placeholder={{
                    label: 'Quận/Huyện',
                    value: null,
                  }}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => (
                    <Icon
                      name="caret-down"
                      size={20}
                      color="#E67F1E"
                      style={{marginTop: (0.075 * height) / 4, marginRight: 5}}
                    />
                  )}
                  style={styles.pickerStyle}
                />
              </View>
              <View style={styles.addressSelectItem}>
                <RNPickerSelect
                  value={communeId}
                  fixAndroidTouchableBug={true}
                  onValueChange={value => {
                    setCommuneId(value);
                  }}
                  items={listCommune}
                  placeholder={{
                    label: 'Phường/Xã',
                    value: null,
                  }}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => (
                    <Icon
                      name="caret-down"
                      size={20}
                      color="#E67F1E"
                      style={{marginTop: (0.075 * height) / 4, marginRight: 5}}
                    />
                  )}
                  style={styles.pickerStyle}
                />
              </View>
            </View>
            {addressError && (
              <Text style={styles.errorMessage}>{addressError}</Text>
            )}

            <View style={styles.inputView}>
              <TextInput
                style={styles.input}
                placeholder="Địa chỉ nhà"
                onChangeText={text => setHomeAddress(text)}
                value={homeAddress}
              />
            </View>
            <Text style={styles.inputTittle}>Mật khẩu*</Text>
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
                value={password}
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
            <Text style={styles.inputTittle}>Nhập lại mật khẩu*</Text>
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
            {state.errorMessage !== '' && (
              <Text style={styles.errorMessage}>{state.errorMessage}</Text>
            )}

            <View style={styles.termContainer}>
              <Text>Bằng việc nhấn đăng ký là bạn đã chấp nhận</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.push('TermsOfUseScreen');
                }}>
                <Text style={styles.termLink}>điều khoản</Text>
              </TouchableOpacity>
              <Text> sử dụng</Text>
            </View>
            <Button
              style={{marginTop: 20}}
              onPress={registerHandler}
              buttonText="ĐĂNG KÝ"
            />
            <TouchableOpacity style={styles.loginView}>
              <Text style={styles.loginText}>Bạn đã có tài khoản? </Text>
              <Text
                style={[styles.loginText, {textDecorationLine: 'underline'}]}>
                Đăng nhập
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Card>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  registerForm: {
    width: '100%',
    height: 0.75 * height,
    marginTop: 0.25 * height,
    position: 'absolute',
    shadowOffset: {width: 5, height: 5},
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  scrollView: {
    width: '100%',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
  },
  avatar: {
    width: width * 0.3,
    aspectRatio: 1,
    borderRadius: width * 0.15,
    alignSelf: 'center',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  cameraButton: {
    width: width * 0.3 * 0.3,
    aspectRatio: 1,
    backgroundColor: '#D9D9D9',
    borderRadius: width * 0.15 * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
  },
  inputTittle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
  },
  inputView: {
    marginTop: 10,
    height: 0.075 * height,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#CACACA',
    paddingLeft: 18,
    paddingRight: 18,
    fontSize: 15,
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    alignItems: 'center',
  },
  iconView: {
    height: '100%',
    width: '12%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  addressSelectItem: {
    width: '32%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#CACACA',
    borderRadius: 30,
  },
  addressPicker: {
    marginTop: 20,
    height: 0.075 * height,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerStyle: {
    inputIOS: {
      fontSize: 11,
      textAlign: 'center',
      borderRadius: 30,
      marginRight: 15,
    },
    inputAndroid: {
      fontSize: 11,
      textAlign: 'center',
      borderRadius: 30,
      marginRight: 15,
    },
    width: '50%',
  },

  termContainer: {
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },

  termLink: {
    fontWeight: 'bold',
    color: '#FEC54B',
  },
  loginView: {
    width: '100%',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 40,
  },
  loginText: {
    color: '#E67F1E',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF6442',
    paddingLeft: 20,
  },
});
