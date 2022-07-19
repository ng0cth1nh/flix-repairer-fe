import React, {useEffect, useState} from 'react';
import {FlatList, ActivityIndicator, RefreshControl, View} from 'react-native';
import RequestItem from '../../components/RequestItem';
import Empty from '../../components/Empty';
import {RequestStatus} from '../../utils/util';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchRequests,
  selectRequests,
  selectIsLoading,
} from '../../features/request/requestSlice';
import useAxios from '../../hooks/useAxios';

const PaymentWaitingScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const repairerAPI = useAxios();
  const [refreshControl, setRefreshControl] = useState(false);
  const isLoading = useSelector(selectIsLoading);
  const requests = useSelector(selectRequests);

  // useEffect(() => {
  //   (async () => {
  //     await dispatch(
  //       fetchRequests({repairerAPI, status: RequestStatus.PAYMENT_WAITING}),
  //     );
  //   })();
  // }, []);

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
      isShowSubmitButton: false,
    });
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      {isLoading ? (
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
      {/* {isError ? <NotFound /> : null} */}
      {requests.paymentWaiting ? (
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
                setRefreshControl(true);
                await dispatch(
                  fetchRequests({
                    repairerAPI,
                    status: RequestStatus.PAYMENT_WAITING,
                  }),
                );
                setRefreshControl(false);
              }}
              colors={['#FEC54B']}
            />
          }
          renderItem={({item, index}) => (
            <RequestItem
              handleButtonPress={handleGetInvoiceButton}
              handleNavigationToDetailRequest={handleNavigationToDetailRequest}
              item={item}
              index={index}
              text="Tổng thanh toán"
              textButton="Xem hóa đơn"
            />
          )}
        />
      ) : null}
    </View>
  );
};

export default PaymentWaitingScreen;
