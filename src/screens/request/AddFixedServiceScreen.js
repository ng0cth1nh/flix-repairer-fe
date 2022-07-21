import {View, Text, SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
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
  const {requestCode, serviceId, loadData, fixedService} = route.params;
  const isLoading = useSelector(selectIsLoading);
  const [extraServices, setExtraServices] = useState(
    fixedService.extraServices,
  );
  const [extraService, setExtraService] = useState(fixedService.extraService);
  const [subServiceIds, setSubServiceIds] = useState(
    fixedService.subServiceIds,
  );
  const [subServiceId, setSubServiceId] = useState(fixedService.subServiceId);
  const [accessoryIds, setAccessoryIds] = useState(fixedService.accessoryIds);
  const [accessoryId, setAccessoryId] = useState(fixedService.accessoryId);
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
    try {
      await dispatch(setIsLoading());
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

      console.log('DATA SENT: ', {
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
      loadData();
      navigation.goBack();
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
  };

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
                        <Text
                          style={{
                            fontSize: 16,
                            color: 'black',
                            flex: 9,
                            marginLeft: 10,
                          }}>
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            styles.textBold,
                            {flex: 5, textAlign: 'right'},
                          ]}>
                          {`${formatCurrency(item.price.toString())} vnđ`}
                        </Text>
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
                        <Text
                          style={{
                            fontSize: 16,
                            color: 'black',
                            flex: 9,
                            marginLeft: 10,
                          }}>
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            styles.textBold,
                            {flex: 5, textAlign: 'right'},
                          ]}>
                          {`${formatCurrency(item.price.toString())} vnđ`}
                        </Text>
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
                      <View
                        key={index.toString()}
                        style={[
                          styles.serviceRow,
                          {
                            marginVertical: 6,
                            flexWrap: 'wrap',
                            paddingVertical: 6,
                          },
                        ]}>
                        <Checkbox
                          accessibilityLabel={item.name}
                          value={`${item.name}[SPACE]${item.price}[SPACE]${item.description}[SPACE]${item.insuranceTime}`}
                          colorScheme="yellow"
                          _icon={{color: 'black'}}
                        />
                        <Text
                          style={{
                            fontSize: 16,
                            color: 'black',
                            flex: 9,
                            marginLeft: 10,
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
                          <Text style={{color: 'black', width: '100%'}}>
                            {item.name}
                          </Text>
                        </Text>
                        <Text
                          onPress={() => {
                            navigation.push('AddExtraServiceScreen', {
                              item,
                              index,
                              extraService,
                              setExtraServices,
                              setExtraService,
                            });
                          }}
                          style={[
                            styles.textBold,
                            {flex: 5, textAlign: 'right'},
                          ]}>
                          <Text style={{color: 'black', width: '100%'}}>
                            {`${formatCurrency(item.price.toString())} vnđ`}
                          </Text>
                        </Text>
                      </View>
                    ))}
                  </Checkbox.Group>
                </NativeBaseProvider>
              ) : null}
            </View>
          </ScrollView>
        </View>

        <ProgressLoader
          visible={isLoading}
          isModal={true}
          isHUD={true}
          hudColor={'#FEC54B'}
          color={'#000000'}
        />
        <Button
          style={{
            marginVertical: 8,
            width: '92%',
            alignSelf: 'center',
          }}
          onPress={handleSubmitButton}
          buttonText="THÊM"
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
    paddingHorizontal: 16,
    height: 'auto',
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
