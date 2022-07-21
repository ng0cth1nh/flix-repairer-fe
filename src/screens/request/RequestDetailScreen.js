import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
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
} from '../../features/request/requestSlice';
import {
  fetchSuggestRequests,
  fetchFilteredRequests,
  setIsLoading as setIsLoadingHome,
} from '../../features/home/homeSlice';
import ProgressLoader from 'rn-progress-loader';
import {useSelector, useDispatch} from 'react-redux';
import {RequestStatus} from '../../utils/util';

const RequestDetailScreen = ({route, navigation}) => {
  const {
    requestCode,
    isShowCancelButton,
    isAddableDetailService,
    submitButtonText,
    typeSubmitButtonClick,
    filter,
    buttonIndex,
    setRenderList,
    isCancelFromApprovedStatus,
    isFetchFixedService,
    isShowSubmitButton,
  } = route.params;

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

  const showModal = () => {
    setWarningModalVisible(true);
  };
  const showInvoiceModal = () => {
    setInvoiceModalVisible(true);
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
        text1: 'Hủy yêu cầu thành công',
      });
      isCancelFromApprovedStatus
        ? await dispatch(
            fetchRequests({repairerAPI, status: RequestStatus.APPROVED}),
          ).unwrap()
        : await dispatch(
            fetchRequests({repairerAPI, status: RequestStatus.FIXING}),
          ).unwrap();
      navigation.goBack();
      dispatch(
        fetchRequests({repairerAPI, status: RequestStatus.CANCELLED}),
      ).unwrap();
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

      await dispatch(
        fetchRequests({repairerAPI, status: RequestStatus.FIXING}),
      ).unwrap();
      navigation.navigate('RequestHistoryScreen', {
        screen: 'FixingScreen',
      });
      Toast.show({
        type: 'customToast',
        text1: 'Xác nhận đang sửa thành công',
      });
      dispatch(
        fetchRequests({repairerAPI, status: RequestStatus.APPROVED}),
      ).unwrap();
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
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
        text1: 'Xác nhận yêu cầu thành công',
      });
      await dispatch(setIsLoadingHome());
      let data = null;
      if (buttonIndex === 0) {
        data = (
          await dispatch(
            fetchSuggestRequests({repairerAPI, type: 'SUGGESTED'}),
          ).unwrap()
        ).requests;
      } else if (buttonIndex === 1) {
        data = (
          await dispatch(
            fetchSuggestRequests({repairerAPI, type: 'INTERESTED'}),
          ).unwrap()
        ).requests;
      } else {
        data = await dispatch(
          fetchFilteredRequests({repairerAPI, param: filter}),
        ).unwrap();
      }
      setRenderList(data);
      navigation.goBack();
      dispatch(fetchRequests({repairerAPI, status: RequestStatus.APPROVED}));
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
      await dispatch(
        fetchRequests({repairerAPI, status: RequestStatus.PAYMENT_WAITING}),
      ).unwrap();
      navigation.navigate('RequestHistoryScreen', {
        screen: 'PaymentWaitingScreen',
      });
      Toast.show({
        type: 'customToast',
        text1: 'Tạo hóa đơn thành công',
      });
      dispatch(
        fetchRequests({repairerAPI, status: RequestStatus.FIXING}),
      ).unwrap();
      navigation.goBack();
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
        title="Yêu cầu sửa chữa"
        isBackButton={true}
        statusBarColor="white"
      />
      <SafeAreaView style={{flex: 1}}>
        {isError ? <NotFound /> : null}
        {loading ? (
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
          <RequestForm
            submitButtonText={submitButtonText}
            isShowSubmitButton={isShowSubmitButton}
            data={data}
            fixedService={fixedService}
            handleSubmitButtonClick={
              typeSubmitButtonClick === 'CONFIRM_FIXING'
                ? handleConfirmFixingButtonClick
                : typeSubmitButtonClick === 'APPROVE_REQUEST'
                ? handleApproveRequestButtonClick
                : typeSubmitButtonClick === 'CREATE_INVOICE'
                ? showInvoiceModal
                : null
            }
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
          <Text style={styles.modalText}>Chọn lý do hủy</Text>
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
              <Text style={styles.text}>Khác</Text>
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
              placeholder="Nhập lý do khác"
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
              <Text style={styles.textStyle}>ĐỒNG Ý</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>ĐÓNG</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
        <CustomModal
          modalVisible={warningModalVisible}
          setModalVisible={setWarningModalVisible}
          modalRatio={0.34}>
          <Text style={styles.modalText}>
            Bạn có chắc chắn muốn hủy đơn sửa này không?
          </Text>
          <Text>Khi hủy đơn sửa bạn sẽ bị trừ điểm và tín nhiệm</Text>
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
              <Text style={styles.textStyle}>ĐỒNG Ý</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setWarningModalVisible(!warningModalVisible)}>
              <Text style={styles.textStyle}>ĐÓNG</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
        <CustomModal
          modalVisible={invoiceModalVisible}
          setModalVisible={setInvoiceModalVisible}
          modalRatio={0.3}>
          <Text style={styles.modalText}>
            Bạn có chắc chắn muốn tạo hóa đơn không?
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
              <Text style={styles.textStyle}>ĐỒNG Ý</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setInvoiceModalVisible(!invoiceModalVisible)}>
              <Text style={styles.textStyle}>ĐÓNG</Text>
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
