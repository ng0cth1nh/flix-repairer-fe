import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import {RadioButton} from 'react-native-paper';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Clipboard from '@react-native-community/clipboard';
import Button from '../../components/SubmitButton';
const {height} = Dimensions.get('window');
import {
  fetchRequests,
  setIsLoading,
  selectIsLoading,
  fetchFixedService,
  confirmPayment,
} from '../../features/request/requestSlice';
import useAxios from '../../hooks/useAxios';
import Toast from 'react-native-toast-message';
import ApiConstants from '../../constants/Api';
import NotFound from '../../components/NotFound';
import useFetchData from '../../hooks/useFetchData';
import ProgressLoader from 'rn-progress-loader';
import {useSelector, useDispatch} from 'react-redux';
import {RequestStatus} from '../../utils/util';
import TopHeaderComponent from '../../components/TopHeaderComponent';
import {formatCurrency} from '../../utils/FormattingCurrency';

const InvoiceScreen = ({route, navigation}) => {
  const {service, isShowConfirm} = route.params;
  const isLoading = useSelector(selectIsLoading);
  const [isLoad, setIsLoad] = useState(false);
  const repairerAPI = useAxios();
  const [fixedService, setFixedService] = useState(null);
  const dispatch = useDispatch();
  const renderServiceItem = ({item}) => {
    return (
      <View style={[styles.serviceRow, {paddingHorizontal: 10}]}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={[styles.textBold, {marginLeft: 'auto', fontSize: 12}]}>
          {`${formatCurrency(item.price.toString())} vnđ`}
        </Text>
      </View>
    );
  };
  const copyToClipboard = () => {
    Clipboard.setString(data.requestCode);
    Toast.show({
      type: 'customToast',
      text1: 'Đã sao chép vào khay nhớ tạm',
    });
  };

  useEffect(() => {
    (async () => {
      try {
        await setIsLoad(true);
        let data = await dispatch(
          fetchFixedService({
            repairerAPI,
            requestCode: service.requestCode,
          }),
        ).unwrap();
        setFixedService(data);
      } catch (err) {
        console.log(err);
      } finally {
        await setIsLoad(false);
      }
    })();
  }, []);

  const handleConfirmPayment = async () => {
    try {
      await dispatch(setIsLoading());
      await dispatch(
        confirmPayment({
          repairerAPI,
          body: {requestCode: service.requestCode},
        }),
      ).unwrap();
      Toast.show({
        type: 'customToast',
        text1: 'Xác nhận thanh toán thành công',
      });
      dispatch(
        fetchRequests({repairerAPI, status: RequestStatus.PAYMENT_WAITING}),
      ).unwrap();
      navigation.goBack();
      dispatch(
        fetchRequests({repairerAPI, status: RequestStatus.DONE}),
      ).unwrap();
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
  };

  const {loading, data, isError} = useFetchData(ApiConstants.GET_INVOICE_API, {
    params: {requestCode: service.requestCode},
  });

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Xem hóa đơn"
        isBackButton={true}
        statusBarColor="white"
      />
      {isError ? <NotFound /> : null}
      {loading || isLoad ? (
        <ActivityIndicator
          size="small"
          color="#FEC54B"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      ) : null}
      <ProgressLoader
        visible={isLoading}
        isModal={true}
        isHUD={true}
        hudColor={'#FEC54B'}
        color={'#000000'}
      />
      {data !== null ? (
        <SafeAreaView style={{flex: 1, marginHorizontal: '4%'}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.box, {marginTop: 12}]}>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#CACACA',
                  paddingBottom: 10,
                }}>
                <View style={styles.boxHeader}>
                  <Image
                    source={require('../../../assets/images/type/user.png')}
                    style={{
                      height: 18,
                      width: 18,
                    }}
                  />
                  <Text style={styles.tittleText}>Khách hàng</Text>
                </View>
                <View style={styles.boxBody}>
                  <Image
                    source={{uri: data.customerAvatar}}
                    style={{
                      width: '15%',
                      aspectRatio: 0.85,
                      borderRadius: 10,
                      marginLeft: 10,
                    }}
                  />
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <View style={styles.boxBodyContent}>
                      <Text style={styles.textBold}>
                        {`${data.customerName} - ${data.customerPhone}`}
                      </Text>
                      <Text style={{color: 'black', marginBottom: 5}}>
                        {data.customerAddress}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.boxHeader}>
                  <Image
                    source={require('../../../assets/images/type/repairman.png')}
                    style={{
                      height: 24,
                      width: 24,
                    }}
                  />
                  <Text style={[styles.tittleText, {marginLeft: 12}]}>
                    Thợ sửa chữa
                  </Text>
                </View>
                <View style={styles.boxBody}>
                  <Image
                    source={{uri: data.repairerAvatar}}
                    style={{
                      width: '15%',
                      aspectRatio: 0.85,
                      borderRadius: 10,
                      marginLeft: 10,
                    }}
                  />
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <View style={styles.boxBodyContent}>
                      <Text style={styles.textBold}>
                        {`${data.repairerName} - ${data.repairerPhone}`}
                      </Text>
                      <Text style={{color: 'black', marginBottom: 5}}>
                        {data.repairerAddress}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.boxHeader}>
                  <Image
                    source={require('../../../assets/images/type/support.png')}
                    style={{
                      height: 18,
                      width: 18,
                    }}
                  />
                  <Text style={styles.tittleText}>Dịch vụ sửa chữa</Text>
                </View>
                <View style={styles.boxBody}>
                  <Image
                    source={{uri: service.image}}
                    style={{
                      height: height * 0.12,
                      width: height * 0.111,
                      borderRadius: 10,
                      alignSelf: 'center',
                      marginHorizontal: '2%',
                    }}
                  />
                  <View style={styles.boxBodyContent}>
                    <Text style={[styles.textBold, {fontSize: 24}]}>
                      {service.serviceName}
                    </Text>
                    <Text
                      style={{fontSize: 16, color: 'black', marginVertical: 6}}>
                      Phí dịch vụ kiểm tra
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.textBold}>{`${formatCurrency(
                        data.inspectionPrice.toString(),
                      )} vnđ`}</Text>
                      <TouchableOpacity style={styles.viewServiceButton}>
                        <Text style={styles.textBold}>Xem giá dịch vụ</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              {fixedService ? (
                <>
                  {fixedService.subServices !== null &&
                  fixedService.subServices.length !== 0 ? (
                    <View style={{marginTop: 15}}>
                      <Text style={[styles.textBold, {fontSize: 18}]}>
                        Dịch vụ đã sửa chi tiết
                      </Text>
                      <FlatList
                        data={fixedService.subServices}
                        renderItem={renderServiceItem}
                        keyExtractor={item => item.id}
                      />
                      <View style={[styles.serviceRow, {marginLeft: 10}]}>
                        <Text style={styles.textBold}>Tổng</Text>
                        <Text style={styles.servicePrice}>{`${formatCurrency(
                          data.totalSubServicePrice.toString(),
                        )} vnđ`}</Text>
                      </View>
                    </View>
                  ) : null}
                  {fixedService.accessories !== null &&
                  fixedService.accessories.length !== 0 ? (
                    <View style={{marginTop: 15}}>
                      <Text style={[styles.textBold, {fontSize: 18}]}>
                        Linh kiện đã thay
                      </Text>
                      <FlatList
                        data={fixedService.accessories}
                        renderItem={renderServiceItem}
                        keyExtractor={item => item.id}
                      />
                      <View style={[styles.serviceRow, {marginLeft: 10}]}>
                        <Text style={styles.textBold}>Tổng</Text>
                        <Text style={styles.servicePrice}>{`${formatCurrency(
                          data.totalAccessoryPrice.toString(),
                        )} vnđ`}</Text>
                      </View>
                    </View>
                  ) : null}
                  {fixedService.extraServices !== null &&
                  fixedService.extraServices.length !== 0 ? (
                    <View style={{marginTop: 15}}>
                      <Text style={[styles.textBold, {fontSize: 18}]}>
                        Dịch vụ bên ngoài
                      </Text>
                      <FlatList
                        data={fixedService.extraServices}
                        renderItem={renderServiceItem}
                        keyExtractor={item => item.id}
                      />
                      <View style={[styles.serviceRow, {marginLeft: 10}]}>
                        <Text style={styles.textBold}>Tổng</Text>
                        <Text style={styles.servicePrice}>{`${formatCurrency(
                          data.totalExtraServicePrice.toString(),
                        )} vnđ`}</Text>
                      </View>
                    </View>
                  ) : null}
                </>
              ) : null}
              <View style={[styles.boxHeader, {marginTop: 18}]}>
                <Image
                  source={require('../../../assets/images/type/calendar.png')}
                  style={{
                    height: 18,
                    width: 18,
                  }}
                />
                <Text style={styles.tittleText}>Ngày bắt đầu sửa</Text>
              </View>
              <View style={{flex: 4, marginLeft: 40}}>
                <View style={styles.datePicker}>
                  <Text style={styles.textBold}>
                    {moment(data.expectFixingTime).format('HH:mm - DD/MM/YYYY')}
                  </Text>
                </View>
              </View>
              {data.voucherDiscount ? (
                <>
                  <View style={styles.boxHeader}>
                    <Image
                      source={require('../../../assets/images/type/coupon.png')}
                      style={{
                        height: 20,
                        width: 20,
                      }}
                    />
                    <Text style={styles.tittleText}>Flix voucher</Text>
                  </View>
                  {/* <Text style={{marginLeft: 40, color: '#12B76A', fontWeight: 'bold'}}>
          Giảm 10%
        </Text>
        <View
          style={{
            flex: 3,
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginVertical: 5,
          }}>
          <RadioButton value="Tiền mặt" status="checked" color="#FFBC00" />
          <Text style={{color: 'black', fontSize: 16, width: '80%'}}>
            Mã giảm giá áp dụng cho tất cả các shop ở Hà Nội
          </Text>
        </View> */}
                </>
              ) : null}

              <View style={styles.boxHeader}>
                <Image
                  source={require('../../../assets/images/type/wallet.png')}
                  style={{
                    height: 22,
                    width: 22,
                  }}
                />
                <Text style={styles.tittleText}>Phương thức thanh toán</Text>
              </View>
              <View
                style={{
                  flex: 3,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 30,
                }}>
                <RadioButton
                  value={
                    data.paymentMethod === 'CASH'
                      ? 'Tiền mặt'
                      : data.paymentMethod
                  }
                  status="checked"
                  color="#FFBC00"
                />
                <Text style={{color: 'black', fontSize: 16}}>Tiền mặt</Text>
              </View>
              <View style={styles.boxHeader}>
                <Image
                  source={require('../../../assets/images/type/info.png')}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
                <Text style={styles.tittleText}>Mã yêu cầu</Text>
                <TouchableOpacity
                  style={{marginLeft: 'auto', marginBottom: 3}}
                  onPress={copyToClipboard}>
                  <Text
                    style={{
                      color: '#FEC54B',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    {data.requestCode}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                <Text style={{color: 'black', fontSize: 16, marginLeft: 40}}>
                  Thời gian tạo
                </Text>
                <Text style={{marginLeft: 'auto'}}>
                  {moment(data.createdAt).format('HH:mm - DD/MM/YYYY')}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{color: 'black', fontSize: 16, marginLeft: 40}}>
                  Thời gian xác nhận
                </Text>
                <Text style={{marginLeft: 'auto'}}>
                  {moment(data.approvedTime).format('HH:mm - DD/MM/YYYY')}
                </Text>
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#CACACA',
              }}>
              <View style={styles.serviceRow}>
                <Text style={styles.serviceName}>Phí dịch vụ kiểm tra</Text>
                <Text style={styles.servicePrice}>{`${formatCurrency(
                  data.inspectionPrice.toString(),
                )} vnđ`}</Text>
              </View>
              <View style={styles.serviceRow}>
                <Text style={styles.serviceName}>Tổng dịch vụ chi tiết</Text>
                <Text style={styles.servicePrice}>{`${formatCurrency(
                  data.totalSubServicePrice.toString(),
                )} vnđ`}</Text>
              </View>
              {data.totalAccessoryPrice && data.totalAccessoryPrice !== 0 ? (
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceName}>Tổng linh kiện đã thay</Text>
                  <Text style={styles.servicePrice}>{`${formatCurrency(
                    data.totalAccessoryPrice.toString(),
                  )} vnđ`}</Text>
                </View>
              ) : null}
              {data.totalExtraServicePrice &&
              data.totalExtraServicePrice !== 0 ? (
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceName}>Tổng dịch vụ bên ngoài</Text>
                  <Text style={styles.servicePrice}>{`${formatCurrency(
                    data.totalExtraServicePrice.toString(),
                  )} vnđ`}</Text>
                </View>
              ) : null}
            </View>
            <View style={{paddingHorizontal: 10}}>
              <View style={styles.serviceRow}>
                <Text style={styles.textBold}>Tổng</Text>
                <Text style={styles.servicePrice}>{`${formatCurrency(
                  data.totalPrice.toString(),
                )} vnđ`}</Text>
              </View>
              <View style={styles.serviceRow}>
                <Text style={styles.serviceName}>Thuế VAT(5%)</Text>
                <Text style={styles.servicePrice}>{`${formatCurrency(
                  data.vatPrice.toString(),
                )} vnđ`}</Text>
              </View>
              {data.voucherDiscount ? (
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceName}>Voucher</Text>
                  <Text style={styles.servicePrice}>{`-${formatCurrency(
                    data.totalDiscount.toString(),
                  )} vnđ`}</Text>
                </View>
              ) : null}
              <View style={[styles.serviceRow, {marginBottom: 16}]}>
                <Text style={styles.textBold}>TỔNG THANH TOÁN</Text>
                <Text style={styles.servicePrice}>{`${formatCurrency(
                  data.actualPrice.toString(),
                )} vnđ`}</Text>
              </View>
            </View>
          </ScrollView>
          {isShowConfirm && data.paymentMethod === 'CASH' ? (
            <Button
              style={{
                marginVertical: 8,
                width: '100%',
                alignSelf: 'center',
              }}
              onPress={handleConfirmPayment}
              buttonText="Xác nhận đã thanh toán"
            />
          ) : null}
        </SafeAreaView>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'black',
    marginTop: getStatusBarHeight(),
    paddingBottom: 15,
    alignSelf: 'center',
  },
  box: {
    height: 'auto',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: '6%',
    paddingBottom: 16,
    paddingTop: 10,
    marginVertical: 6,
  },
  boxHeader: {
    flexDirection: 'row',
    flex: 2,
    alignItems: 'center',
    marginVertical: 8,
  },
  tittleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
    marginBottom: 3,
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
  boxBody: {
    flex: 8,
    flexDirection: 'row',
    marginVertical: 1,
  },
  boxBodyContent: {
    flex: 1,
    marginLeft: 10,
    height: '70%',
    width: '100%',
    paddingBottom: 5,
    justifyContent: 'space-between',
  },
  viewServiceButton: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FEC54B',
  },
  textBold: {
    fontWeight: 'bold',
    color: 'black',
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
  serviceRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  serviceName: {
    color: 'black',
  },
  servicePrice: {
    marginLeft: 'auto',
    color: '#E67F1E',
    fontWeight: '600',
  },
});

export default InvoiceScreen;
