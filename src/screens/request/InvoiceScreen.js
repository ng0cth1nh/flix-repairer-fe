import React, {useState, useEffect, useContext} from 'react';
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
  fetchInvoice,
  confirmPayment,
  selectRequests,
} from '../../features/request/requestSlice';
import useAxios from '../../hooks/useAxios';
import Toast from 'react-native-toast-message';
import NotFound from '../../components/NotFound';
import ProgressLoader from 'rn-progress-loader';
import {useSelector, useDispatch} from 'react-redux';
import {RequestStatus} from '../../utils/util';
import TopHeaderComponent from '../../components/TopHeaderComponent';
import {formatCurrency} from '../../utils/FormattingCurrency';
import Loading from '../../components/Loading';
import {Context as AuthContext} from '../../context/AuthContext';
import disableFirebaseChat from '../../utils/DisableFirebaseChat';

const InvoiceScreen = ({route, navigation}) => {
  let {state} = useContext(AuthContext);
  const {service, isShowConfirm} = route.params;
  const isLoading = useSelector(selectIsLoading);
  const [isLoad, setIsLoad] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const repairerAPI = useAxios();
  const [fixedService, setFixedService] = useState(null);
  const dispatch = useDispatch();
  const requests = useSelector(selectRequests);

  const checkValidToDeleteConversation = () => {
    let temp =
      requests.approved &&
      requests.approved.findIndex(request => {
        return (
          request.customerId === service.customerId &&
          request.requestCode !== data.requestCode
        );
      });
    if (temp !== -1) {
      return false;
    }
    temp =
      requests.fixing &&
      requests.fixing.findIndex(request => {
        return (
          request.customerId === service.customerId &&
          request.requestCode !== data.requestCode
        );
      });
    if (temp !== -1) {
      return false;
    }
    temp =
      requests.paymentWaiting &&
      requests.paymentWaiting.findIndex(request => {
        return (
          request.customerId === service.customerId &&
          request.requestCode !== data.requestCode
        );
      });
    if (temp !== -1) {
      return false;
    }
    return true;
  };

  const renderServiceItem = ({item, index}) => {
    return (
      <View
        key={index.toString()}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '96%',
          alignSelf: 'center',
          marginVertical: 6,
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: 'black',
            flex: 12,
          }}>
          {item.name}
        </Text>
        <Text
          style={[
            styles.servicePrice,
            {
              flex: 5,
              textAlign: 'right',
            },
          ]}>{`${formatCurrency(item.price.toString())} vn??`}</Text>
      </View>
    );
  };
  const copyToClipboard = () => {
    Clipboard.setString(data.requestCode);
    Toast.show({
      type: 'customToast',
      text1: '???? sao ch??p v??o khay nh??? t???m',
    });
  };

  const handleConfirmPayment = async () => {
    try {
      await dispatch(setIsLoading());
      await dispatch(
        confirmPayment({
          repairerAPI,
          body: {requestCode: service.requestCode},
        }),
      ).unwrap();
      navigation.goBack();
      if (checkValidToDeleteConversation()) {
        console.log('checkValidToDeleteConversation == true');
        disableFirebaseChat(state.userId, service.customerId, false);
      }
      await dispatch(
        fetchRequests({repairerAPI, status: RequestStatus.DONE}),
      ).unwrap();
      navigation.navigate('RequestHistoryScreen', {
        screen: 'DoneScreen',
      });
      Toast.show({
        type: 'customToast',
        text1: 'X??c nh???n thanh to??n th??nh c??ng',
      });
      setShowComment(true);
      dispatch(
        fetchRequests({
          repairerAPI,
          status: RequestStatus.PAYMENT_WAITING,
        }),
      ).unwrap();
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
  };

  const loadData = async () => {
    try {
      await setLoading(true);
      let fixedService = await dispatch(
        fetchFixedService({
          repairerAPI,
          requestCode: service.requestCode,
        }),
      ).unwrap();
      setFixedService(fixedService);
      let data = await dispatch(
        fetchInvoice({
          repairerAPI,
          requestCode: service.requestCode,
        }),
      ).unwrap();
      setData(data);
    } catch (err) {
      setIsError(true);
    } finally {
      await setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadData();
    })();
  }, []);

  const handleClickGetSubServices = () => {
    navigation.push('ServicePriceScreen', {
      serviceId: data.serviceId,
      serviceName: data.serviceName,
    });
  };

  const handleRatingCustomer = async () => {
    navigation.push('CommentScreen', {
      data,
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Xem h??a ????n"
        isBackButton={true}
        statusBarColor="white"
        isNavigateFromNotiScreen={service.isNavigateFromNotiScreen}
      />
      {isError ? <NotFound /> : null}
      {loading || isLoad ? <Loading /> : null}
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
                    source={require('../../../assets/images/type/info.png')}
                    style={{
                      height: 20,
                      width: 20,
                    }}
                  />
                  <Text style={styles.tittleText}>M?? y??u c???u</Text>
                  <TouchableOpacity
                    style={[
                      {marginLeft: 'auto', marginBottom: 3},
                      styles.viewServiceButton,
                    ]}
                    onPress={copyToClipboard}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 14,
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
                  <Text style={{color: 'black', fontSize: 14, marginLeft: 20}}>
                    Th???i gian t???o
                  </Text>
                  <Text style={{marginLeft: 'auto', fontSize: 12}}>
                    {moment(data.createdAt).format('HH:mm - DD/MM/YYYY')}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'black', fontSize: 14, marginLeft: 20}}>
                    Th???i gian x??c nh???n
                  </Text>
                  <Text style={{marginLeft: 'auto', fontSize: 12}}>
                    {moment(data.approvedTime).format('HH:mm - DD/MM/YYYY')}
                  </Text>
                </View>
                <View style={styles.boxHeader}>
                  <Image
                    source={require('../../../assets/images/type/user.png')}
                    style={{
                      height: 18,
                      width: 18,
                    }}
                  />
                  <Text style={styles.tittleText}>Kh??ch h??ng</Text>
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
                    Th??? s???a ch???a
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
                  <Text style={styles.tittleText}>D???ch v??? s???a ch???a</Text>
                </View>
                <View style={styles.boxBody}>
                  <Image
                    source={{uri: data.serviceImage}}
                    style={{
                      height: height * 0.12,
                      width: height * 0.111,
                      borderRadius: 10,
                      alignSelf: 'center',
                      marginHorizontal: '2%',
                    }}
                  />
                  <View style={styles.boxBodyContent}>
                    <Text
                      style={[styles.textBold, {fontSize: 24}]}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {data.serviceName}
                    </Text>
                    <Text
                      style={{fontSize: 16, color: 'black', marginVertical: 6}}>
                      Ph?? d???ch v??? ki???m tra
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.textBold}>{`${formatCurrency(
                        data.inspectionPrice.toString(),
                      )} vn??`}</Text>
                      <TouchableOpacity
                        style={styles.viewServiceButton}
                        onPress={handleClickGetSubServices}>
                        <Text style={styles.textBold}>Xem gi?? d???ch v???</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              {fixedService ? (
                <>
                  {fixedService.subServices !== null &&
                  fixedService.subServices.length !== 0 ? (
                    <View style={{marginTop: 16}}>
                      <Text style={[styles.textBold, {fontSize: 18}]}>
                        D???ch v??? ???? s???a chi ti???t
                      </Text>
                      <FlatList
                        data={fixedService.subServices}
                        renderItem={renderServiceItem}
                        keyExtractor={item => item.id}
                      />
                      <View
                        style={[
                          styles.serviceRow,
                          {
                            width: '96%',
                            alignSelf: 'center',
                            justifyContent: 'space-around',
                          },
                        ]}>
                        <Text style={[styles.textBold, {fontSize: 16}]}>
                          T???ng
                        </Text>
                        <Text
                          style={styles.servicePriceBold}>{`${formatCurrency(
                          data.totalSubServicePrice.toString(),
                        )} vn??`}</Text>
                      </View>
                    </View>
                  ) : null}
                  {fixedService.accessories !== null &&
                  fixedService.accessories.length !== 0 ? (
                    <View style={{marginTop: 15}}>
                      <Text style={[styles.textBold, {fontSize: 18}]}>
                        Linh ki???n ???? thay
                      </Text>
                      <FlatList
                        data={fixedService.accessories}
                        renderItem={renderServiceItem}
                        keyExtractor={item => item.id}
                      />
                      <View
                        style={[
                          styles.serviceRow,
                          {
                            width: '96%',
                            alignSelf: 'center',
                            justifyContent: 'space-around',
                          },
                        ]}>
                        <Text style={[styles.textBold, {fontSize: 16}]}>
                          T???ng
                        </Text>
                        <Text
                          style={styles.servicePriceBold}>{`${formatCurrency(
                          data.totalAccessoryPrice.toString(),
                        )} vn??`}</Text>
                      </View>
                    </View>
                  ) : null}
                  {fixedService.extraServices !== null &&
                  fixedService.extraServices.length !== 0 ? (
                    <View style={{marginTop: 16}}>
                      <Text style={[styles.textBold, {fontSize: 18}]}>
                        D???ch v??? b??n ngo??i
                      </Text>
                      <FlatList
                        data={fixedService.extraServices}
                        renderItem={renderServiceItem}
                        keyExtractor={item => item.id}
                      />
                      <View
                        style={[
                          styles.serviceRow,
                          {
                            width: '96%',
                            alignSelf: 'center',
                            justifyContent: 'space-around',
                          },
                        ]}>
                        <Text style={[styles.textBold, {fontSize: 16}]}>
                          T???ng
                        </Text>
                        <Text
                          style={styles.servicePriceBold}>{`${formatCurrency(
                          data.totalExtraServicePrice.toString(),
                        )} vn??`}</Text>
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
                <Text style={styles.tittleText}>Ng??y b???t ?????u s???a</Text>
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
          Gi???m 10%
        </Text>
        <View
          style={{
            flex: 3,
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginVertical: 5,
          }}>
          <RadioButton value="Ti???n m???t" status="checked" color="#FFBC00" />
          <Text style={{color: 'black', fontSize: 16, width: '80%'}}>
            M?? gi???m gi?? ??p d???ng cho t???t c??? c??c shop ??? H?? N???i
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
                <Text style={styles.tittleText}>Ph????ng th???c thanh to??n</Text>
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
                      ? 'Ti???n m???t'
                      : data.paymentMethod
                  }
                  status="checked"
                  color="#FFBC00"
                />
                <Text style={{color: 'black', fontSize: 16}}>
                  {data.paymentMethod === 'CASH'
                    ? 'Ti???n m???t'
                    : data.paymentMethod}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginHorizontal: 10,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#CACACA',
              }}>
              <View style={styles.serviceRow}>
                <Text style={styles.serviceName}>Ph?? d???ch v??? ki???m tra</Text>
                <Text style={styles.servicePrice}>{`${formatCurrency(
                  data.inspectionPrice.toString(),
                )} vn??`}</Text>
              </View>
              <View style={styles.serviceRow}>
                <Text style={styles.serviceName}>T???ng d???ch v??? chi ti???t</Text>
                <Text style={styles.servicePrice}>{`${formatCurrency(
                  data.totalSubServicePrice.toString(),
                )} vn??`}</Text>
              </View>
              {data.totalAccessoryPrice && data.totalAccessoryPrice !== 0 ? (
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceName}>T???ng linh ki???n ???? thay</Text>
                  <Text style={styles.servicePrice}>{`${formatCurrency(
                    data.totalAccessoryPrice.toString(),
                  )} vn??`}</Text>
                </View>
              ) : null}
              {data.totalExtraServicePrice &&
              data.totalExtraServicePrice !== 0 ? (
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceName}>T???ng d???ch v??? b??n ngo??i</Text>
                  <Text style={styles.servicePrice}>{`${formatCurrency(
                    data.totalExtraServicePrice.toString(),
                  )} vn??`}</Text>
                </View>
              ) : null}
            </View>
            <View style={{paddingHorizontal: 10}}>
              <View style={styles.serviceRow}>
                <Text style={styles.textBold}>T???ng</Text>
                <Text style={styles.servicePrice}>{`${formatCurrency(
                  data.totalPrice.toString(),
                )} vn??`}</Text>
              </View>
              <View style={styles.serviceRow}>
                <Text style={styles.serviceName}>Thu??? VAT(5%)</Text>
                <Text style={styles.servicePrice}>{`${formatCurrency(
                  data.vatPrice.toString(),
                )} vn??`}</Text>
              </View>
              {data.voucherDiscount ? (
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceName}>Voucher</Text>
                  <Text style={styles.servicePrice}>{`-${formatCurrency(
                    data.totalDiscount.toString(),
                  )} vn??`}</Text>
                </View>
              ) : null}
              <View style={[styles.serviceRow, {marginBottom: 16}]}>
                <Text style={styles.textBold}>T???NG THANH TO??N</Text>
                <Text style={styles.servicePriceBold}>{`${formatCurrency(
                  data.actualPrice.toString(),
                )} vn??`}</Text>
              </View>
            </View>
          </ScrollView>
          {isShowConfirm &&
          data.paymentMethod === 'CASH' &&
          data.status !== 'DONE' ? (
            <Button
              style={{
                marginVertical: 8,
                width: '100%',
                alignSelf: 'center',
              }}
              onPress={handleConfirmPayment}
              buttonText="X??c nh???n ???? thanh to??n"
            />
          ) : null}
          {(data.status === 'DONE' && !data.isRepairerCommented) ||
          showComment ? (
            <Button
              style={{
                marginVertical: 8,
                width: '100%',
                alignSelf: 'center',
              }}
              onPress={handleRatingCustomer}
              buttonText="????nh gi?? kh??ch h??ng"
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
    paddingVertical: 4,
    width: 'auto',
    borderRadius: 10,
    backgroundColor: '#FEC54B',
    paddingHorizontal: 6,
  },
  textBold: {
    fontWeight: '600',
    color: 'black',
    fontSize: 14,
  },
  datePicker: {
    flexDirection: 'row',
    width: '68%',
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
    color: 'black',
    flex: 5,
    textAlign: 'right',
    fontSize: 12,
  },
  servicePriceBold: {
    color: 'black',
    fontWeight: 'bold',
    flex: 5,
    textAlign: 'right',
    fontSize: 14,
  },
});

export default InvoiceScreen;
