import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import React, {useState, useEffect} from 'react';
import Empty from '../../components/Empty';
const {width} = Dimensions.get('window');
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchSuggestRequests,
  selectRequests,
  fetchFilteredRequests,
  setIsLoading,
  selectIsLoading,
} from '../../features/home/homeSlice';
import {selectUser} from '../../features/user/userSlice';
import {fetchRequests} from '../../features/request/requestSlice';
import {RequestStatus} from '../../utils/util';
import useAxios from '../../hooks/useAxios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModal from '../../components/CustomModal';
import SubmitButton from '../../components/SubmitButton';

const HomeScreen = ({navigation}) => {
  const [buttonIndex, setButtonIndex] = useState(0);
  const isLoading = useSelector(selectIsLoading);
  const requests = useSelector(selectRequests);
  const [renderList, setRenderList] = useState(null);
  const [refreshControl, setRefreshControl] = useState(false);
  const [filter, setFilter] = useState(null);
  const [addedServices, setAddedServices] = useState([]);
  const [startDates, setStartDates] = useState(moment());
  const [endDates, setEndDates] = useState(moment());
  const [cityIds, setCityIds] = useState(null);
  const [districtIds, setDistrictIds] = useState(null);
  const [communeIds, setCommuneIds] = useState(null);
  const user = useSelector(selectUser);
  const [modalVisible, setModalVisible] = useState(false);
  const repairerAPI = useAxios();
  const dispatch = useDispatch();

  const handleSuggestButton = () => {
    setButtonIndex(0);
    setRenderList(requests.suggested);
  };
  const handleInterestButton = () => {
    setButtonIndex(1);
    setRenderList(requests.interested);
  };

  const handleOnPressItem = async requestCode => {
    if (user.role && user.role === 'ROLE_REPAIRER') {
      navigation.push('RequestDetailScreen', {
        requestCode,
        isShowCancelButton: false,
        submitButtonText: 'Xác nhận yêu cầu',
        isShowSubmitButton: true,
        isAddableDetailService: false,
        typeSubmitButtonClick: 'APPROVE_REQUEST',
      });
    } else {
      setModalVisible(true);
    }
  };

  const handleFilterClicked = () => {
    setButtonIndex(2);
    navigation.push('ServiceFilterScreen', {
      setFilter,
      addedServices,
      setAddedServices,
      endDates,
      setEndDates,
      startDates,
      setStartDates,
      districtIds,
      setDistrictIds,
      cityIds,
      setCityIds,
      communeIds,
      setCommuneIds,
    });
  };

  useEffect(() => {
    (async () => {
      try {
        await dispatch(setIsLoading());
        const data = await dispatch(
          fetchSuggestRequests({repairerAPI, type: 'SUGGESTED'}),
        ).unwrap();
        setRenderList(data.requests);
        dispatch(
          fetchSuggestRequests({repairerAPI, type: 'INTERESTED'}),
        ).unwrap();
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (filter) {
      (async () => {
        try {
          await dispatch(setIsLoading());
          const data = await dispatch(
            fetchFilteredRequests({repairerAPI, param: filter}),
          ).unwrap();
          setRenderList(data);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [filter]);

  useEffect(() => {
    if (user.role && user.role === 'ROLE_REPAIRER') {
      dispatch(fetchRequests({repairerAPI, status: RequestStatus.APPROVED}));
      dispatch(fetchRequests({repairerAPI, status: RequestStatus.FIXING}));
      dispatch(
        fetchRequests({repairerAPI, status: RequestStatus.PAYMENT_WAITING}),
      );
      dispatch(fetchRequests({repairerAPI, status: RequestStatus.DONE}));
      dispatch(fetchRequests({repairerAPI, status: RequestStatus.CANCELLED}));
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let filter = await AsyncStorage.getItem('filter');
        if (filter) {
          let {
            addedServices,
            startDates,
            endDates,
            cityIds,
            districtIds,
            communeIds,
          } = JSON.parse(filter);
          setAddedServices(addedServices);
          setStartDates(startDates ? moment(startDates) : startDates);
          setEndDates(endDates ? moment(endDates) : endDates);
          setCityIds(cityIds);
          setDistrictIds(districtIds);
          setCommuneIds(communeIds);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#CACACA',
            paddingBottom: 10,
          }}>
          <TouchableOpacity
            style={[
              styles.suggestButton,
              {width: '32%'},
              buttonIndex === 0 ? {backgroundColor: '#FEC54B'} : {},
            ]}
            onPress={handleSuggestButton}>
            <Text style={[styles.textBold]}>Gợi ý cho bạn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.suggestButton,
              {width: '48%'},
              buttonIndex === 1 ? {backgroundColor: '#FEC54B'} : {},
            ]}
            onPress={handleInterestButton}>
            <Text style={[styles.textBold]}>Có thể bạn quan tâm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.suggestButton,
              {
                width: '12%',
                resizeMode: 'contain',
              },
              buttonIndex === 2 ? {backgroundColor: '#FEC54B'} : {},
            ]}
            onPress={handleFilterClicked}>
            <Image
              source={require('../../../assets/images/extra_icon/filter.png')}
              resizeMode="cover"
              style={{width: '60%', height: '60%'}}
            />
          </TouchableOpacity>
        </View>
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
        ) : (
          <FlatList
            data={renderList}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={Empty}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshControl}
                onRefresh={async () => {
                  setRefreshControl(true);
                  if (buttonIndex === 0) {
                    await dispatch(
                      fetchSuggestRequests({repairerAPI, type: 'SUGGESTED'}),
                    );
                    setRenderList(requests.suggested);
                  } else if (buttonIndex === 1) {
                    await dispatch(
                      fetchSuggestRequests({repairerAPI, type: 'INTERESTED'}),
                    );
                    setRenderList(requests.interested);
                  } else {
                    await dispatch(
                      fetchFilteredRequests({repairerAPI, param: filter}),
                    );
                    setRenderList(requests.filtered);
                  }
                  setRefreshControl(false);
                }}
                colors={['#FEC54B']}
              />
            }
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => handleOnPressItem(item.requestCode)}
                style={[
                  styles.box,
                  {marginBottom: index === renderList.length - 1 ? 10 : 0},
                ]}>
                <View style={styles.headerBox}>
                  <Image
                    source={{uri: item.avatar}}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 0.5 * width,
                    }}
                  />
                  <View style={[styles.profileView, {flex: 2}]}>
                    <Text style={[styles.textBold, {fontSize: 18}]}>
                      {item.customerName}
                    </Text>
                    <Text style={{fontSize: 12}}>
                      {moment(item.createdAt).format('HH:mm - DD/MM/YYYY')}
                    </Text>
                  </View>
                  <Image
                    source={{uri: item.iconImage}}
                    style={{width: 24, height: 24}}
                  />
                </View>
                <View style={{width: '100%', overflow: 'hidden'}}>
                  <View style={[styles.bodyRow, {marginTop: 10}]}>
                    <View style={styles.rowIcon}>
                      <Image
                        source={require('../../../assets/images/type/support.png')}
                        style={{
                          height: 20,
                          width: 20,
                        }}
                      />
                    </View>
                    <Text style={[styles.textBold, {fontSize: 18}]}>
                      {item.serviceName}
                    </Text>
                  </View>
                  <View style={styles.bodyRow}>
                    <View style={styles.rowIcon}>
                      <Image
                        source={require('../../../assets/images/type/calendar.png')}
                        style={{
                          height: 20,
                          width: 20,
                        }}
                      />
                    </View>
                    <Text style={styles.textBold}>
                      {moment(item.expectFixingTime).format(
                        'HH:mm - DD/MM/YYYY',
                      )}
                    </Text>
                  </View>
                  {item.description ? (
                    <View style={styles.bodyRow}>
                      <View style={styles.rowIcon}>
                        <Image
                          source={require('../../../assets/images/type/writing.png')}
                          style={{
                            height: 20,
                            width: 20,
                          }}
                        />
                      </View>
                      <ScrollView
                        style={{
                          width: '60%',
                          height: 40,
                          backgroundColor: 'white',
                          borderRadius: 10,
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            paddingHorizontal: 10,
                            paddingVertical: 3,
                          }}>
                          {item.description}
                        </Text>
                      </ScrollView>
                    </View>
                  ) : null}
                  <View style={styles.bodyRow}>
                    <View style={styles.rowIcon}>
                      <Image
                        source={require('../../../assets/images/type/address.png')}
                        style={{
                          height: 20,
                          width: 20,
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 16,
                        marginRight: 10,
                        color: 'black',
                        flex: 1,
                      }}>
                      {item.address.substr(
                        item.address.indexOf(', ') + 2,
                        item.address.length,
                      )}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>
      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalRatio={0.28}>
        <Text style={styles.modalText}>Lưu ý</Text>
        <View style={{marginVertical: 10}}>
          <Text>Tài khoản của bạn chưa được xác thực</Text>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <SubmitButton
            style={{
              marginVertical: 8,
              width: '100%',
              alignSelf: 'center',
            }}
            onPress={() => setModalVisible(false)}
            buttonText="ĐỒNG Ý"
          />
        </View>
      </CustomModal>
    </>
  );
};

const styles = StyleSheet.create({
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 5,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 10,
  },
  buttonOpen: {
    backgroundColor: '#FEC54B',
  },
  container: {
    paddingHorizontal: '4%',
    paddingTop: 16,
    backgroundColor: 'white',
    height: '100%',
  },
  box: {
    backgroundColor: '#F0F0F0',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    width: '100%',
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileView: {
    marginLeft: 14,
  },
  viewDetail: {
    marginLeft: 'auto',
  },
  viewDetailText: {
    fontWeight: 'bold',
    color: '#FEC54B',
    fontSize: 15,
  },
  bodyRow: {
    flexDirection: 'row',
    marginVertical: 8,
    marginLeft: 10,
    flexWrap: 'wrap',
  },
  rowIcon: {width: 0.1 * width},
  icon: {marginLeft: 'auto', color: 'black'},
  suggestButton: {
    width: '40%',
    height: 35,
    borderWidth: 2,
    borderColor: '#FEC54B',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBold: {
    fontWeight: 'bold',
    color: 'black',
  },
});

export default HomeScreen;
