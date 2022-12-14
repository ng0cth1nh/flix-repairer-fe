import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import TopHeaderComponent from '../../components/TopHeaderComponent';
import RequestForm from '../../components/RequestForm';
import NotFound from '../../components/NotFound';
import CustomModal from '../../components/CustomModal';
import useAxios from '../../hooks/useAxios';
import Toast from 'react-native-toast-message';
import CancelReasons from '../../constants/CancelReasons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {
  fetchRequests,
  cancelRequest,
  confirmFixingRequest,
  approveRequest,
  setIsLoading,
  selectIsLoading,
  fetchFixedService,
  createInvoice,
  fetchRequestDetail,
  confirmPayment,
  selectRequests,
} from '../../features/request/requestSlice';
import ProgressLoader from 'rn-progress-loader';
import {useSelector, useDispatch} from 'react-redux';
import {RequestStatus} from '../../utils/util';
import Loading from '../../components/Loading';
import {fetchProfile} from '../../features/user/userSlice';
import {Context as AuthContext} from '../../context/AuthContext';
import disableFirebaseChat from '../../utils/DisableFirebaseChat';

const RequestDetailScreen = ({route, navigation}) => {
  const {
    requestCode,
    isShowCancelButton,
    isAddableDetailService = false,
    submitButtonText,
    typeSubmitButtonClick,
    isCancelFromApprovedStatus,
    isFetchFixedService = false,
    isShowSubmitButton,
    isNavigateFromNotiScreen = false,
    isEnableChatButton = false,
  } = route.params;
  let {state} = useContext(AuthContext);
  const isLoading = useSelector(selectIsLoading);
  const [reason, setReason] = useState({index: 0, reason: CancelReasons[0]});
  const [modalVisible, setModalVisible] = useState(false);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [contentOtherReason, setContentOtherReason] = useState('');
  const [fixedService, setFixedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(null);
  const repairerAPI = useAxios();
  const dispatch = useDispatch();
  const [showComment, setShowComment] = useState(false);
  const requests = useSelector(selectRequests);

  const showModal = () => {
    setWarningModalVisible(true);
  };
  const showInvoiceModal = () => {
    setInvoiceModalVisible(true);
  };

  const checkValidToDeleteConversation = () => {
    let temp =
      requests.approved &&
      requests.approved.findIndex(request => {
        return (
          request.customerId === data.customerId &&
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
          request.customerId === data.customerId &&
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
          request.customerId === data.customerId &&
          request.requestCode !== data.requestCode
        );
      });
    if (temp !== -1) {
      return false;
    }
    return true;
  };

  const loadData = async () => {
    try {
      await setLoading(true);
      if (isFetchFixedService) {
        let fixedService = await dispatch(
          fetchFixedService({
            repairerAPI,
            requestCode,
          }),
        ).unwrap();
        setFixedService(fixedService);
      }
      let data = await dispatch(
        fetchRequestDetail({
          repairerAPI,
          requestCode,
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
    if (fixedService) {
      (async () => {
        dispatch(fetchRequests({repairerAPI, status: RequestStatus.FIXING}));
      })();
    }
  }, [fixedService]);

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

  const handleCancelButtonClick = async () => {
    try {
      setModalVisible(false);
      await dispatch(setIsLoading());
      await dispatch(
        cancelRequest({
          repairerAPI,
          body: {requestCode, reason: contentOtherReason},
        }),
      ).unwrap();
      Toast.show({
        type: 'customToast',
        text1: 'H???y y??u c???u th??nh c??ng',
      });
      if (checkValidToDeleteConversation()) {
        disableFirebaseChat(state.userId, data.customerId, false);
      }
      isCancelFromApprovedStatus
        ? dispatch(fetchRequests({repairerAPI, status: RequestStatus.APPROVED}))
        : dispatch(fetchRequests({repairerAPI, status: RequestStatus.FIXING}));
      navigation.goBack();
      dispatch(fetchRequests({repairerAPI, status: RequestStatus.CANCELLED}));
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
  };

  const handleConfirmFixingButtonClick = async () => {
    try {
      await dispatch(setIsLoading());
      await dispatch(
        confirmFixingRequest({
          repairerAPI,
          body: {requestCode},
        }),
      ).unwrap();

      dispatch(fetchRequests({repairerAPI, status: RequestStatus.FIXING}));
      navigation.navigate('RequestHistoryScreen', {
        screen: 'FixingScreen',
      });
      Toast.show({
        type: 'customToast',
        text1: 'C???p nh???t tr???ng th??i th??nh c??ng',
      });
      dispatch(fetchRequests({repairerAPI, status: RequestStatus.APPROVED}));
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
  };

  const handleChatCLick = async () => {
    navigation.push('ChatScreen', {
      targetUserId: data.customerId,
      targetUserAvatar: data.avatar,
      targetUsername: data.customerName,
    });
  };

  const handleApproveRequestButtonClick = async () => {
    try {
      await dispatch(setIsLoading());
      await dispatch(
        approveRequest({
          repairerAPI,
          body: {requestCode},
        }),
      ).unwrap();
      Toast.show({
        type: 'customToast',
        text1: 'X??c nh???n y??u c???u th??nh c??ng',
      });
      disableFirebaseChat(state.userId, data.customerId, true);
      dispatch(fetchRequests({repairerAPI, status: RequestStatus.APPROVED}));
      navigation.navigate('RequestHistoryScreen', {
        screen: 'ApprovedScreen',
      });
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
  };
  const handleCreateInvoiceButtonClick = async () => {
    try {
      await setInvoiceModalVisible(false);
      await dispatch(setIsLoading());
      await dispatch(
        createInvoice({
          repairerAPI,
          body: {requestCode},
        }),
      ).unwrap();
      dispatch(
        fetchRequests({repairerAPI, status: RequestStatus.PAYMENT_WAITING}),
      );
      navigation.navigate('RequestHistoryScreen', {
        screen: 'PaymentWaitingScreen',
      });
      Toast.show({
        type: 'customToast',
        text1: 'T???o h??a ????n th??nh c??ng',
      });
      dispatch(fetchRequests({repairerAPI, status: RequestStatus.FIXING}));
      dispatch(fetchProfile(repairerAPI));
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
  };

  const handleConfirmPayment = async () => {
    try {
      await dispatch(setIsLoading());
      await dispatch(
        confirmPayment({
          repairerAPI,
          body: {requestCode},
        }),
      ).unwrap();
      if (checkValidToDeleteConversation()) {
        console.log('checkValidToDeleteConversation == true');
        disableFirebaseChat(state.userId, data.customerId, false);
      }
      dispatch(fetchRequests({repairerAPI, status: RequestStatus.DONE}));
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
      );
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
  };

  const handleAddDetailServiceButtonClick = async () => {
    let subServiceIds = [],
      extraServices = [],
      subServiceId = [],
      extraService = [],
      accessoryIds = [],
      accessoryId = [];

    if (fixedService.subServices || fixedService.subServices.length !== 0) {
      for (let item of fixedService.subServices) {
        subServiceIds.push(`${item.id}[SPACE]${item.name}[SPACE]${item.price}`);
        subServiceId.push({
          id: item.id,
          name: item.name,
          price: item.price,
        });
      }
    }
    if (fixedService.accessories || fixedService.accessories.length !== 0) {
      for (let item of fixedService.accessories) {
        accessoryIds.push(`${item.id}[SPACE]${item.name}[SPACE]${item.price}`);
        accessoryId.push({
          id: item.id,
          name: item.name,
          price: item.price,
        });
      }
    }
    if (fixedService.extraServices || fixedService.extraServices.length !== 0) {
      for (let item of fixedService.extraServices) {
        extraServices.push(
          `${item.name}[SPACE]${item.price}[SPACE]${item.description}[SPACE]${item.insuranceTime}`,
        );
        extraService.push({
          name: item.name,
          description: item.description,
          price: item.price,
          insuranceTime: item.insuranceTime,
        });
      }
    }
    navigation.push('AddFixedServiceScreen', {
      requestCode: data.requestCode,
      serviceId: data.serviceId,
      loadData,
      fixedService: {
        subServiceIds,
        extraServices,
        subServiceId,
        extraService,
        accessoryIds,
        accessoryId,
      },
    });
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Y??u c???u s???a ch???a"
        isBackButton={true}
        statusBarColor="white"
        isNavigateFromNotiScreen={isNavigateFromNotiScreen}
      />
      <SafeAreaView style={{flex: 1}}>
        {isError ? <NotFound /> : null}
        {loading ? <Loading /> : null}
        <ProgressLoader
          visible={isLoading}
          isModal={true}
          isHUD={true}
          hudColor={'#FEC54B'}
          color={'#000000'}
        />
        {data !== null ? (
          <RequestForm
            submitButtonText={submitButtonText}
            isShowSubmitButton={
              typeSubmitButtonClick === 'CONFIRM_INVOICE' &&
              data.paymentMethod !== 'CASH'
                ? false
                : isShowSubmitButton
            }
            handleClickGetSubServices={handleClickGetSubServices}
            data={data}
            fixedService={fixedService}
            handleSubmitButtonClick={
              typeSubmitButtonClick === 'CONFIRM_FIXING'
                ? handleConfirmFixingButtonClick
                : typeSubmitButtonClick === 'APPROVE_REQUEST'
                ? handleApproveRequestButtonClick
                : typeSubmitButtonClick === 'CREATE_INVOICE'
                ? showInvoiceModal
                : typeSubmitButtonClick === 'CONFIRM_INVOICE' &&
                  data.paymentMethod === 'CASH'
                ? handleConfirmPayment
                : null
            }
            isEnableChatButton={isEnableChatButton}
            chatHandler={handleChatCLick}
            isShowCancelButton={isShowCancelButton}
            isAddableDetailService={isAddableDetailService}
            handleAddDetailServiceButtonClick={
              handleAddDetailServiceButtonClick
            }
            handleCancel={showModal}
            editable={false}
            isRequestIdVisible={true}
          />
        ) : null}
        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          modalRatio={0.68}>
          <Text style={styles.modalText}>Ch???n l?? do h???y</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              width: '100%',
            }}>
            {CancelReasons.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setReason({index, reason: CancelReasons[index]});
                  }}
                  style={styles.box}
                  key={index}>
                  <RadioButton
                    value={item}
                    onPress={() => {
                      setReason({index, reason: CancelReasons[index]});
                    }}
                    status={index === reason.index ? 'checked' : 'unchecked'}
                    color="#FFBC00"
                  />
                  <Text style={styles.text}>{item}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              onPress={() => {
                setReason({index: -1, reason: contentOtherReason});
              }}
              style={styles.box}>
              <RadioButton
                onPress={() => {
                  setReason({index: -1, reason: contentOtherReason});
                }}
                status={reason.index === -1 ? 'checked' : 'unchecked'}
                color="#FFBC00"
              />
              <Text style={styles.text}>Kh??c</Text>
            </TouchableOpacity>
            <TextInput
              style={{
                backgroundColor: '#F0F0F0',
                borderRadius: 10,
                marginLeft: 34,
                paddingLeft: 10,
              }}
              numberOfLines={3}
              editable={reason.index === -1}
              onChangeText={text => setContentOtherReason(text)}
              value={contentOtherReason}
              placeholder="Nh???p l?? do kh??c"
              placeholderTextColor="#DFDFDF"
            />
          </ScrollView>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginVertical: 20,
            }}>
            <TouchableOpacity
              style={[styles.button, styles.buttonOpen]}
              onPress={handleCancelButtonClick}>
              <Text style={styles.textStyle}>?????NG ??</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>????NG</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
        <CustomModal
          modalVisible={warningModalVisible}
          setModalVisible={setWarningModalVisible}
          modalRatio={data && data.status === 'APPROVED' ? 0.32 : 0.28}>
          <Text style={styles.modalText}>
            B???n c?? ch???c ch???n mu???n h???y ????n s???a n??y kh??ng?
          </Text>
          {data && data.status === 'APPROVED' ? (
            <Text>
              B???n s??? b??? ph???t ti???n 20,000 vn?? n???u h???y tr?????c th???i h???n s???a ch???a
              trong v??ng 1 ti???ng
            </Text>
          ) : null}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginVertical: 20,
            }}>
            <TouchableOpacity
              style={[styles.button, styles.buttonOpen]}
              onPress={() => {
                setWarningModalVisible(false);
                setModalVisible(true);
              }}>
              <Text style={styles.textStyle}>?????NG ??</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setWarningModalVisible(!warningModalVisible)}>
              <Text style={styles.textStyle}>????NG</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
        <CustomModal
          modalVisible={invoiceModalVisible}
          setModalVisible={setInvoiceModalVisible}
          modalRatio={0.28}>
          <Text style={styles.modalText}>
            B???n c?? ch???c ch???n mu???n t???o h??a ????n kh??ng?
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginVertical: 20,
            }}>
            <TouchableOpacity
              style={[styles.button, styles.buttonOpen]}
              onPress={handleCreateInvoiceButtonClick}>
              <Text style={styles.textStyle}>?????NG ??</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setInvoiceModalVisible(!invoiceModalVisible)}>
              <Text style={styles.textStyle}>????NG</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
      </SafeAreaView>
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
  button: {
    width: '40%',
    borderRadius: 20,
    paddingVertical: 10,
  },
  buttonOpen: {
    backgroundColor: '#FEC54B',
  },
  buttonClose: {
    backgroundColor: '#F0F0F0',
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  box: {
    height: 'auto',
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default RequestDetailScreen;
