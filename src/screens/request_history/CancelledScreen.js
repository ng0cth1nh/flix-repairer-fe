import React, {useState} from 'react';
import {FlatList, RefreshControl, ActivityIndicator, View} from 'react-native';
import RequestItem from '../../components/RequestItem';
import Empty from '../../components/Empty';
import {RequestStatus} from '../../utils/util';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchRequests,
  selectRequests,
  selectIsLoading,
  setIsLoading,
} from '../../features/request/requestSlice';

import useAxios from '../../hooks/useAxios';

const CancelledScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const repairerAPI = useAxios();
  const isLoading = useSelector(selectIsLoading);
  const requests = useSelector(selectRequests);
  const [refreshControl, setRefreshControl] = useState(false);

  const handelNavigationToListPrice = service => {
    navigation.push('ServicePriceScreen', {
      serviceName: service.serviceName,
      serviceId: service.serviceId,
    });
  };

  const handleNavigationToDetailRequest = async requestCode => {
    navigation.push('RequestDetailScreen', {
      requestCode,
      isFetchFixedService: false,
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
      {requests.cancelled ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={requests.cancelled}
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
                      status: RequestStatus.CANCELLED,
                    }),
                  );
                  await setIsLoading(true);
                  dispatch(
                    fetchRequests({
                      repairerAPI,
                      status: RequestStatus.FIXING,
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
                      status: RequestStatus.PAYMENT_WAITING,
                    }),
                  );
                  dispatch(
                    fetchRequests({repairerAPI, status: RequestStatus.DONE}),
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
              handleButtonPress={handelNavigationToListPrice}
              handleNavigationToDetailRequest={handleNavigationToDetailRequest}
              item={item}
              index={index}
              textButton="Xem giá dịch vụ"
              text="Tổng thanh toán (dự kiến)"
            />
          )}
        />
      ) : null}
    </View>
  );
};

export default CancelledScreen;
