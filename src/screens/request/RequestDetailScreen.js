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
import moment from 'moment';
import TopHeaderComponent from '../../components/TopHeaderComponent';
import RequestForm from '../../components/RequestForm';
import ApiConstants from '../../constants/Api';
import NotFound from '../../components/NotFound';
import useFetchData from '../../hooks/useFetchData';
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
  } = route.params;
  const [date, setDate] = useState(moment());
  const isLoading = useSelector(selectIsLoading);
  const [reason, setReason] = useState({index: 0, reason: CancelReasons[0]});
  const [modalVisible, setModalVisible] = useState(false);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [description, setDiscription] = useState('');
  const [contentOtherReason, setContentOtherReason] = useState('');
  const [fixedService, setFixedService] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const repairerAPI = useAxios();
  const dispatch = useDispatch();

  const showModal = () => {
    setWarningModalVisible(true);
  };
  const showInvoiceModal = () => {
    setInvoiceModalVisible(true);
  };

  useEffect(() => {
    if (isFetchFixedService) {
      (async () => {
        try {
          await setIsLoad(true);
          let data = await dispatch(
            fetchFixedService({
              repairerAPI,
              requestCode,
            }),
          ).unwrap();
          setFixedService(data);
        } catch (err) {
          console.log(err);
        } finally {
          await setIsLoad(false);
        }
      })();
    }
  }, []);

  const {loading, data, isError} = useFetchData(
    ApiConstants.GET_REQUEST_DETAIL_API,
    {
      params: {requestCode},
    },
  );

  const handlerCancelButtonClick = async () => {
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
        ? dispatch(
            fetchRequests({repairerAPI, status: RequestStatus.APPROVED}),
          ).unwrap()
        : dispatch(
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

  const handlerConfirmFixingButtonClick = async () => {
    try {
      await dispatch(setIsLoading());
      await dispatch(
        confirmFixingRequest({
          repairerAPI,
          body: {requestCode},
        }),
      ).unwrap();
      Toast.show({
        type: 'customToast',
        text1: 'Xác nhận đang sửa thành công',
      });
      dispatch(
        fetchRequests({repairerAPI, status: RequestStatus.FIXING}),
      ).unwrap();
      navigation.goBack();
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

  const handlerApproveRequestButtonClick = async () => {
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
  const handlerCreateInvoiceButtonClick = async () => {
    try {
      await setInvoiceModalVisible(false);
      await dispatch(setIsLoading());
      await dispatch(
        createInvoice({
          repairerAPI,
          body: {requestCode},
        }),
      ).unwrap();
      Toast.show({
        type: 'customToast',
        text1: 'Tạo hóa đơn thành công',
      });
      dispatch(
        fetchRequests({repairerAPI, status: RequestStatus.FIXING}),
      ).unwrap();
      navigation.goBack();
      dispatch(
        fetchRequests({repairerAPI, status: RequestStatus.PAYMENT_WAITING}),
      ).unwrap();
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
  };

  const handlerAddDetailServiceButtonClick = async () => {
    navigation.push('AddFixedServiceScreen', {
      requestCode: data.requestCode,
      serviceId: data.serviceId,
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
          <RequestForm
            submitButtonText={submitButtonText}
            date={date}
            setDate={setDate}
            data={data}
            fixedService={fixedService}
            description={description}
            handlerSubmitButtonClick={
              typeSubmitButtonClick === 'CONFIRM_FIXING'
                ? handlerConfirmFixingButtonClick
                : typeSubmitButtonClick === 'APPROVE_REQUEST'
                ? handlerApproveRequestButtonClick
                : typeSubmitButtonClick === 'CREATE_INVOICE'
                ? showInvoiceModal
                : null
            }
            isShowCancelButton={isShowCancelButton}
            isAddableDetailService={isAddableDetailService}
            handlerAddDetailServiceButtonClick={
              handlerAddDetailServiceButtonClick
            }
            handlerCancel={showModal}
            setDiscription={setDiscription}
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
              onPress={handlerCancelButtonClick}>
              <Text style={styles.textStyle}>ĐỒNG Ý</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>THOÁT</Text>
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
              <Text style={styles.textStyle}>CÓ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setWarningModalVisible(!warningModalVisible)}>
              <Text style={styles.textStyle}>THOÁT</Text>
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
              onPress={handlerCreateInvoiceButtonClick}>
              <Text style={styles.textStyle}>ĐỒNG Ý</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setInvoiceModalVisible(!invoiceModalVisible)}>
              <Text style={styles.textStyle}>THOÁT</Text>
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
