import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
import {Checkbox, NativeBaseProvider} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
const {width} = Dimensions.get('window');
import TopHeaderComponent from '../../components/TopHeaderComponent';
import CustomDatePicker from '../../components/CustomDatePicker';
import BackButton from '../../components/BackButton';
import Button from '../../components/SubmitButton';
import useFetchData from '../../hooks/useFetchData';
import ApiConstants from '../../constants/Api';
import useAxios from '../../hooks/useAxios';
import CustomModal from '../../components/CustomModal';

export default function ServiceFilterScreen({route, navigation}) {
  const {
    setFilter,
    addedServices,
    setAddedServices,
    endDates,
    setEndDates,
    startDates,
    setStartDates,
    districtIds,
    setDistrictIds,
    cityIds,
    setCityIds,
    communeIds,
    setCommuneIds,
  } = route.params;
  const [addedService, setAddedService] = useState(addedServices);
  const [startDate, setStartDate] = useState(startDates);
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDate, setEndDate] = useState(endDates);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const repairerAPI = useAxios();
  const [cityId, setCityId] = useState(cityIds);
  const [districtId, setDistrictId] = useState(null);
  const [communeId, setCommuneId] = useState(null);
  const [listCity, setListCity] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listCommune, setListCommune] = useState([]);

  const handlerStartDateConfirm = selectedDate => {
    setStartDate(moment(selectedDate));
    setStartDateVisible(false);
  };
  const hideStartDatePicker = () => {
    setStartDateVisible(false);
  };
  const handlerEndDateConfirm = selectedDate => {
    setEndDate(moment(selectedDate));
    setEndDateVisible(false);
  };
  const hideEndDatePicker = () => {
    setEndDateVisible(false);
  };

  const fetchDistricts = async cityId => {
    try {
      let response = await repairerAPI.get(
        ApiConstants.GET_DISTRICT_BY_CITY_API,
        {
          params: {cityId},
        },
      );
      setListDistrict(response.data.districts);
    } catch (err) {
      // setAddressError(err.message);
    }
  };

  const fetchCommunes = async districtId => {
    try {
      let response = await repairerAPI.get(
        ApiConstants.GET_COMMUNE_BY_DISTRICT_API,
        {
          params: {districtId},
        },
      );
      setListCommune(response.data.communes);
    } catch (err) {
      // setAddressError(err.message);
    }
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
    fetchDistricts(value);
  };
  const onchangeDistrict = async value => {
    setDistrictId(value);
    setCommuneId(null);
    if (!value) {
      setListCommune([]);
      return;
    }
    fetchCommunes(value);
  };

  useEffect(() => {
    (async () => {
      try {
        let response = await repairerAPI.get(ApiConstants.GET_ALL_CITY_API);
        setListCity(response.data.cities);
        if (cityId) {
          await fetchDistricts(cityId);
          setDistrictId(districtIds);
        }
        if (districtIds) {
          await fetchCommunes(districtId);
          setCommuneId(communeIds);
        }
      } catch (err) {
        // setAddressError(err.message);
      }
    })();
  }, []);

  const handleDeleteAddedService = async index => {
    const temp = [];
    for (let i = 0; i < addedService.length; i++) {
      if (i !== index) {
        temp.push(addedService[i]);
      }
    }
    setAddedService(temp);
  };

  const getStartDate = () => {
    return startDate;
  };
  const getEndDate = () => {
    return endDate;
  };

  const handleApplyButton = async () => {
    if (addedService.length === 0 || !cityId) {
      setModalVisible(true);
    } else {
      let temp = addedService.map((item, index) => {
        let [serviceId, serviceName, icon] = item.split('[SPACE]');
        return serviceId;
      });
      let serviceIds = temp.join(',');

      let locationType = communeId
        ? 'COMMUNE'
        : districtId
        ? 'DISTRICT'
        : 'CITY';
      let locationId = communeId ? communeId : districtId ? districtId : cityId;
      let startDate = getStartDate().format('DD-MM-YYYY');
      let endDate = getEndDate().format('DD-MM-YYYY');
      console.log({serviceIds, locationId, locationType, startDate, endDate});
      setFilter({
        serviceIds,
        locationId,
        locationType,
        startDate,
        endDate,
      });
      setAddedServices(addedService);
      setStartDates(getStartDate());
      setEndDates(getEndDate());
      setCityIds(cityId);
      setDistrictIds(districtId);
      setCommuneIds(communeId);
      navigation.goBack();
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Tùy chỉnh bộ lọc"
        isBackButton={true}
        statusBarColor="white"
      />
      <SafeAreaView style={{flex: 1, marginHorizontal: '4%'}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.box}>
            <View style={styles.boxHeader}>
              <Image
                source={require('../../../assets/images/type/support.png')}
                style={{
                  height: 20,
                  width: 20,
                }}
              />
              <Text style={styles.tittleText}>Dịch vụ sửa chữa</Text>
              <TouchableOpacity
                style={styles.editTouch}
                onPress={() =>
                  navigation.push('SearchServiceFilterScreen', {
                    addedService,
                    setAddedService,
                  })
                }>
                <Text style={styles.editText}>Thêm</Text>
              </TouchableOpacity>
            </View>

            {addedService.length !== 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginBottom: 5,
                }}>
                {addedService.map((item, index) => {
                  const [serviceId, serviceName, icon] = item.split('[SPACE]');
                  return (
                    <View style={styles.selectedService} key={index.toString()}>
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
            ) : null}
          </View>
          <View style={styles.box}>
            <View style={styles.boxHeader}>
              <Image
                source={require('../../../assets/images/type/address.png')}
                style={{
                  height: 20,
                  width: 20,
                }}
              />
              <Text style={styles.tittleText}>Khu vực muốn sửa</Text>
            </View>
            <View style={styles.valueSpace}>
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
              />
              <Ionicons
                name="chevron-down-sharp"
                size={16}
                style={{
                  color: 'black',
                  alignSelf: 'center',
                }}
              />
            </View>
            <View style={styles.valueSpace}>
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
              />
              <Ionicons
                name="chevron-down-sharp"
                size={16}
                style={{
                  color: 'black',
                  alignSelf: 'center',
                }}
              />
            </View>
            <View style={styles.valueSpace}>
              <RNPickerSelect
                value={communeId}
                fixAndroidTouchableBug={true}
                onValueChange={value => {
                  setCommuneId(value);
                }}
                placeholder={{
                  label: 'Phường/Xã',
                  value: null,
                }}
                useNativeAndroidPickerStyle={false}
                style={styles.pickerStyle}
                items={listCommune}
              />
              <Ionicons
                name="chevron-down-sharp"
                size={16}
                style={{
                  color: 'black',
                  alignSelf: 'center',
                }}
              />
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.boxHeader}>
              <Image
                source={require('../../../assets/images/type/calendar.png')}
                style={{
                  height: 20,
                  width: 20,
                }}
              />
              <Text style={styles.tittleText}>Chọn ngày muốn sửa</Text>
            </View>
            <View style={styles.dateForm}>
              <Text style={styles.dateLabel}>Từ ngày</Text>
              <View style={{marginTop: 10, width: '65%'}}>
                <TouchableOpacity
                  style={styles.datePicker}
                  onPress={() => {
                    setStartDateVisible(true);
                  }}>
                  <Text style={styles.textBold}>
                    {startDate.format('DD/MM/YYYY')}
                  </Text>
                  <Ionicons
                    name="chevron-down-sharp"
                    size={20}
                    style={{
                      marginTop: 3,
                      color: 'black',
                      marginLeft: 'auto',
                    }}
                  />
                  <CustomDatePicker
                    isVisible={startDateVisible}
                    handleConfirm={handlerStartDateConfirm}
                    hideDatePicker={hideStartDatePicker}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.dateForm}>
              <Text style={styles.dateLabel}>Đến ngày</Text>
              <View style={{marginTop: 10, width: '65%'}}>
                <TouchableOpacity
                  style={styles.datePicker}
                  onPress={() => setEndDateVisible(true)}>
                  <Text style={styles.textBold}>
                    {endDate.format('DD/MM/YYYY')}
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
                  <CustomDatePicker
                    isVisible={endDateVisible}
                    handleConfirm={handlerEndDateConfirm}
                    hideDatePicker={hideEndDatePicker}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        <Button
          style={{
            marginVertical: 8,
            width: '100%',
            alignSelf: 'center',
          }}
          onPress={handleApplyButton}
          buttonText="ÁP DỤNG"
        />
        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          modalRatio={0.4}>
          <Text style={styles.modalText}>Lưu ý</Text>
          <View style={{marginTop: 20, marginBottom: 40}}>
            <Text>Vui lòng chọn ít nhất 1 dịch vụ.</Text>
            <Text>
              Chọn khu vực muốn sửa mức chi tiết ít nhất là thành phố.
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              style={[styles.button, styles.buttonOpen]}
              onPress={() => {
                setModalVisible(false);
              }}>
              <Text style={styles.textStyle}>Đồng ý</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 5,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 10,
  },
  buttonOpen: {
    backgroundColor: '#FEC54B',
  },
  box: {
    backgroundColor: '#F0F0F0',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    height: 'auto',
  },
  boxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  tittleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginLeft: 20,
    marginBottom: 3,
  },
  selectedService: {
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 10,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#CACACA',
    marginTop: 15,
    marginRight: 15,
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
  valueSpace: {
    height: 30,
    width: '55%',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    marginLeft: 40,
    marginBottom: 8,
  },
  pickerStyle: {
    inputIOS: {
      fontSize: 12,
      color: 'black',
    },
    inputAndroid: {
      fontSize: 12,
      color: 'black',
      padding: 3,
    },
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'red',
  },
  dateForm: {
    flexDirection: 'row',
    marginLeft: 40,
    alignItems: 'center',
  },
  dateLabel: {
    color: 'black',
    fontSize: 15,
    width: '35%',
  },
  datePicker: {
    flexDirection: 'row',
    width: '80%',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
});
