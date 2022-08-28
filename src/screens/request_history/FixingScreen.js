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

const FixingScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const repairerAPI = useAxios();
  const isLoading = useSelector(selectIsLoading);
  const requests = useSelector(selectRequests);
  const [refreshControl, setRefreshControl] = useState(false);
  const errorMessage = useSelector(selectErrorMessage);

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
      isShowSubmitButton: true,
      isEnableChatButton: true,
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
              data={requests.fixing}
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
                          status: RequestStatus.FIXING,
                        }),
                      );
                      await setIsLoading(true);
                      dispatch(
                        fetchRequests({
                          repairerAPI,
                          status: RequestStatus.PAYMENT_WAITING,
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
                          status: RequestStatus.DONE,
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
                  handleButtonPress={handleNavigationToListPrice}
                  handleNavigationToDetailRequest={
                    handleNavigationToDetailRequest
                  }
                  item={item}
                  index={index}
                  textButton="Xem giá dịch vụ"
                  text="Tổng thanh toán (dự kiến)"
                />
              )}
            />
          )}
        </>
      )}
    </View>
  );
};

export default FixingScreen;
