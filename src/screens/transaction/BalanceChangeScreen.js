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
        ? 'Y??u c???u r??t ti???n th??nh c??ng'
        : item.type === 'DEPOSIT'
        ? 'N???p ti???n v??o v?? th??nh c??ng'
        : item.type === 'PAY_COMMISSIONS'
        ? 'Tr??? ti???n hoa h???ng th??nh c??ng'
        : item.type === 'REFUNDS'
        ? 'Ho??n ti???n th??nh c??ng'
        : item.type === 'FINED'
        ? 'Tr??? ti???n ph???t'
        : item.type === 'RECEIVE_INVOICE_MONEY'
        ? 'Nh???n ti???n thanh to??n h??a ????n th??nh c??ng'
        : 'Kh??ch h??ng thanh to??n h??a ????n th??nh c??ng';
    } else if (item.status === 'PENDING') {
      return item.type === 'WITHDRAW'
        ? 'Y??u c???u r??t ti???n ??ang ???????c x??t duy???t'
        : item.type === 'DEPOSIT'
        ? 'N???p ti???n v??o v?? ??ang ???????c x??t duy???t'
        : item.type === 'PAY_COMMISSIONS'
        ? 'Tr??? ti???n hoa h???ng ??ang ???????c x??t duy???t'
        : item.type === 'REFUNDS'
        ? 'Ho??n ti???n ??ang ???????c x??t duy???t'
        : item.type === 'FINED'
        ? 'Tr??? ti???n ph???t'
        : item.type === 'RECEIVE_INVOICE_MONEY'
        ? 'Nh???n ti???n thanh to??n h??a ????n ??ang ???????c x??t duy???t'
        : 'Kh??ch h??ng thanh to??n h??a ????n ??ang ???????c x??t duy???t';
    } else {
      return item.type === 'WITHDRAW'
        ? 'Y??u c???u r??t ti???n th???t b???i'
        : item.type === 'DEPOSIT'
        ? 'N???p ti???n v??o v?? th???t b???i'
        : item.type === 'PAY_COMMISSIONS'
        ? 'Tr??? ti???n hoa h???ng th???t b???i'
        : item.type === 'REFUNDS'
        ? 'Ho??n ti???n th???t b???i'
        : item.type === 'FINED'
        ? 'Tr??? ti???n ph???t'
        : item.type === 'RECEIVE_INVOICE_MONEY'
        ? 'Nh???n ti???n thanh to??n h??a ????n th???t b???i'
        : 'Kh??ch h??ng thanh to??n h??a ????n th???t b???i';
    }
  };

  const genContent = item => {
    if (item.status === 'SUCCESS') {
      return item.type === 'WITHDRAW'
        ? `R??t -${numberWithCommas(item.amount)} vn?? th??nh c??ng`
        : item.type === 'DEPOSIT'
        ? `N???p +${numberWithCommas(item.amount)} vn?? th??nh c??ng`
        : item.type === 'PAY_COMMISSIONS'
        ? `Tr??? -${numberWithCommas(
            item.amount,
          )} vn??  ti???n hoa h???ng th??nh c??ng cho y??u c???u: ${item.requestCode}`
        : item.type === 'REFUNDS'
        ? `Ho??n +${numberWithCommas(item.amount)} vn?? th??nh c??ng`
        : item.type === 'FINED'
        ? `Tr??? -${numberWithCommas(item.amount)} vn?? ti???n ph???t cho y??u c???u:${
            item.requestCode
          }`
        : item.type === 'RECEIVE_INVOICE_MONEY'
        ? `Nh???n ti???n thanh to??n +${numberWithCommas(
            item.amount,
          )} vn?? th??nh c??ng qua VNPAY cho y??u c???u: ${item.requestCode}`
        : `Kh??ch h??ng thanh to??n +${numberWithCommas(
            item.amount,
          )} vn?? th??nh c??ng qua VNPAY cho y??u c???u: ${item.requestCode}`;
    } else if (item.status === 'PENDING') {
      return item.type === 'WITHDRAW'
        ? `R??t -${numberWithCommas(item.amount)} vn?? ??ang ???????c x??t duy???t`
        : item.type === 'DEPOSIT'
        ? `N???p +${numberWithCommas(item.amount)} vn?? ??ang ???????c x??t duy???t`
        : item.type === 'PAY_COMMISSIONS'
        ? `Tr??? -${numberWithCommas(
            item.amount,
          )} vn??  ti???n hoa h???ng cho y??u c???u: ${
            item.requestCode
          }  ??ang ???????c x??t duy???t`
        : item.type === 'REFUNDS'
        ? `Ho??n +${numberWithCommas(item.amount)} vn?? ??ang ???????c x??t duy???t`
        : item.type === 'FINED'
        ? `Tr??? -${numberWithCommas(item.amount)} vn?? ti???n ph???t cho y??u c???u:${
            item.requestCode
          }  ??ang ???????c x??t duy???t`
        : item.type === 'RECEIVE_INVOICE_MONEY'
        ? `Nh???n ti???n thanh to??n +${numberWithCommas(
            item.amount,
          )} vn?? qua VNPAY cho y??u c???u: ${
            item.requestCode
          }  ??ang ???????c x??t duy???t`
        : `Kh??ch h??ng thanh to??n +${numberWithCommas(
            item.amount,
          )} vn?? qua VNPAY cho y??u c???u: ${
            item.requestCode
          } ??ang ???????c x??t duy???t`;
    } else {
      return item.type === 'WITHDRAW'
        ? `R??t -${numberWithCommas(item.amount)} vn?? th???t b???i`
        : item.type === 'DEPOSIT'
        ? `N???p +${numberWithCommas(item.amount)} vn?? th???t b???i`
        : item.type === 'PAY_COMMISSIONS'
        ? `Tr??? -${numberWithCommas(
            item.amount,
          )} vn??  ti???n hoa h???ng th???t b???i cho y??u c???u: ${item.requestCode}`
        : item.type === 'REFUNDS'
        ? `Ho??n +${numberWithCommas(item.amount)} vn?? th???t b???i`
        : item.type === 'FINED'
        ? `Tr??? -${numberWithCommas(item.amount)} vn?? ti???n ph???t cho y??u c???u:${
            item.requestCode
          }`
        : item.type === 'RECEIVE_INVOICE_MONEY'
        ? `Nh???n ti???n thanh to??n +${numberWithCommas(
            item.amount,
          )} vn?? th???t b???i qua VNPAY cho y??u c???u: ${item.requestCode}`
        : `Kh??ch h??ng thanh to??n +${numberWithCommas(
            item.amount,
          )} vn?? th???t b???i qua VNPAY cho y??u c???u: ${item.requestCode}`;
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
        title="Bi???n ?????ng s??? d??"
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
              isLoading &&
              !refreshControl && (
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
