import React, {useState} from 'react';
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
  setIsLoading,
  selectIsLoading,
} from '../../features/request/requestSlice';
import {useSelector, useDispatch} from 'react-redux';
import {RequestStatus} from '../../utils/util';

const RequestDetailScreen = ({route, navigation}) => {
  const {requestCode} = route.params;
  const [date, setDate] = useState(moment());
  const isLoading = useSelector(selectIsLoading);
  const [reason, setReason] = useState({index: 0, reason: CancelReasons[0]});
  const [modalVisible, setModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [description, setDiscription] = useState('');
  const [contentOtherReason, setContentOtherReason] = useState('');
  const repairerAPI = useAxios();
  const dispatch = useDispatch();
  const showModal = () => {
    setWarningModalVisible(true);
  };
  function handlerButtonClick() {
    console.log(date);
  }

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
      dispatch(
        fetchRequests({repairerAPI, status: RequestStatus.PENDING}),
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
        {/* <ProgressLoader
        sible={isLoading}
        iModal={true}
        isHUD={true}
        dColor={'#FEC54B'}
        clor={'#000000'}
      /> */}
        {data !== null ? (
          <RequestForm
            buttonClicked={handlerButtonClick}
            buttonText="Hủy yêu cầu"
            date={date}
            setDate={setDate}
            data={data}
            description={description}
            handlerConfirmFixingButtonClick={handlerConfirmFixingButtonClick}
            handlerCancel={showModal}
            setDiscription={setDiscription}
            editable={false}
            isRequestIdVisible={true}
          />
        ) : null}
        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          modalRatio={0.8}>
          <Text style={styles.modalText}>Chọn lý do hủy</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
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
          setModalVisible={setModalVisible}
          modalRatio={0.38}>
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
              onPress={() => setModalVisible(!modalVisible)}>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default RequestDetailScreen;
