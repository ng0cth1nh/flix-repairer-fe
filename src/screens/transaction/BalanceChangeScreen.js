import {
  View,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import TopHeaderComponent from '../../components/TopHeaderComponent';
import {useSelector, useDispatch} from 'react-redux';
import useAxios from '../../hooks/useAxios';
import {
  selectIsLoading,
  setIsLoading,
  fetchTransactionHistories,
} from '../../features/user/userSlice';
import Toast from 'react-native-toast-message';
import {numberWithCommas} from '../../utils/util';
import moment from 'moment';
import {NUMBER_RECORD_PER_PAGE} from '../../constants/Api';
import EmptyTransaction from '../../components/EmptyTransaction';
import Loading from '../../components/Loading';

const BalanceChangeScreen = ({navigation}) => {
  const [transactions, setTransactions] = useState([]);
  const [refreshControl, setRefreshControl] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPage, setTotalPage] = useState(null);
  const [stopFetchMore, setStopFetchMore] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const repairerAPI = useAxios();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    (async () => {
      if (refreshControl === null || refreshControl === true) {
        await loadTransactions();
      }
    })();
  }, [refreshControl]);

  const loadTransactions = async () => {
    try {
      let temp = 0;
      await dispatch(setIsLoading());
      let res = await dispatch(
        fetchTransactionHistories({
          repairerAPI,
          pageNumber: temp,
          pageSize: NUMBER_RECORD_PER_PAGE,
        }),
      ).unwrap();
      setTransactions(res.transactions);
      if (refreshControl) {
        setRefreshControl(false);
        setStopFetchMore(false);
        setPageNumber(0);
      }
      setTotalPage(Math.ceil(res.totalRecord / NUMBER_RECORD_PER_PAGE));
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    } finally {
      setIsFirstLoad(false);
    }
  };

  const handleOnEndReached = async () => {
    try {
      if (!stopFetchMore) {
        if (totalPage <= pageNumber + 1) {
          setStopFetchMore(false);
          return;
        }
        let temp = pageNumber + 1;
        await dispatch(setIsLoading());
        let res = await dispatch(
          fetchTransactionHistories({
            repairerAPI,
            pageNumber: temp,
            pageSize: NUMBER_RECORD_PER_PAGE,
          }),
        ).unwrap();
        setTransactions([...transactions, ...res.transactions]);
        setPageNumber(pageNumber + 1);
      }
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
  };

  const genTitle = item => {
    if (item.status === 'SUCCESS') {
      return item.type === 'WITHDRAW'
        ? 'Rút tiền về ví VNPAY thành công'
        : item.type === 'DEPOSIT'
        ? 'Nạp tiền vào ví thành công'
        : item.type === 'PAY_COMMISSIONS'
        ? 'Trừ tiền hoa hồng thành công'
        : item.type === 'REFUNDS'
        ? 'Hoàn tiền thành công'
        : item.type === 'FINED'
        ? 'Trừ tiền phạt'
        : item.type === 'RECEIVE_INVOICE_MONEY'
        ? 'Nhận tiền thanh toán hóa đơn thành công'
        : 'Khách hàng thanh toán hóa đơn thành công';
    } else {
      return item.type === 'WITHDRAW'
        ? 'Rút tiền về ví VNPAY thất bại'
        : item.type === 'DEPOSIT'
        ? 'Nạp tiền vào ví thất bại'
        : item.type === 'PAY_COMMISSIONS'
        ? 'Trừ tiền hoa hồng thất bại'
        : item.type === 'REFUNDS'
        ? 'Hoàn tiền thất bại'
        : item.type === 'FINED'
        ? 'Trừ tiền phạt'
        : item.type === 'RECEIVE_INVOICE_MONEY'
        ? 'Nhận tiền thanh toán hóa đơn thất bại'
        : 'Khách hàng thanh toán hóa đơn thất bại';
    }
  };

  const genContent = item => {
    if (item.status === 'SUCCESS') {
      return item.type === 'WITHDRAW'
        ? `Rút -${numberWithCommas(item.amount)} vnđ về ví VNPAY thành công`
        : item.type === 'DEPOSIT'
        ? `Nạp +${numberWithCommas(item.amount)} vnđ thành công`
        : item.type === 'PAY_COMMISSIONS'
        ? `Trừ -${numberWithCommas(
            item.amount,
          )} vnđ  tiền hoa hồng thành công cho yêu cầu: ${item.requestCode}`
        : item.type === 'REFUNDS'
        ? `Hoàn +${numberWithCommas(item.amount)} vnđ thành công`
        : item.type === 'FINED'
        ? `Trừ -${numberWithCommas(item.amount)} vnđ tiền phạt cho yêu cầu:${
            item.requestCode
          }`
        : item.type === 'RECEIVE_INVOICE_MONEY'
        ? `Nhận tiền thanh toán +${numberWithCommas(
            item.amount,
          )} vnđ thành công qua VNPAY cho yêu cầu: ${item.requestCode}`
        : `Khách hàng thanh toán +${numberWithCommas(
            item.amount,
          )} vnđ thành công qua VNPAY cho yêu cầu: ${item.requestCode}`;
    } else {
      return item.type === 'WITHDRAW'
        ? `Rút -${numberWithCommas(item.amount)} vnđ về ví VNPAY thất bại`
        : item.type === 'DEPOSIT'
        ? `Nạp +${numberWithCommas(item.amount)} vnđ thất bại`
        : item.type === 'PAY_COMMISSIONS'
        ? `Trừ -${numberWithCommas(
            item.amount,
          )} vnđ  tiền hoa hồng thất bại cho yêu cầu: ${item.requestCode}`
        : item.type === 'REFUNDS'
        ? `Hoàn +${numberWithCommas(item.amount)} vnđ thất bại`
        : item.type === 'FINED'
        ? `Trừ -${numberWithCommas(item.amount)} vnđ tiền phạt cho yêu cầu:${
            item.requestCode
          }`
        : item.type === 'RECEIVE_INVOICE_MONEY'
        ? `Nhận tiền thanh toán +${numberWithCommas(
            item.amount,
          )} vnđ thất bại qua VNPAY cho yêu cầu: ${item.requestCode}`
        : `Khách hàng thanh toán +${numberWithCommas(
            item.amount,
          )} vnđ thất bại qua VNPAY cho yêu cầu: ${item.requestCode}`;
    }
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          height: 'auto',
          backgroundColor: 'white',
          borderBottomColor: '#F0F0F0',
          borderBottomWidth: 1,
          paddingVertical: 10,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={require('../../../assets/images/type/transactions.png')}
            style={{
              height: 24,
              width: 24,
              alignSelf: 'center',
              marginHorizontal: 14,
            }}
          />
          <View style={{flex: 1, alignSelf: 'center', marginRight: 10}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 14,
                color: '#E67F1E',
                fontWeight: 'bold',
              }}>
              {genTitle(item)}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: 'black',
                flexWrap: 'wrap',
                marginVertical: 8,
              }}>
              {genContent(item)}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 10,
                  color: '#7C7C7C',
                }}>
                {moment(item.createdAt).format('HH:mm - DD/MM/YYYY')}
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontSize: 10,
                }}>
                MGD: {item.transactionCode}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[{backgroundColor: 'white', flex: 1}]}>
      <TopHeaderComponent
        navigation={navigation}
        title="Biến động số dư"
        isBackButton={true}
        statusBarColor="white"
      />
      <SafeAreaView style={{flex: 1}}>
        {isFirstLoad ? (
          <Loading />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={transactions}
            renderItem={renderItem}
            ListEmptyComponent={EmptyTransaction}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshControl}
                onRefresh={() => setRefreshControl(true)}
                colors={['#FEC54B']}
              />
            }
            ListFooterComponent={() =>
              isLoading && (
                <Loading
                  style={{
                    marginTop: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    padding: 10,
                  }}
                />
              )
            }
            onEndReached={handleOnEndReached}
            onScrollBeginDrag={() => {
              setStopFetchMore(false);
            }}
            onEndReachedThreshold={0.5}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default BalanceChangeScreen;
