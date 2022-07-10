import {View, Text, SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {Checkbox, NativeBaseProvider} from 'native-base';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Button from '../../components/SubmitButton';
import TopHeaderComponent from '../../components/TopHeaderComponent';
import useFetchData from '../../hooks/useFetchData';
import ApiConstants from '../../constants/Api';
import ProgressLoader from 'rn-progress-loader';
import {
  fetchRequests,
  updateRequest,
  setIsLoading,
  selectIsLoading,
} from '../../features/request/requestSlice';
import {useSelector, useDispatch} from 'react-redux';
import useAxios from '../../hooks/useAxios';
import Toast from 'react-native-toast-message';
import {removeCommas, formatCurrency} from '../../utils/FormattingCurrency';

function AddFixedServiceScreen({route, navigation}) {
  const {requestCode, serviceId} = route.params;
  const isLoading = useSelector(selectIsLoading);
  const [extraServices, setExtraServices] = useState([]);
  const [extraService, setExtraService] = useState([]);
  const [subServiceIds, setSubServiceIds] = useState([]);
  const [subServiceId, setSubServiceId] = useState([]);
  const [accessoryIds, setAccessoryIds] = useState([]);
  const [accessoryId, setAccessoryId] = useState([]);
  const repairerAPI = useAxios();
  const dispatch = useDispatch();

  const handlerAddFixedAccessoriesButtonClick = async () => {
    navigation.push('AddFixedAccessoriesScreen', {
      requestCode,
      serviceId,
      accessoryIds,
      setAccessoryIds,
      setAccessoryId,
    });
  };
  const handlerAddExtraServiceButtonClick = async () => {
    navigation.push('AddExtraServiceScreen', {
      extraService,
      setExtraServices,
      setExtraService,
    });
  };
  const handlerAddSubServiceButtonClick = async () => {
    navigation.push('AddSubServiceScreen', {
      requestCode,
      serviceId,
      subServiceIds,
      setSubServiceId,
      setSubServiceIds,
    });
  };

  const getSubServiceIds = () => subServiceIds;
  const getAccessoryIds = () => accessoryIds;
  const getExtraServices = () => extraServices;

  const handleSubmitButton = async () => {
    let subServiceIds =
      getSubServiceIds() &&
      getSubServiceIds().map((item, index) => {
        let [id, name, price] = item.split('[SPACE]');
        return +id;
      });
    let accessoryIds =
      getAccessoryIds() &&
      getAccessoryIds().map((item, index) => {
        let [id, name, price] = item.split('[SPACE]');
        return +id;
      });
    let extraServices =
      getExtraServices() &&
      getExtraServices().map((item, index) => {
        let [name, price, description, insuranceTime] = item.split('[SPACE]');
        return {
          name,
          description,
          price: +removeCommas(price),
          insuranceTime: +insuranceTime,
        };
      });
    try {
      await dispatch(setIsLoading());
      console.log('DATA SENT: ', {
        repairerAPI,
        requestCode,
        subServiceIds,
        accessoryIds,
        extraServices,
      });
      await dispatch(
        updateRequest({
          repairerAPI,
          requestCode,
          subServiceIds,
          accessoryIds,
          extraServices,
        }),
      ).unwrap();
      Toast.show({
        type: 'customToast',
        text1: 'Cập nhật thành công',
      });
      navigation.goBack();
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
  };

  // const {loading, data, isError} = useFetchData(
  //   ApiConstants.GET_REQUEST_DETAIL_API,
  //   {
  //     params: {requestCode},
  //   },
  // );

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Dịch vụ đã sửa"
        isBackButton={true}
        statusBarColor="white"
      />
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            paddingBottom: 10,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.service}>
              <View style={styles.titleBox}>
                <Text style={[styles.textBold, {fontSize: 20}]}>
                  Dịch vụ đã sửa
                </Text>
                <TouchableOpacity onPress={handlerAddSubServiceButtonClick}>
                  <Text style={styles.editItem}>Thêm</Text>
                </TouchableOpacity>
              </View>
              {subServiceId.length !== 0 ? (
                <NativeBaseProvider>
                  <Checkbox.Group
                    onChange={setSubServiceIds}
                    value={subServiceIds}
                    accessibilityLabel="choose numbers">
                    {subServiceId.map((item, index) => (
                      <View key={index.toString()} style={styles.serviceRow}>
                        <Checkbox
                          accessibilityLabel={item.name}
                          value={`${item.id}[SPACE]${item.name}[SPACE]${item.price}`}
                          colorScheme="yellow"
                          _icon={{color: 'black'}}
                        />
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            paddingHorizontal: 20,
                          }}>
                          <Text style={{fontSize: 16, color: 'black'}}>
                            {item.name}
                          </Text>
                          <Text style={[styles.textBold, {marginLeft: 'auto'}]}>
                            {`${formatCurrency(item.price)} vnđ`}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </Checkbox.Group>
                </NativeBaseProvider>
              ) : null}
            </View>
            <View style={styles.service}>
              <View style={styles.titleBox}>
                <Text style={[styles.textBold, {fontSize: 20}]}>
                  Linh kiện đã thay
                </Text>
                <TouchableOpacity
                  onPress={handlerAddFixedAccessoriesButtonClick}>
                  <Text style={styles.editItem}>Thêm</Text>
                </TouchableOpacity>
              </View>
              {accessoryId.length !== 0 ? (
                <NativeBaseProvider>
                  <Checkbox.Group
                    onChange={setAccessoryIds}
                    value={accessoryIds}
                    accessibilityLabel="choose numbers">
                    {accessoryId.map((item, index) => (
                      <View key={index.toString()} style={styles.serviceRow}>
                        <Checkbox
                          accessibilityLabel={item.name}
                          value={`${item.id}[SPACE]${item.name}[SPACE]${item.price}`}
                          colorScheme="yellow"
                          _icon={{color: 'black'}}
                        />
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            paddingHorizontal: 20,
                          }}>
                          <Text style={{fontSize: 16, color: 'black'}}>
                            {item.name}
                          </Text>
                          <Text style={[styles.textBold, {marginLeft: 'auto'}]}>
                            {`${formatCurrency(item.price)} vnđ`}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </Checkbox.Group>
                </NativeBaseProvider>
              ) : null}
            </View>
            <View style={styles.service}>
              <View style={styles.titleBox}>
                <Text style={[styles.textBold, {fontSize: 20}]}>
                  Dịch vụ bên ngoài
                </Text>
                <TouchableOpacity onPress={handlerAddExtraServiceButtonClick}>
                  <Text style={styles.editItem}>Thêm</Text>
                </TouchableOpacity>
              </View>
              {extraService.length !== 0 ? (
                <NativeBaseProvider>
                  <Checkbox.Group
                    onChange={setExtraServices}
                    value={extraServices}
                    accessibilityLabel="choose numbers">
                    {extraService.map((item, index) => (
                      <View key={index.toString()} style={styles.serviceRow}>
                        <Checkbox
                          accessibilityLabel={item.name}
                          value={`${item.name}[SPACE]${item.price}[SPACE]${item.description}[SPACE]${item.insuranceTime}`}
                          colorScheme="yellow"
                          _icon={{color: 'black'}}
                        />
                        <TouchableOpacity
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            paddingHorizontal: 20,
                          }}
                          onPress={() => {
                            navigation.push('AddExtraServiceScreen', {
                              item,
                              index,
                              extraService,
                              setExtraServices,
                              setExtraService,
                            });
                          }}>
                          <Text style={{fontSize: 16, color: 'black'}}>
                            {item.name}
                          </Text>
                          <Text style={[styles.textBold, {marginLeft: 'auto'}]}>
                            {`${item.price} vnđ`}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </Checkbox.Group>
                </NativeBaseProvider>
              ) : null}
            </View>
          </ScrollView>
        </View>
        <Button
          style={{
            width: '80%',
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 20,
          }}
          onPress={handleSubmitButton}
          buttonText="THÊM"
        />
        <ProgressLoader
          visible={isLoading}
          isModal={true}
          isHUD={true}
          hudColor={'#FEC54B'}
          color={'#000000'}
        />
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: 'black',
    marginTop: getStatusBarHeight(),
    paddingBottom: 15,
    alignSelf: 'center',
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#CACACA',
    paddingRight: 20,
  },
  service: {paddingHorizontal: 20, marginTop: 15},
  titleBox: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editItem: {
    color: '#FFBC00',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#D3D3D3',
    marginVertical: 6,
    width: '100%',
  },
  textBold: {
    fontWeight: 'bold',
    color: 'black',
  },
});

export default AddFixedServiceScreen;
