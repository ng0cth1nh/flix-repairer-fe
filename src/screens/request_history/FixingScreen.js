import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, ActivityIndicator, View} from 'react-native';
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

const FixingScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const repairerAPI = useAxios();
  const isLoading = useSelector(selectIsLoading);
  const requests = useSelector(selectRequests);

  const [refreshControl, setRefreshControl] = useState(false);
  useEffect(() => {
    (async () => {
      await dispatch(
        fetchRequests({repairerAPI, status: RequestStatus.FIXING}),
      );
    })();
  }, []);

  const handleNavigationToListPrice = async service => {
    navigation.push('ServicePriceScreen', {
      serviceName: service.serviceName,
      serviceId: service.serviceId,
    });
  };

  const handleNavigationToDetailRequest = async requestCode => {
    navigation.push('RequestDetailScreen', {
      requestCode,
      isShowCancelButton: true,
      submitButtonText: 'Tạo hóa đơn',
      isAddableDetailService: true,
      typeSubmitButtonClick: 'CREATE_INVOICE',
      isCancelFromApprovedStatus: false,
      isFetchFixedService: true,
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
      {requests.fixing ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={requests.fixing}
          style={{marginHorizontal: 20}}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={Empty}
          refreshControl={
            <RefreshControl
              refreshing={refreshControl}
              onRefresh={async () => {
                setRefreshControl(true);
                await dispatch(
                  fetchRequests({repairerAPI, status: RequestStatus.FIXING}),
                );
                setRefreshControl(false);
              }}
              colors={['#FEC54B']}
            />
          }
          renderItem={({item, index}) => (
            <RequestItem
              isGetPriceList={true}
              handleButtonPress={handleNavigationToListPrice}
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

export default FixingScreen;
