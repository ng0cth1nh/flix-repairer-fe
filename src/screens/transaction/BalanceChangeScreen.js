import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import React, {useState, useEffect} from 'react';
const {width, height} = Dimensions.get('window');
import CustomModal from '../../components/CustomModal';
import TopHeaderComponent from '../../components/TopHeaderComponent';
import {useSelector, useDispatch} from 'react-redux';
import useAxios from '../../hooks/useAxios';
import {
  selectIsLoading,
  setIsLoading,
  selectErrorMessage,
  fetchTransactionHistories,
} from '../../features/user/userSlice';
import Toast from 'react-native-toast-message';
import {numberWithCommas} from '../../utils/util';
import moment from 'moment';
import {NUMBER_RECORD_PER_PAGE} from '../../constants/Api';

const BalanceChangeScreen = ({navigation}) => {
  const [transactions, setTransactions] = useState([]);
  const [idDelete, setIdDelete] = useState(-1);
  const [refreshControl, setRefreshControl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPage, setTotalPage] = useState(null);
  const [stopFetchMore, setStopFetchMore] = useState(true);
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
        setStopFetchMore(true);
        setPageNumber(0);
      }
      setTotalPage(Math.ceil(res.totalRecord / NUMBER_RECORD_PER_PAGE));
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
  };

  const handleOnEndReached = async () => {
    try {
      if (stopFetchMore) {
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
        ? 'Trả tiền hoa hồng thành công'
        : item.type === 'REFUNDS'
        ? 'Hoàn tiền thành công'
        : item.type === 'FINED'
        ? 'Trừ tiền phạt'
        : item.type === 'CUSTOMER_PAYMENT'
        ? 'Thanh toán hóa đơn thành công'
        : 'Thanh toán hóa đơn thành công';
    } else {
      return item.type === 'WITHDRAW'
        ? 'Rút tiền về ví VNPAY thất bại'
        : item.type === 'DEPOSIT'
        ? 'Nạp tiền vào ví thất bại'
        : item.type === 'PAY_COMMISSIONS'
        ? 'Trả tiền hoa hồng thất bại'
        : item.type === 'REFUNDS'
        ? 'Hoàn tiền thất bại'
        : item.type === 'FINED'
        ? 'Trừ tiền phạt'
        : item.type === 'CUSTOMER_PAYMENT'
        ? 'Thanh toán hóa đơn thất bại'
        : 'Thanh toán hóa đơn thất bại';
    }
  };

  const genContent = item => {
    if (item.status === 'SUCCESS') {
      return item.type === 'WITHDRAW'
        ? `Rút -${numberWithCommas(item.amount)} vnđ về ví VNPAY thành công`
        : item.type === 'DEPOSIT'
        ? `Nạp +${numberWithCommas(item.amount)} vnđ thành công`
        : item.type === 'PAY_COMMISSIONS'
        ? `Trả +${numberWithCommas(item.amount)} vnđ  tiền hoa hồng thành công`
        : item.type === 'REFUNDS'
        ? `Hoàn +${numberWithCommas(item.amount)} vnđ thành công`
        : item.type === 'FINED'
        ? `Trừ -${numberWithCommas(item.amount)} vnđ tiền phạt`
        : item.type === 'CUSTOMER_PAYMENT'
        ? `Thanh toán +${numberWithCommas(
            item.amount,
          )} vnđ thành công cho đơn hàng ${item.transactionCode}`
        : `Thanh toán +${numberWithCommas(
            item.amount,
          )} vnđ thành công cho đơn hàng ${item.transactionCode}`;
    } else {
      return item.type === 'WITHDRAW'
        ? `Rút -${numberWithCommas(item.amount)} vnđ về ví VNPAY thất bại`
        : item.type === 'DEPOSIT'
        ? `Nạp +${numberWithCommas(item.amount)} vnđ thất bại`
        : item.type === 'PAY_COMMISSIONS'
        ? `Trả +${numberWithCommas(item.amount)} vnđ  tiền hoa hồng thất bại`
        : item.type === 'REFUNDS'
        ? `Hoàn +${numberWithCommas(item.amount)} vnđ thất bại`
        : item.type === 'FINED'
        ? `Trừ -${numberWithCommas(item.amount)} vnđ tiền phạt`
        : item.type === 'CUSTOMER_PAYMENT'
        ? `Thanh toán +${numberWithCommas(
            item.amount,
          )} vnđ thất bại cho đơn hàng ${item.transactionCode}`
        : `Thanh toán +${numberWithCommas(
            item.amount,
          )} vnđ thất bại cho đơn hàng ${item.transactionCode}`;
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
          <View style={{paddingRight: 60, alignSelf: 'center'}}>
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
            <Text
              style={{
                fontSize: 8,
                color: '#7C7C7C',
              }}>
              {moment(item.createdAt).format('HH:mm - DD/MM/YYYY')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        {backgroundColor: 'white', flex: 1},
        modalVisible ? {opacity: 0.9} : {},
      ]}>
      <TopHeaderComponent
        navigation={navigation}
        title="Biến động số dư"
        isBackButton={true}
        statusBarColor="white"
      />
      <SafeAreaView style={{flex: 1}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={transactions}
          renderItem={renderItem}
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
              <ActivityIndicator
                size="small"
                color="#FEC54B"
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
      </SafeAreaView>
    </View>
  );
};

export default BalanceChangeScreen;
