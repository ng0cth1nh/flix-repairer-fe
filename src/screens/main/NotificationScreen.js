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

const NOTIFICATIONS = [
  {
    id: 1,
    time: '20:59 - 13/05/2022',
    title: 'DV68GH - Đặt lịch thành công',
    content:
      'Đơn của bạn sẽ được xử lý muộn nhất trong 6 tiếng. Bấm để xem chi tiết.',
    icon: 'https://i.postimg.cc/s21gHhHD/archive.png',
    isRead: false,
  },
  {
    id: 2,
    time: '20:59 - 13/05/2022',
    title:
      'EVN78FH - Đã tìm được thợ Mã giảm giá áp dụng cho tất cả các shop ở Hồ Chí Minh.',
    content:
      'Đơn của bạn sẽ được xử lý muộn nhất trong 6 tiếng. Bấm để xem chi tiết.',
    icon: 'https://i.postimg.cc/s21gHhHD/archive.png',
    isRead: true,
  },
  {
    id: 3,
    time: '20:59 - 13/05/2022',
    title: 'Bạn có 1 mã giảm giá mới',
    content: 'Mã giảm giá áp dụng cho tất cả các shop ở Hồ Chí Minh.',
    icon: 'https://i.postimg.cc/t4Bgz55M/coupon.png',
    isRead: true,
  },
  {
    id: 4,
    time: '20:59 - 13/05/2022',
    title: 'Bạn có 1 mã giảm giá mới',
    content: 'Mã giảm giá áp dụng cho tất cả các shop ở Hồ Chí Minh.',
    icon: 'https://i.postimg.cc/t4Bgz55M/coupon.png',
    isRead: true,
  },
  {
    id: 5,
    time: '20:59 - 13/05/2022',
    title: 'Bạn có 1 mã giảm giá mới',
    content: 'Mã giảm giá áp dụng cho tất cả các shop ở Hồ Chí Minh.',
    icon: 'https://i.postimg.cc/t4Bgz55M/coupon.png',
    isRead: true,
  },
];

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [idDelete, setIdDelete] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshControl, setRefreshControl] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    setNotifications(NOTIFICATIONS);
  }, []);

  const handleOnDelete = id => {
    alert('id delete: ' + id);
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          height: 'auto',
          backgroundColor: item.isRead ? 'white' : '#F0F0F0',
          borderBottomColor: '#F0F0F0',
          borderBottomWidth: 1,
          paddingBottom: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            setIdDelete(item.id);
            showModal();
          }}
          style={{
            height: 14,
            width: 14,
            alignSelf: 'flex-end',
            marginRight: 10,
            marginTop: 10,
          }}>
          <Image
            source={require('../../../assets/images/type/close.png')}
            style={{
              height: 12,
              width: 12,
            }}
          />
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={{uri: item.icon}}
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
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: 'black',
                flexWrap: 'wrap',
                marginVertical: 8,
              }}>
              {item.content}
            </Text>
            <Text
              style={{
                fontSize: 8,
                color: '#7C7C7C',
              }}>
              {item.time}
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
        modalVisible ? {opacity: 0.3} : {},
      ]}>
      <TopHeaderComponent
        navigation={null}
        title="Thông báo"
        isBackButton={false}
        statusBarColor="white"
      />
      <SafeAreaView style={{flex: 1}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshControl}
              onRefresh={() => {
                setRefreshControl(true);
                console.log('lam moi');
                // setData(mang_du_lieu)
                setNotifications(
                  notifications.concat([
                    {
                      id: 6,
                      time: '20:59 - 13/05/2022',
                      title: 'Bạn có 1 mã giảm giá mới',
                      content:
                        'Mã giảm giá áp dụng cho tất cả các shop ở Hồ Chí Minh.',
                      icon: 'https://i.postimg.cc/t4Bgz55M/coupon.png',
                      isRead: true,
                    },
                    {
                      id: 7,
                      time: '20:59 - 13/05/2022',
                      title: 'Bạn có 1 mã giảm giá mới',
                      content:
                        'Mã giảm giá áp dụng cho tất cả các shop ở Hồ Chí Minh.',
                      icon: 'https://i.postimg.cc/t4Bgz55M/coupon.png',
                      isRead: true,
                    },
                    {
                      id: 8,
                      time: '20:59 - 13/05/2022',
                      title: 'Bạn có 1 mã giảm giá mới',
                      content:
                        'Mã giảm giá áp dụng cho tất cả các shop ở Hồ Chí Minh.',
                      icon: 'https://i.postimg.cc/t4Bgz55M/coupon.png',
                      isRead: true,
                    },
                    {
                      id: 9,
                      time: '20:59 - 13/05/2022',
                      title: 'Bạn có 1 mã giảm giá mới',
                      content:
                        'Mã giảm giá áp dụng cho tất cả các shop ở Hồ Chí Minh.',
                      icon: 'https://i.postimg.cc/t4Bgz55M/coupon.png',
                      isRead: true,
                    },
                  ]),
                );
                setRefreshControl(false);
              }}
              colors={['#FEC54B']}
            />
          }
          ListFooterComponent={() =>
            isLoading ? ( //  a==b ? b : a
              <View
                style={{
                  marginTop: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  padding: 10,
                }}>
                <ActivityIndicator size="small" color="#FEC54B" />
              </View>
            ) : null
          }
          onEndReached={() => {
            setIsLoading(true);
            console.log('Load More');
            // setData(mang_du_lieu)
            setTimeout(() => {
              setNotifications(
                notifications.concat([
                  {
                    id: 8,
                    time: '20:59 - 13/05/2022',
                    title: 'Bạn có 1 mã giảm giá mới',
                    content:
                      'Mã giảm giá áp dụng cho tất cả các shop ở Hồ Chí Minh.',
                    icon: 'https://i.postimg.cc/t4Bgz55M/coupon.png',
                    isRead: true,
                  },
                  {
                    id: 9,
                    time: '20:59 - 13/05/2022',
                    title: 'Bạn có 1 mã giảm giá mới',
                    content:
                      'Mã giảm giá áp dụng cho tất cả các shop ở Hồ Chí Minh.',
                    icon: 'https://i.postimg.cc/t4Bgz55M/coupon.png',
                    isRead: true,
                  },
                ]),
              );
              setIsLoading(false);
            }, 2000);
          }}
          onEndReachedThreshold={0.5}
        />
      </SafeAreaView>
      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalRatio={0.3}>
        <Text style={styles.modalText}>
          Bạn có chắc chắn muốn xóa thông báo này không?
        </Text>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            style={[styles.button, styles.buttonOpen]}
            onPress={() => console.log('delete id ' + idDelete)}>
            <Text style={styles.textStyle}>XÓA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.textStyle}>ĐÓNG</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    color: 'black',
    marginTop: getStatusBarHeight(),
    paddingBottom: 15,
    borderBottomWidth: 0.7,
    borderBottomColor: '#CACACA',
    width: '100%',
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
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 40,
    textAlign: 'center',
  },
});
export default NotificationScreen;
