import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';
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
  FlatList,
} from 'react-native';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NotFound from '../../components/NotFound';
import {RadioButton} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
const {height, width} = Dimensions.get('window');
import AppIntroSlider from 'react-native-app-intro-slider';
import {Context as AuthContext} from '../../context/AuthContext';
import BackButton from '../../components/BackButton';
import HeaderComponent from '../../components/HeaderComponent';
import constants from '../../constants/Api';
import DocumentPicker from 'react-native-document-picker';
import {removeAscent} from '../../utils/util';
import ProgressLoader from 'rn-progress-loader';
import Button from '../../components/SubmitButton';
import SearchForm from '../../components/SearchForm';
import useAxios from '../../hooks/useAxios';
import Loading from '../../components/Loading';
import {Checkbox, NativeBaseProvider} from 'native-base';

export default function RegisterScreen({navigation}) {
  const {register, state, clearErrorMessage, showLoader} =
    useContext(AuthContext);
  const [avatar, setAvatar] = useState(null);
  const [experience, setExperience] = useState(null);
  const [experienceDes, setExperienceDes] = useState(null);
  const [username, setUsername] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [checked, setChecked] = useState('male');
  const [date, setDate] = useState(moment());
  const [dateVisible, setDateVisible] = useState(false);
  const [homeAddress, setHomeAddress] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [communeId, setCommuneId] = useState(null);
  const [IDCard, setIDCard] = useState(null);
  const [password, setPassword] = useState('');
  const [coverPassword, setCoverPassword] = useState(true);
  const [rePassword, setRePassword] = useState('');
  const [coverRePassword, setCoverRePassword] = useState(true);
  const [usernameInputError, setUsernameInputError] = useState(null);
  const [experienceInputError, setExperienceInputError] = useState(null);
  const [experienceDesInputError, setExperienceDesInputError] = useState(null);
  const [phoneInputError, setPhoneInputError] = useState(null);
  const [passwordInputError, setPasswordInputError] = useState(null);
  const [rePasswordInputError, setRePasswordInputError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [addServiceError, setAddServiceError] = useState(null);
  const [IDCardError, setIDCardError] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [avatarError, setAvatarError] = useState(null);
  const [listCity, setListCity] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listCommune, setListCommune] = useState([]);
  const [file, setFile] = useState([]);
  const [certi, setCerti] = useState([]);
  const [currentTitle, setCurrentTitle] = useState('Thông tin cá nhân');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const typingTimeoutRef = useRef(null);
  const [searchedService, setSearchedService] = useState(null);
  const [addService, setAddService] = useState([]);
  const repairerAPI = useAxios();
  let slider = null;
  const infoScrollRef = useRef();
  const exScrollRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        let response = await axios.get(constants.GET_ALL_CITY_API);
        setListCity(response.data.cities);
        response = await repairerAPI.get(constants.SEARCH_SERVICE_API, {
          params: {keyword: null},
        });
        setSearchedService(response.data.services);
      } catch (err) {
        setAddressError(err.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (state.errorCode !== '') {
      if (
        state.errorCode === 'ACCOUNT_EXISTED' ||
        state.errorCode === 'INVALID_PHONE_NUMBER' ||
        state.errorCode === 'IDENTITY_CARD_NUMBER_EXISTED'
      ) {
        slider.goToSlide(0);
        if (state.errorCode === 'IDENTITY_CARD_NUMBER_EXISTED') {
          infoScrollRef.current?.scrollTo({x: 0, y: 600, animated: true});
        } else {
          infoScrollRef.current?.scrollTo({x: 0, y: 0, animated: true});
        }
      }
    }
  }, [state.errorCode]);

  const handleOnChangeSearch = async text => {
    try {
      setSearch(text);
      if (text === '') {
        return;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setLoading(true);

      typingTimeoutRef.current = setTimeout(async () => {
        let response = await repairerAPI.get(constants.SEARCH_SERVICE_API, {
          params: {keyword: text},
        });
        console.log('search: ' + text);
        setSearchedService(response.data.services);
        console.log('res: ' + response.data.services);
        setLoading(false);
      }, 200);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAddedService = async index => {
    const temp = [];
    for (let i = 0; i < addService.length; i++) {
      if (i !== index) {
        temp.push(addService[i]);
      }
    }
    setAddService(temp);
  };

  const renderItems = ({item}) => {
    return item.component;
  };

  const handleCertiSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        allowMultiSelection: true,
      });
      console.log(response);
      setCerti([...certi].concat(response));
    } catch (err) {
      console.log('error:', err);
    }
  }, []);

  const handleDateConfirm = selectedDate => {
    setDate(moment(selectedDate));
    setDateVisible(false);
  };
  const hideDatePicker = () => {
    setDateVisible(false);
  };

  const selectAvatar = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      });
      setAvatar(image);
      setAvatarError(null);
    } catch (error) {
      console.log(error);
    }
  };

  const checkPhoneNumberValid = () => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      setPhoneInputError('Vui lòng nhập số điện thoại');
      return false;
    } else if (
      !/(03|05|07|08|09|01[2|6|8|9])([0-9]{8})\b/.test(phoneNumber) ||
      phoneNumber.length !== 10
    ) {
      setPhoneInputError('Số điện thoại không đúng');
      return false;
    }
    setPhoneInputError(null);
    return true;
  };

  const checkPasswordValid = () => {
    if (!password || password.trim() === '') {
      setPasswordInputError('Vui lòng nhập mật khẩu');
      return false;
    } else if (!/((?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,10})\b/.test(password)) {
      setPasswordInputError(
        'Mật khẩu phải từ 6 đến 10 kí tự và bao gồm ít nhất 1 số hoặc 1 kí tự',
      );
      return false;
    } else if (password.indexOf(' ') >= 0) {
      setPasswordInputError('Mật khẩu không bao gồm khoảng trắng');
      return false;
    }
    setPasswordInputError(null);
    return true;
  };
  const checkIDNumberValid = () => {
    if (!IDCard || IDCard.trim() === '') {
      setIDCardError('Vui lòng nhập cmnd/cccd');
      return false;
    } else if (IDCard.length !== 9 && IDCard.length !== 12) {
      console.log('IDCard.length: ', IDCard.length);
      setIDCardError('CCCD/CMND phải 9 hoặc 12 số');
      return false;
    } else if (IDCard.indexOf(' ') >= 0) {
      setIDCardError('CCCD/CMND không bao gồm khoảng trắng');
      return false;
    }
    setIDCardError(null);
    return true;
  };

  const checkExperienceValid = () => {
    if (!experience || experience.trim() === '') {
      setExperienceInputError('Vui lòng nhập số năm kinh nghiệm');
      return false;
    } else if (isNaN(experience)) {
      setExperienceInputError('Năm kinh nghiệm phải là số');
      return false;
    }
    setExperienceInputError(null);
    return true;
  };

  const checkExperienceDesValid = () => {
    if (!experienceDes || experienceDes.trim() === '') {
      setExperienceDesInputError('Vui lòng nhập mô tả kinh nghiệm');
      return false;
    }
    setExperienceDesInputError(null);
    return true;
  };

  const checkFileValid = () => {
    if (!file || file.length !== 2) {
      setFileError('Vui lòng tải lên đủ 2 mặt ảnh cmnd/cccd');
      return false;
    }
    setFileError(null);
    return true;
  };
  const checkAddressValid = () => {
    if (
      cityId &&
      districtId &&
      communeId &&
      homeAddress &&
      homeAddress !== ''
    ) {
      setAddressError(null);
      return true;
    }
    setAddressError('Vui lòng chọn và điền đầy đủ thông tin địa chỉ của bạn');
    return false;
  };
  const checkRePasswordValid = () => {
    if (!rePassword || (rePassword !== password && password.trim() !== '')) {
      setRePasswordInputError('Mật khẩu nhập lại không khớp');
      return false;
    }
    setRePasswordInputError(null);
    return true;
  };
  const checkUsernameValid = () => {
    if (!username || username.trim() === '') {
      setUsernameInputError('Vui lòng nhập tên của bạn');
      return false;
    } else if (!/^[a-zA-Z\s]{3,150}$/.test(removeAscent(username.slice()))) {
      setUsernameInputError(
        'Họ và Tên từ 3 ký tự đến 150 kí tự không bao gồm số và kí tự đặc biệt',
      );
      return false;
    }
    setUsernameInputError(null);
    return true;
  };

  const onchangeCity = async value => {
    setAddressError(null);
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
  const selectFile = async () => {
    try {
      const images = await ImagePicker.openPicker({
        cropping: true,
        multiple: true,
      });
      let temp = [...file, ...images];
      setFile(temp.slice(0, 2));
      setFileError(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = async (index, type) => {
    if (type === 'FILE') {
      if (file.length === 2 && index === 1) {
        setFile([file[0]]);
      } else {
        setFile(file.splice(index + 1, 1));
      }
    } else {
      let temp = [];
      for (let i = 0; i < certi.length; i++) {
        if (i !== index) {
          temp.push(certi[i]);
        }
      }
      setCerti(temp);
    }
  };
  const onchangeDistrict = async value => {
    setDistrictId(value);
    setCommuneId(null);
    setAddressError(null);
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
  const handleRegisterClick = async () => {
    if (state.errorMessage !== '') {
      clearErrorMessage();
    }
    let isPasswordValid = checkPasswordValid();
    let isRePasswordValid = checkRePasswordValid();
    if (isPasswordValid && isRePasswordValid) {
      showLoader();
      register({
        avatar,
        fullName: username,
        phone: phoneNumber,
        password,
        communeId,
        streetAddress: homeAddress,
        identityCardNumber: IDCard,
        identityCardType: IDCard.length === 9 ? 'CMND' : 'CCCD',
        frontImage: file[0],
        backSideImage: file[1],
        experienceYear: +experience,
        experienceDescription: experienceDes,
        certificates: certi,
        gender: checked === 'male' ? 1 : 0,
        dateOfBirth: date.format('DD-MM-YYYY'),
        type: 'REGISTER',
        registerServices: addService.map((item, index) => {
          const [serviceId, serviceName, icon] = item.split('[SPACE]');
          return +serviceId;
        }),
      });
      console.log('VALID');
    }
  };

  const slides = [
    {
      key: '1',
      component: (
        <ScrollView
          style={{marginHorizontal: '4%'}}
          showsVerticalScrollIndicator={false}
          ref={infoScrollRef}>
          <Text style={[styles.inputTittle, {marginTop: 10}]}>Họ và tên *</Text>
          <View
            style={[
              styles.inputView,
              {borderColor: usernameInputError ? '#FF6442' : '#CACACA'},
            ]}>
            <TextInput
              style={styles.input}
              placeholder="Nhập họ và tên"
              onChangeText={text => setUsername(text)}
              onFocus={() => setUsernameInputError(null)}
              value={username}
            />
            {usernameInputError && (
              <Text style={styles.errorMessage}>{usernameInputError}</Text>
            )}
          </View>

          <Text style={styles.inputTittle}>Số điện thoại *</Text>
          <View
            style={[
              styles.inputView,
              {
                borderColor:
                  phoneInputError ||
                  (state.errorMessage !== '' &&
                    (state.errorCode === 'ACCOUNT_EXISTED' ||
                      state.errorCode === 'INVALID_PHONE_NUMBER'))
                    ? '#FF6442'
                    : '#CACACA',
              },
            ]}>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              onChangeText={text => setPhoneNumber(text)}
              onFocus={() => {
                setPhoneInputError(null);
                clearErrorMessage();
              }}
              value={phoneNumber}
              keyboardType="number-pad"
            />
            {phoneInputError && (
              <Text style={styles.errorMessage}>{phoneInputError}</Text>
            )}
            {state.errorMessage !== '' &&
              (state.errorCode === 'ACCOUNT_EXISTED' ||
                state.errorCode === 'INVALID_PHONE_NUMBER') && (
                <Text style={styles.errorMessage}>{state.errorMessage}</Text>
              )}
          </View>
          <Text style={styles.inputTittle}>Giới tính *</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 10,
            }}>
            <View style={styles.checkBoxView}>
              <RadioButton
                value="male"
                status={checked === 'male' ? 'checked' : 'unchecked'}
                color="#FFBC00"
                onPress={() => {
                  setChecked('male');
                }}
              />
              <Text>Nam</Text>
            </View>
            <View style={styles.checkBoxView}>
              <RadioButton
                value="female"
                status={checked === 'female' ? 'checked' : 'unchecked'}
                color="#FFBC00"
                onPress={() => {
                  setChecked('female');
                }}
              />
              <Text>Nữ</Text>
            </View>
            <View style={styles.checkBoxView}>
              <RadioButton
                value="other"
                status={checked === 'other' ? 'checked' : 'unchecked'}
                color="#FFBC00"
                onPress={() => {
                  setChecked('other');
                }}
              />
              <Text>Khác</Text>
            </View>
          </View>
          <Text style={styles.inputTittle}>Ngày sinh *</Text>
          <View>
            <View style={{marginTop: 10}}>
              <TouchableOpacity
                style={styles.datePicker}
                onPress={() => setDateVisible(true)}>
                <Text style={{color: 'black'}}>
                  {date.format('DD/MM/YYYY')}
                </Text>
                <Ionicons
                  name="chevron-down-sharp"
                  size={20}
                  style={{
                    marginBottom: 3,
                    color: 'black',
                    marginLeft: 'auto',
                  }}
                />
                <DateTimePickerModal
                  isVisible={dateVisible}
                  mode="date"
                  onConfirm={handleDateConfirm}
                  onCancel={hideDatePicker}
                  maximumDate={new Date(moment())}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.inputTittle}>Địa chỉ *</Text>
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
                style={styles.pickerCityStyle}
                items={listCity}
                Icon={() => (
                  <Ionicons
                    name="chevron-down-sharp"
                    size={20}
                    style={{marginTop: (0.09 * height) / 4, marginRight: 6}}
                  />
                )}
              />
            </View>
          </View>
          <View style={styles.addressPicker}>
            <View style={[styles.addressSelectItem, {width: '49%'}]}>
              <RNPickerSelect
                value={districtId}
                textInputProps={{multiline: true}}
                pickerProps={{numberOfLines: 10}}
                useNativeAndroidPickerStyle={false}
                fixAndroidTouchableBug={true}
                onValueChange={onchangeDistrict}
                items={listDistrict}
                placeholder={{
                  label: 'Quận/Huyện',
                  value: null,
                }}
                Icon={() => (
                  <Ionicons
                    name="chevron-down-sharp"
                    size={20}
                    style={{marginTop: (0.09 * height) / 4, marginRight: 6}}
                  />
                )}
                style={styles.pickerStyle}
              />
            </View>
            <View style={[styles.addressSelectItem, {width: '49%'}]}>
              <RNPickerSelect
                value={communeId}
                fixAndroidTouchableBug={true}
                textInputProps={{multiline: true}}
                pickerProps={{numberOfLines: 10}}
                useNativeAndroidPickerStyle={false}
                onValueChange={async value => {
                  setAddressError(null);
                  setCommuneId(value);
                }}
                items={listCommune}
                placeholder={{
                  label: 'Phường/Xã',
                  value: null,
                }}
                Icon={() => (
                  <Ionicons
                    name="chevron-down-sharp"
                    size={20}
                    style={{marginTop: (0.09 * height) / 4, marginRight: 6}}
                  />
                )}
                style={styles.pickerStyle}
              />
            </View>
          </View>
          <View
            style={[
              styles.inputView,
              {
                marginTop: 20,
                borderColor: addressError ? '#FF6442' : '#CACACA',
              },
            ]}>
            <TextInput
              style={styles.input}
              placeholder="Nhập địa chỉ nhà"
              onChangeText={text => setHomeAddress(text)}
              onFocus={() => setAddressError(null)}
              value={homeAddress}
            />
            {addressError && (
              <Text style={styles.errorMessage}>{addressError}</Text>
            )}
          </View>
          <Text style={styles.inputTittle}>Số CMND/CCCD *</Text>
          <View
            style={[
              styles.inputView,
              {
                borderColor:
                  IDCardError ||
                  (state.errorMessage !== '' &&
                    state.errorCode === 'IDENTITY_CARD_NUMBER_EXISTED')
                    ? '#FF6442'
                    : '#CACACA',
              },
            ]}>
            <TextInput
              style={styles.input}
              onChangeText={text => setIDCard(text)}
              value={IDCard}
              keyboardType="number-pad"
              onFocus={() => {
                setIDCardError(null);
                clearErrorMessage();
              }}
              placeholder="Nhập số cccd/cmnd"
            />
            {IDCardError && (
              <Text style={styles.errorMessage}>{IDCardError}</Text>
            )}
            {state.errorMessage !== '' &&
              state.errorCode === 'IDENTITY_CARD_NUMBER_EXISTED' && (
                <Text style={styles.errorMessage}>{state.errorMessage}</Text>
              )}
          </View>
          <Text style={styles.inputTittle}>Ảnh hai mặt CMND/CCCD *</Text>
          <View style={{width: '100%', flexDirection: 'row', flexWrap: 'wrap'}}>
            {file.length !== 0
              ? file.map((item, index) => {
                  return (
                    <ImageBackground
                      source={{uri: item.path}}
                      key={index}
                      style={styles.cmtImage}
                      resizeMode="cover">
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={async () => await handleClose(index, 'FILE')}>
                        <Image
                          style={{
                            width: 12,
                            height: 12,
                          }}
                          source={require('../../../assets/images/type/close.png')}
                        />
                      </TouchableOpacity>
                    </ImageBackground>
                  );
                })
              : null}
            {file.length !== 2 ? (
              <TouchableOpacity onPress={selectFile}>
                <Image
                  style={{
                    width: 80,
                    height: 80,
                    marginVertical: 10,
                  }}
                  source={require('../../../assets/images/type/add-image.png')}
                />
              </TouchableOpacity>
            ) : null}
            {fileError && <Text style={styles.errorMessage}>{fileError}</Text>}
          </View>
          <Button
            style={[styles.loginButton, {marginTop: 20, marginBottom: 20}]}
            buttonText="TIẾP TỤC"
            onPress={async () => {
              let isUsernameValid = checkUsernameValid();
              let isPhoneValid = checkPhoneNumberValid();
              let isAddressValid = checkAddressValid();
              let isIDNumber = checkIDNumberValid();
              let isFile = checkFileValid();
              if (!isUsernameValid || !isPhoneValid) {
                infoScrollRef.current?.scrollTo({x: 0, y: 0, animated: true});
              } else if (!isAddressValid) {
                infoScrollRef.current?.scrollTo({x: 0, y: 400, animated: true});
              }
              if (
                isUsernameValid &&
                isPhoneValid &&
                isAddressValid &&
                isIDNumber &&
                isFile
              ) {
                if (!avatar) {
                  setAvatarError(
                    'Vui lòng chọn ảnh đại diện có khuôn mặt của bạn',
                  );
                } else {
                  await slider.goToSlide(1);
                  setCurrentTitle('Kinh nghiệm làm việc');
                }
              }
            }}
          />
        </ScrollView>
      ),
    },
    {
      key: '2',
      component: (
        <ScrollView
          style={{marginHorizontal: '4%'}}
          showsVerticalScrollIndicator={false}
          ref={exScrollRef}>
          <Text style={[styles.inputTittle, {marginTop: 10}]}>
            Năm kinh nghiệm *
          </Text>
          <View
            style={[
              styles.inputView,
              {borderColor: experienceInputError ? '#FF6442' : '#CACACA'},
            ]}>
            <TextInput
              style={styles.input}
              onChangeText={text => setExperience(text)}
              value={experience}
              keyboardType="number-pad"
              placeholder="Nhập năm kinh nghiệm"
              onFocus={() => setExperienceInputError(null)}
            />
            {experienceInputError && (
              <Text style={styles.errorMessage}>{experienceInputError}</Text>
            )}
          </View>
          <Text style={styles.inputTittle}>Mô tả kinh nghiệm *</Text>
          <View
            style={[
              styles.inputView,
              {
                borderColor: experienceDesInputError ? '#FF6442' : '#CACACA',
                height: 0.14 * height,
              },
            ]}>
            <TextInput
              style={styles.input}
              numberOfLines={5}
              placeholder="Nhập mô tả kinh nghiệm"
              onChangeText={text => setExperienceDes(text)}
              value={experienceDes}
              onFocus={() => setExperienceDesInputError(null)}
            />
            {experienceDesInputError && (
              <Text style={styles.errorMessage}>{experienceDesInputError}</Text>
            )}
          </View>
          <Text style={[styles.inputTittle, {marginBottom: 10}]}>
            Chứng chỉ nghề (nếu có)
          </Text>
          <FlatList
            data={certi}
            renderItem={({item, index}) => (
              <View
                key={index.toString()}
                style={{
                  backgroundColor: '#F0F0F0',
                  width: 'auto',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 10,
                  marginRight: 20,
                  marginTop: 20,
                }}>
                <Text
                  style={{fontSize: 16, color: 'black', width: 'auto'}}
                  numberOfLines={1}
                  ellipsizeMode={'middle'}>
                  {item?.name}
                </Text>
                <TouchableOpacity
                  style={[styles.closeButton, {right: -12, top: -12}]}
                  onPress={async () => await handleClose(index, 'CERTI')}>
                  <Image
                    style={{
                      width: 12,
                      height: 12,
                    }}
                    source={require('../../../assets/images/type/close.png')}
                  />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item.id}
          />
          <TouchableOpacity onPress={handleCertiSelection}>
            <Image
              style={{
                width: 40,
                height: 40,
                marginTop: 10,
                resizeMode: 'contain',
              }}
              source={require('../../../assets/images/type/file.png')}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
            }}>
            <Button
              style={[
                styles.loginButton,
                {
                  marginTop: 20,
                  marginBottom: 20,
                  backgroundColor: '#F0F0F0',
                  flex: 1,
                  marginRight: 6,
                },
              ]}
              buttonText="TRỞ LẠI"
              onPress={async () => {
                console.log(height);
                await slider.goToSlide(0);
                setCurrentTitle('Thông tin cá nhân');
              }}
            />
            <Button
              style={[
                styles.loginButton,
                {marginTop: 20, marginBottom: 20, flex: 1, marginLeft: 6},
              ]}
              buttonText="TIẾP TỤC"
              onPress={async () => {
                let isExpValid = checkExperienceValid();
                let isExpDesValid = checkExperienceDesValid();
                if (!isExpValid) {
                  console.log('aaa');
                  exScrollRef.current?.scrollTo({
                    x: 0,
                    y: 0,
                    animated: true,
                  });
                }
                if (isExpValid && isExpDesValid) {
                  await slider.goToSlide(2);
                  setCurrentTitle('Chọn dịch vụ sửa');
                }
              }}
            />
          </View>
        </ScrollView>
      ),
    },
    {
      key: '3',
      component: (
        <View
          style={{
            marginHorizontal: '4%',
            height: 0.542 * height,
          }}>
          <SearchForm
            search={search}
            setSearch={setSearch}
            handleOnChangeSearch={handleOnChangeSearch}
            onFocus={() => {
              setAddServiceError(null);
            }}
            placeholder="Tìm kiếm dịch vụ"
          />
          {addServiceError && (
            <Text
              style={[
                styles.errorMessage,
                {position: 'relative', bottom: 0, left: '4%', marginTop: 4},
              ]}>
              {addServiceError}
            </Text>
          )}
          <ScrollView style={{marginTop: 10, marginBottom: 0.15 * height}}>
            {addService.length !== 0 ? (
              <View>
                <View style={styles.titleBox}>
                  <Text style={[styles.textBold, {fontSize: 20}]}>Đã thêm</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginBottom: 5,
                  }}>
                  {addService.map((item, index) => {
                    const [serviceId, serviceName, icon] =
                      item.split('[SPACE]');
                    return (
                      <View
                        style={styles.selectedService}
                        key={index.toString()}>
                        <Image
                          source={{uri: icon}}
                          style={{width: 24, height: 24}}
                        />
                        <Text style={{marginLeft: 5, color: 'black'}}>
                          {serviceName}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleDeleteAddedService(index)}
                          style={styles.closeIcon}>
                          <Ionicons name="close" size={16} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}
            {loading ? (
              <Loading
                style={{
                  marginTop: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            ) : (
              <View>
                {searchedService !== null ? (
                  searchedService.length !== 0 ? (
                    <NativeBaseProvider>
                      <View style={styles.titleBox}>
                        <Text style={[styles.textBold, {fontSize: 20}]}>
                          Tất cả dịch vụ
                        </Text>
                      </View>
                      <Checkbox.Group
                        onChange={setAddService}
                        value={addService}
                        accessibilityLabel="choose numbers">
                        {searchedService.map((item, index) => (
                          <View
                            style={styles.serviceRow}
                            key={index.toString()}>
                            <Image
                              source={{uri: item.icon}}
                              style={{width: 24, height: 24}}
                            />
                            <Text
                              style={{
                                color: 'black',
                                fontSize: 16,
                                marginLeft: 20,
                              }}>
                              {item.serviceName}
                            </Text>
                            <View style={{marginLeft: 'auto'}}>
                              <Checkbox
                                accessibilityLabel={item.serviceName}
                                value={`${item.serviceId}[SPACE]${item.serviceName}[SPACE]${item.icon}`}
                                colorScheme="yellow"
                                onChange={() => setAddServiceError(null)}
                                _icon={{color: 'black'}}
                              />
                            </View>
                          </View>
                        ))}
                      </Checkbox.Group>
                    </NativeBaseProvider>
                  ) : (
                    <NotFound />
                  )
                ) : null}
              </View>
            )}
          </ScrollView>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              height: 'auto',
              bottom: 0.018 * height,
              left: 0,
              position: 'absolute',
            }}>
            <Button
              style={[
                styles.loginButton,
                {
                  marginTop: 20,
                  marginBottom: 20,
                  backgroundColor: '#F0F0F0',
                  flex: 1,
                  marginRight: 6,
                },
              ]}
              buttonText="TRỞ LẠI"
              onPress={async () => {
                await slider.goToSlide(1);
                setCurrentTitle('Kinh nghiệm làm việc');
              }}
            />
            <Button
              style={[
                styles.loginButton,
                {marginTop: 20, marginBottom: 20, flex: 1, marginLeft: 6},
              ]}
              buttonText="TIẾP TỤC"
              onPress={async () => {
                if (addService && addService.length !== 0) {
                  await slider.goToSlide(3);
                  setCurrentTitle('Tạo Mật Khẩu');
                } else {
                  setAddServiceError('Vui lòng chọn ít nhất 1 dịch vụ');
                }
              }}
            />
          </View>
        </View>
      ),
    },
    {
      key: '4',
      component: (
        <View
          style={{
            marginHorizontal: '4%',
            height: 0.542 * height,
          }}>
          <Text style={[styles.inputTittle, {marginTop: 10}]}>Mật khẩu *</Text>
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
              onFocus={() => setPasswordInputError(null)}
              value={password}
              placeholder="Nhập mật khẩu"
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

          <Text style={styles.inputTittle}>Nhập lại mật khẩu *</Text>
          <View
            style={[
              styles.inputView,
              {borderColor: rePasswordInputError ? '#FF6442' : '#CACACA'},
            ]}>
            <TextInput
              style={[
                styles.input,
                {
                  fontSize:
                    coverRePassword === true && password.trim() !== ''
                      ? 20
                      : 14,
                },
              ]}
              secureTextEntry={coverRePassword}
              onChangeText={text => setRePassword(text)}
              value={rePassword}
              onFocus={() => setRePasswordInputError(null)}
              placeholder="Nhập lại mật khẩu"
            />
            <TouchableOpacity
              style={styles.iconView}
              onPress={() => setCoverRePassword(!coverRePassword)}>
              {coverRePassword ? (
                <Icon name="eye" size={18} />
              ) : (
                <Icon name="eye-slash" size={18} />
              )}
            </TouchableOpacity>
            {rePasswordInputError && (
              <Text style={styles.errorMessage}>{rePasswordInputError}</Text>
            )}
          </View>
          <View style={styles.termContainer}>
            <Text>Bằng việc nhấn đăng ký là bạn đã chấp nhận</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.push('TermsOfUseScreen');
              }}>
              <Text style={styles.termLink}>điều khoản sử dụng</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,

              height: 'auto',
              bottom: 0.018 * height,
              left: 0,
              position: 'absolute',
            }}>
            <Button
              style={[
                styles.loginButton,
                {
                  marginTop: 20,
                  marginBottom: 20,
                  backgroundColor: '#F0F0F0',
                  flex: 1,
                  marginRight: 6,
                },
              ]}
              buttonText="TRỞ LẠI"
              onPress={async () => {
                await slider.goToSlide(2);
                setCurrentTitle('Chọn dịch vụ sửa');
              }}
            />
            <Button
              style={[
                styles.loginButton,
                {marginTop: 20, marginBottom: 20, flex: 1, marginLeft: 6},
              ]}
              buttonText="ĐĂNG KÝ"
              onPress={handleRegisterClick}
            />
          </View>
        </View>
      ),
    },
  ];

  return (
    <>
      <HeaderComponent height={0.55 * height} />
      <BackButton onPressHandler={navigation.goBack} color="#FEC54B" />
      <SafeAreaView>
        <View style={styles.registerForm}>
          <View>
            <ImageBackground
              source={
                avatar === null
                  ? require('../../../assets/images/login_register_bg/default_avatar.jpg')
                  : {uri: avatar.path}
              }
              style={styles.avatar}
              imageStyle={{
                borderWidth: avatarError ? 1 : 0,
                borderColor: avatarError ? '#FF6442' : '#F0F0F0',
                borderRadius: width * 0.5,
              }}
              resizeMode="center">
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={selectAvatar}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  source={require('../../../assets/images/login_register_bg/camera_icon.png')}
                />
              </TouchableOpacity>
            </ImageBackground>
            <Text style={styles.headerText}>{currentTitle}</Text>
            {avatarError && (
              <Text
                style={{
                  alignSelf: 'center',
                  bottom: 30,
                  width: '60%',
                  position: 'absolute',
                  fontSize: 10,
                  color: '#FF6442',
                  textAlign: 'center',
                }}>
                {avatarError}
              </Text>
            )}
          </View>

          <AppIntroSlider
            data={slides}
            renderItem={renderItems}
            onDone={handleRegisterClick}
            scrollEnabled={false}
            bottomButton
            renderPagination={() => null}
            ref={ref => (slider = ref)}
          />
        </View>
        <ProgressLoader
          visible={state.loading ? state.loading : false}
          isModal={true}
          isHUD={true}
          hudColor={'#FEC54B'}
          color={'#000000'}
        />
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  registerForm: {
    width: '100%',
    height: 0.76 * height,
    marginTop: 0.25 * height,
    position: 'absolute',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: 'white',
  },
  scrollView: {
    width: '100%',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
  },
  avatar: {
    width: width * 0.26,
    aspectRatio: 1,
    borderRadius: width * 0.15,
    alignSelf: 'center',
    alignItems: 'flex-end',
    marginVertical: 20,
    justifyContent: 'flex-end',
  },
  cmtImage: {
    width: width * 0.2,
    aspectRatio: 1,
    borderRadius: width * 0.15,
    alignSelf: 'center',
    alignItems: 'flex-end',
    marginVertical: 10,
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  cameraButton: {
    width: width * 0.3 * 0.3,
    aspectRatio: 1,
    backgroundColor: '#D9D9D9',
    borderRadius: width * 0.15 * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: width * 0.3 * 0.2,
    top: -6,
    right: -6,
    position: 'absolute',
    aspectRatio: 1,
    backgroundColor: '#FEC54B',
    borderRadius: width * 0.15 * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: '4%',
    paddingBottom: 10,
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
    paddingHorizontal: 18,
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
    width: '100%',
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
  loginButton: {
    height: 0.075 * height,
    borderRadius: 16,
    backgroundColor: '#FEC54B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
  pickerStyle: {
    inputIOS: {
      fontSize: 12,
      color: 'black',
      textAlign: 'center',
      marginRight: 14,
    },
    inputAndroid: {
      fontSize: 12,
      color: 'black',
      textAlign: 'center',
      marginRight: 12,
      alignSelf: 'center',
      marginTop: 6,
      marginBottom: 6,
    },
  },

  pickerCityStyle: {
    inputIOS: {
      fontSize: 14,
      color: 'black',
      textAlign: 'center',
      marginRight: 14,
    },
    inputAndroid: {
      fontSize: 14,
      color: 'black',
      textAlign: 'center',
      marginRight: 0.52 * width,
      alignSelf: 'center',
      marginTop: 6,
      marginBottom: 6,
    },
  },

  termContainer: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    alignItems: 'center',
  },

  termLink: {
    fontWeight: 'bold',
    color: '#FEC54B',
    alignSelf: 'center',
    justifyContent: 'center',
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
    position: 'absolute',
    bottom: -14,
    left: 20,
    fontSize: 10,
    color: '#FF6442',
  },
  checkBoxView: {
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center',
  },
  datePicker: {
    flexDirection: 'row',
    height: 0.075 * height,
    borderRadius: 30,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#CACACA',
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingRight: 20,
    marginBottom: 10,
  },
  textBold: {
    fontWeight: 'bold',
    color: 'black',
  },
  titleBox: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#D3D3D3',
    marginVertical: 6,
    width: '100%',
  },
  selectedService: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 16,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#CACACA',
  },

  closeIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#FEC54B',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -10,
    right: -10,
  },
});
