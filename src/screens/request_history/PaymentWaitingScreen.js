import React, {useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import RequestItem from '../../components/RequestItem';
import Empty from '../../components/Empty';
import {RequestStatus} from '../../utils/util';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchRequests,
  selectRequests,
  selectIsLoading,
  setIsLoading,
  selectErrorMessage,
} from '../../features/request/requestSlice';
import useAxios from '../../hooks/useAxios';
import NotFound from '../../components/NotFound';
import Loading from '../../components/Loading';

const PaymentWaitingScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const repairerAPI = useAxios();
  const [refreshControl, setRefreshControl] = useState(false);
  const isLoading = useSelector(selectIsLoading);
  const requests = useSelector(selectRequests);
  const errorMessage = useSelector(selectErrorMessage);

  const handleGetInvoiceButton = async service => {
    navigation.push('InvoiceScreen', {
      service,
      isShowConfirm: true,
    });
  };

  const handleNavigationToDetailRequest = async requestCode => {
    navigation.push('RequestDetailScreen', {
      requestCode,
      isFetchFixedService: true,
      isShowCancelButton: false,
      typeSubmitButtonClick: 'CONFIRM_INVOICE',
      submitButtonText: 'Xác nhận đã thanh toán',
      isShowSubmitButton: true,
    });
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {errorMessage ? (
            <NotFound />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={requests.paymentWaiting}
              style={{marginHorizontal: 20}}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={Empty}
              refreshControl={
                <RefreshControl
                  refreshing={refreshControl}
                  onRefresh={async () => {
                    try {
                      setRefreshControl(true);
                      await dispatch(
                        fetchRequests({
                          repairerAPI,
                          status: RequestStatus.PAYMENT_WAITING,
                        }),
                      );
                      await setIsLoading(true);
                      dispatch(
                        fetchRequests({
                          repairerAPI,
                          status: RequestStatus.DONE,
                        }),
                      );
                      dispatch(
                        fetchRequests({
                          repairerAPI,
                          status: RequestStatus.APPROVED,
                        }),
                      );
                      dispatch(
                        fetchRequests({
                          repairerAPI,
                          status: RequestStatus.FIXING,
                        }),
                      );
                      dispatch(
                        fetchRequests({
                          repairerAPI,
                          status: RequestStatus.CANCELLED,
                        }),
                      );
                    } catch (err) {
                      console.log(err);
                    } finally {
                      setRefreshControl(false);
                    }
                  }}
                  colors={['#FEC54B']}
                />
              }
              renderItem={({item, index}) => (
                <RequestItem
                  handleButtonPress={handleGetInvoiceButton}
                  handleNavigationToDetailRequest={
                    handleNavigationToDetailRequest
                  }
                  item={item}
                  index={index}
                  text="Tổng thanh toán"
                  textButton="Xem hóa đơn"
                />
              )}
            />
          )}
        </>
      )}
    </View>
  );
};

export default PaymentWaitingScreen;
