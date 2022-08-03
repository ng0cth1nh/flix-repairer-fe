import {
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {getStatusBarHeight} from 'react-native-status-bar-height';
const {height, width} = Dimensions.get('window');
import BackButton from '../../components/BackButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../components/SubmitButton';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';
import {useSelector, useDispatch} from 'react-redux';
import useAxios from '../../hooks/useAxios';
import {
  fetchProfile,
  selectErrorMessage,
  selectUser,
  updateProfile,
} from '../../features/user/userSlice';
import axios from 'axios';
import constants from '../../constants/Api';
import Loading from '../../components/Loading';

const EditProfileInfoScreen = ({navigation}) => {
  const repairerAPI = useAxios();
  const dispatch = useDispatch();
  const errorMessage = useSelector(selectErrorMessage);
  const user = useSelector(selectUser);

  const [experienceDescription, setExperienceDescription] = useState(
    user.experienceDescription,
  );

  const [email, setEmail] = useState(user.email);
  const [dateOfBirths, setDateOfBirths] = useState(user.dateOfBirth);
  const [cityId, setCityId] = useState(user.cityId);
  const [districtId, setDistrictId] = useState(user.districtId);
  const [communeId, setCommuneId] = useState(user.communeId);
  const [listCity, setListCity] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listCommune, setListCommune] = useState([]);
  const [experienceDescriptionInputError, setExperienceDescriptionInputError] =
    useState(null);
  const [addressInputError, setAddressInputError] = useState(null);
  const [streetAddress, setStreetAddress] = useState(
    user.address.split(',')[0],
  );
  const [emailInputError, setEmailInputError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [addressError, setAddressError] = useState(null);
  const [registerServices, setRegisterServices] = useState(
    user.registerServices,
  );
  const [addedService, setAddedService] = useState(null);

  const checkEmailValid = () => {
    if (email === null || email.trim() === '') {
      setEmailInputError('Vui lòng nhập email của bạn');
      return false;
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())
    ) {
      setEmailInputError('Email không đúng định dạng');
      return false;
    }
    setEmailInputError(null);
    return true;
  };

  const checkExperienceValid = () => {
    if (experienceDescription === null || experienceDescription.trim() === '') {
      setExperienceDescriptionInputError('Vui lòng nhập mô tả kinh nghiệm');
      return false;
    }
    setExperienceDescriptionInputError(null);
    return true;
  };

  const checkAddressValid = async () => {
    if (
      cityId &&
      districtId &&
      communeId &&
      streetAddress &&
      streetAddress.length !== 0
    ) {
      setAddressInputError(null);
      return true;
    }
    setAddressInputError(
      'Vui lòng chọn và điền đầy đủ thông tin địa chỉ của bạn',
    );
    return false;
  };

  const handleUpdateProfile = async () => {
    if (checkEmailValid() && checkExperienceValid() && checkAddressValid()) {
      try {
        let registerServices = addedService.map((item, index) => {
          let [serviceId, serviceName, serviceIcon] = item.split('[SPACE]');
          return +serviceId;
        });
        const body = {
          experienceDescription,
          communeId,
          streetAddress,
          email,
          registerServices,
        };
        await dispatch(updateProfile({repairerAPI, body}));
        await dispatch(fetchProfile(repairerAPI));
        Toast.show({
          type: 'customToast',
          text1: 'Cập nhật thông tin thành công',
        });
      } catch (error) {
        Toast.show({
          type: 'customErrorToast',
          text1: errorMessage,
        });
      }
    } else {
      checkEmailValid();
      checkExperienceValid();
      checkAddressValid();
    }
  };

  const handleDeleteRegisterService = async index => {
    const temp = [];
    for (let i = 0; i < addedService.length; i++) {
      if (i !== index) {
        temp.push(addedService[i]);
      }
    }
    setAddedService(temp);
  };
  const handleAddDetailServiceButtonClick = async () => {
    navigation.push('SearchServiceFilterScreen', {
      addedService,
      setAddedService,
    });
  };

  const onchangeCity = async value => {
    setAddressInputError(null);
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
    setAddressInputError(null);
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

  useEffect(() => {
    (async () => {
      try {
        console.log(typeof cityId);
        await setLoading(true);
        let temp = registerServices.map((item, index) => {
          return `${item.serviceId}[SPACE]${item.serviceName}[SPACE]${item.serviceIcon}`;
        });
        setAddedService(temp);
        let response = await axios.get(constants.GET_ALL_CITY_API);
        setListCity(response.data.cities);

        response = await axios.get(constants.GET_DISTRICT_BY_CITY_API, {
          params: {cityId},
        });
        setListDistrict(response.data.districts);
        response = await axios.get(constants.GET_COMMUNE_BY_DISTRICT_API, {
          params: {districtId},
        });
        setListCommune(response.data.communes);
      } catch (err) {
        setAddressError(err.message);
      } finally {
        await setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={{backgroundColor: '#FEC54B', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FEC54B" />
      <View
        style={{
          flex: 1,
          height: 60,
          width: '100%',
          zIndex: 1,
          position: 'absolute',
          backgroundColor: '#FEC54B',
        }}>
        <BackButton onPressHandler={navigation.goBack} color="black" />
      </View>
      {loading ? (
        <Loading color="white" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            style={{
              width: 110,
              height: 110,
              borderRadius: width * 0.5,
              borderColor: '#F0F0F0',
              borderWidth: 1,
              alignSelf: 'center',
              marginTop: 80,
              marginBottom: 10,
            }}
            source={{uri: user.avatar}}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              alignSelf: 'center',
              color: 'black',
              marginBottom: 50,
            }}>
            {user.fullName}
          </Text>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              paddingHorizontal: '5%',
            }}>
            <View
              style={[
                styles.box,
                {
                  height: 'auto',
                  flexDirection: 'column',
                  marginVertical: '5%',
                },
              ]}>
              <View style={styles.boxHeader}>
                <Image
                  style={{width: 24, height: 24}}
                  source={require('../../../assets/images/type/user.png')}
                />
                <Text style={styles.tittleText}>Thông tin tài khoản</Text>
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Email</Text>
                <View
                  style={[
                    styles.valueSpace,
                    emailInputError
                      ? {borderColor: '#FF6442', borderWidth: 1}
                      : null,
                  ]}>
                  <TextInput
                    style={email ? styles.valueText : styles.valueTextBlur}
                    onChangeText={text => setEmail(text)}
                    value={email}
                    placeholder="Nhập email"
                    placeholderTextColor="#DFDFDF"
                  />
                </View>
                {emailInputError && (
                  <Text style={styles.errorMessage}>{emailInputError}</Text>
                )}
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Mô tả kinh nghiệm</Text>
                <View
                  style={[
                    styles.valueSpace,
                    {height: 100},
                    experienceDescriptionInputError
                      ? {borderColor: '#FF6442', borderWidth: 1}
                      : null,
                  ]}>
                  <TextInput
                    style={
                      user.experienceDescription
                        ? styles.valueText
                        : styles.valueTextBlur
                    }
                    multiline={true}
                    onChangeText={text => setExperienceDescription(text)}
                    placeholder="Nhập mô tả kinh nghiệm"
                    value={experienceDescription}
                  />
                </View>
                {experienceDescriptionInputError && (
                  <Text style={styles.errorMessage}>
                    {experienceDescriptionInputError}
                  </Text>
                )}
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Tỉnh/Thành Phố</Text>
                <View
                  style={[
                    styles.valueSpace,
                    {borderColor: addressInputError ? '#FF6442' : '#CACACA'},
                  ]}>
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
                      <Ionicons
                        name="chevron-down-sharp"
                        size={20}
                        style={{marginTop: (0.075 * height) / 4}}
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Quận/Huyện</Text>
                <View
                  style={[
                    styles.valueSpace,
                    {borderColor: addressInputError ? '#FF6442' : '#CACACA'},
                  ]}>
                  <RNPickerSelect
                    value={districtId}
                    fixAndroidTouchableBug={true}
                    onValueChange={onchangeDistrict}
                    placeholder={{
                      label: 'Quận/Huyện',
                      value: null,
                    }}
                    useNativeAndroidPickerStyle={false}
                    style={styles.pickerStyle}
                    items={listDistrict}
                    Icon={() => (
                      <Ionicons
                        name="chevron-down-sharp"
                        size={20}
                        style={{marginTop: (0.075 * height) / 4}}
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Phường/Xã</Text>
                <View
                  style={[
                    styles.valueSpace,
                    {borderColor: addressInputError ? '#FF6442' : '#CACACA'},
                  ]}>
                  <RNPickerSelect
                    value={communeId}
                    fixAndroidTouchableBug={true}
                    onValueChange={value => {
                      setCommuneId(value);
                      setAddressInputError(null);
                    }}
                    placeholder={{
                      label: 'Phường/Xã',
                      value: null,
                    }}
                    useNativeAndroidPickerStyle={false}
                    style={styles.pickerStyle}
                    items={listCommune}
                    Icon={() => (
                      <Ionicons
                        name="chevron-down-sharp"
                        size={20}
                        style={{marginTop: (0.075 * height) / 4}}
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Địa chỉ chi tiết</Text>
                <View
                  style={[
                    styles.valueSpace,
                    {borderColor: addressInputError ? '#FF6442' : '#CACACA'},
                  ]}>
                  <TextInput
                    style={styles.valueText}
                    placeholder="Nhập số nhà, tên đường..."
                    value={streetAddress}
                    onFocus={() => setAddressInputError(null)}
                    onChangeText={text => setStreetAddress(text)}
                  />
                  {addressInputError && (
                    <Text style={styles.errorMessage}>{addressInputError}</Text>
                  )}
                </View>
              </View>
              <View style={styles.inputField}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.inputLabel}>Dịch vụ sửa chữa</Text>
                  <TouchableOpacity
                    style={styles.editTouch}
                    onPress={handleAddDetailServiceButtonClick}>
                    <Text style={styles.editText}>Thêm{'>'}</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.valueSpace,
                    {height: 'auto', paddingBottom: 10},
                  ]}>
                  {addedService ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginBottom: 5,
                      }}>
                      {addedService.map((item, index) => {
                        const [serviceId, serviceName, serviceIcon] =
                          item.split('[SPACE]');
                        return (
                          <View
                            style={styles.selectedService}
                            key={index.toString()}>
                            <Image
                              source={{uri: serviceIcon}}
                              style={{width: 24, height: 24}}
                            />
                            <Text style={{marginLeft: 5, color: 'black'}}>
                              {serviceName}
                            </Text>
                            <TouchableOpacity
                              onPress={() => handleDeleteRegisterService(index)}
                              style={styles.closeIcon}>
                              <Ionicons name="close" size={16} />
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
            <Button
              style={{marginBottom: 20, height: height * 0.062}}
              onPress={handleUpdateProfile}
              buttonText="Lưu lại"
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: width * 0.28,
    aspectRatio: 1,
    borderRadius: width * 0.15,
    alignSelf: 'center',
    alignItems: 'flex-end',
    marginTop: 80,
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
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
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
  inputField: {marginBottom: 16},
  inputLabel: {
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  valueSpace: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  valueText: {
    fontSize: 16,
    color: 'black',
  },
  valueTextBlur: {
    fontSize: 16,
    color: '#DFDFDF',
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
  datePicker: {
    flexDirection: 'row',
    width: '100%',
    height: '80%',
    borderRadius: 10,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
  },
  textBold: {
    color: 'black',
  },
  errorMessage: {
    position: 'absolute',
    bottom: -14,
    left: 5,
    fontSize: 10,
    color: '#FF6442',
  },
  selectedService: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    marginTop: 15,
    marginRight: 15,
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
  editTouch: {
    marginLeft: 'auto',
  },
  editText: {
    color: '#FEC54B',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default EditProfileInfoScreen;
