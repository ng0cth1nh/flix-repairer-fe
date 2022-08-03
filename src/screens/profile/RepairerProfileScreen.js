import {
  View,
  Image,
  Text,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
const {height, width} = Dimensions.get('window');
import BackButton from '../../components/BackButton';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useSelector, useDispatch} from 'react-redux';
import useAxios from '../../hooks/useAxios';
import {
  selectIsLoading,
  setIsLoading,
  fetchComments,
  selectErrorMessage,
} from '../../features/user/userSlice';
import useFetchData from '../../hooks/useFetchData';
import Loading from '../../components/Loading';
import ApiConstants from '../../constants/Api';
import NotFound from '../../components/NotFound';
import Toast from 'react-native-toast-message';

const RepairerProfileScreen = ({navigation, route}) => {
  const {repairerId, repairerAvatar} = route.params;
  const customerAPI = useAxios();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const [offset, setOffset] = useState(0);
  const [comments, setComments] = useState([]);
  const {loading, data, isError} = useFetchData(
    ApiConstants.GET_REPAIRER_PROFILE_API,
    {
      params: {repairerId},
    },
  );

  useEffect(() => {
    (async () => {
      await loadComments();
    })();
  }, [offset]);

  const loadComments = async () => {
    try {
      await dispatch(setIsLoading());
      let res = await dispatch(
        fetchComments({customerAPI, repairerId, offset, limit: 10}),
      ).unwrap();
      setComments([...comments].concat(res));
      //setOffset(offset + 2);
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
  };

  const renderStarItem = star => {
    const items = [];
    for (let i = 0; i < star; i++) {
      items.push(
        <Image
          key={i}
          style={{width: 12, height: 12, marginHorizontal: 2}}
          source={require('../../../assets/images/type/star.png')}
        />,
      );
    }
    return items;
  };

  return (
    <View style={{backgroundColor: loading ? 'white' : '#FEC54B', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FEC54B" />
      {isError ? <NotFound /> : null}
      {loading ? (
        <Loading />
      ) : (
        <SafeAreaView style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              height: 60,
              width: '100%',
              zIndex: 1,
              position: 'absolute',
              backgroundColor: '#FEC54B',
            }}>
            <BackButton onPressHandler={navigation.goBack} color="black" />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              style={{
                width: 110,
                height: 110,
                borderRadius: width * 0.5,
                borderColor: '#F0F0F0',
                borderWidth: 1,
                alignSelf: 'center',
                marginTop: 80,
                marginBottom: 10,
              }}
              source={{uri: repairerAvatar}}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                alignSelf: 'center',
                color: 'black',
                marginBottom: 50,
              }}>
              {data.repairerName}
            </Text>
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                paddingHorizontal: '4%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                }}>
                <View style={[styles.box, {marginTop: 20}]}>
                  <Image
                    style={{width: 28, height: 28}}
                    source={require('../../../assets/images/type/calendar.png')}
                  />
                  <Text style={styles.tittleText}>{data.jointAt}</Text>
                  <Text style={{color: 'black'}}>Ngày tham gia FLIX</Text>
                </View>
                <View style={[styles.box, {marginTop: 20}]}>
                  <Image
                    style={{width: 28, height: 28}}
                    source={require('../../../assets/images/type/portfolio.png')}
                  />
                  <Text style={styles.tittleText}>
                    {data.experienceYear} năm
                  </Text>
                  <Text style={{color: 'black'}}>Kinh nghiệm làm việc</Text>
                </View>
                <View style={styles.box}>
                  <Image
                    style={{width: 28, height: 28}}
                    source={require('../../../assets/images/type/support.png')}
                  />
                  <Text style={styles.tittleText}>
                    {data.successfulRepair} lượt
                  </Text>
                  <Text style={{color: 'black'}}>Sửa chữa thành công</Text>
                </View>
                <View style={styles.box}>
                  <Image
                    style={{width: 28, height: 28}}
                    source={require('../../../assets/images/type/star.png')}
                  />
                  <Text style={styles.tittleText}>
                    {data.rating.toString().substr(0, 3)}
                  </Text>
                  <Text style={{color: 'black'}}>Trung bình đánh giá</Text>
                </View>
              </View>
              <Text style={styles.tittleText}>
                Đánh giá của khách hàng (
                {data.totalComment ? data.totalComment : 0})
              </Text>

              <FlatList
                showsVerticalScrollIndicator={false}
                data={comments}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      paddingHorizontal: 10,
                      backgroundColor: '#F0F0F0',
                      borderRadius: 18,
                      paddingVertical: 16,
                      marginBottom: 10,
                    }}>
                    <Text style={{fontSize: 10, textAlign: 'right'}}>
                      {item.createdAt ? item.createdAt : '08:47 - 27/05/2022'}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}>
                      <Image
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: width * 0.5,
                          borderColor: '#F0F0F0',
                          borderWidth: 1,
                          marginRight: 10,
                        }}
                        source={{
                          uri: item.customerAvatar
                            ? item.customerAvatar
                            : 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/7/8/1065932/Nhac-Si-Ho-Hoai-Anh-.jpg',
                        }}
                      />
                      <View style={{flex: 1}}>
                        <Text style={[styles.tittleText, {marginVertical: 0}]}>
                          {item.customerName}
                        </Text>
                        <View style={{flexDirection: 'row', marginVertical: 6}}>
                          {renderStarItem(item.rating)}
                        </View>
                        <Text style={{color: 'black'}}>{item.comment}</Text>
                      </View>
                    </View>
                  </View>
                )}
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
                  setOffset(offset + 10);
                }}
                onEndReachedThreshold={0.5}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#CACACA',
    width: '100%',
    marginBottom: 10,
  },
  box: {
    width: '48%',
    backgroundColor: '#F0F0F0',
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 16,
    marginVertical: 10,
  },
  boxHeader: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  tittleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginVertical: 6,
  },
  inputField: {marginBottom: 12},
  inputLabel: {
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  valueSpace: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  valueText: {
    fontSize: 16,
    color: 'black',
  },
  valueTextBlur: {
    fontSize: 16,
    color: 'black',
    opacity: 0.5,
  },
  pickerStyle: {
    inputIOS: {
      fontSize: 16,
      color: 'black',
    },
    inputAndroid: {
      fontSize: 16,
      color: 'black',
    },
  },
});

export default RepairerProfileScreen;
