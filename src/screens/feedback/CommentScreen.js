import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Button from '../../components/SubmitButton';
import {
  setIsLoading,
  selectIsLoading,
  rateCustomer,
} from '../../features/request/requestSlice';
import {Rating} from 'react-native-ratings';
import useAxios from '../../hooks/useAxios';
import Toast from 'react-native-toast-message';
import ProgressLoader from 'rn-progress-loader';
import {useSelector, useDispatch} from 'react-redux';
import TopHeaderComponent from '../../components/TopHeaderComponent';

const CommentScreen = ({route, navigation}) => {
  const {data} = route.params;

  const isLoading = useSelector(selectIsLoading);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const repairerAPI = useAxios();
  const dispatch = useDispatch();

  const handleRatingCustomer = async () => {
    try {
      await dispatch(setIsLoading());
      await dispatch(
        rateCustomer({
          repairerAPI,
          body: {
            requestCode: data.requestCode,
            rating,
            comment,
          },
        }),
      ).unwrap();
      Toast.show({
        type: 'customToast',
        text1: 'Đánh giá khách hàng thành công',
      });
      navigation.navigate('RequestHistoryScreen', {
        screen: 'DoneScreen',
      });
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Đánh giá khách hàng"
        isBackButton={true}
        statusBarColor="white"
      />
      <ProgressLoader
        visible={isLoading}
        isModal={true}
        isHUD={true}
        hudColor={'#FEC54B'}
        color={'#000000'}
      />
      <SafeAreaView style={{flex: 1, marginHorizontal: '4%'}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.box, {marginTop: 12}]}>
            <View>
              <View style={styles.boxHeader}>
                <Image
                  source={require('../../../assets/images/type/user.png')}
                  style={{
                    height: 24,
                    width: 24,
                  }}
                />
                <Text style={[styles.tittleText, {marginLeft: 12}]}>
                  Khách hàng
                </Text>
              </View>
              <View style={styles.boxBody}>
                <Image
                  source={{uri: data.customerAvatar}}
                  style={{
                    width: '15%',
                    aspectRatio: 0.85,
                    borderRadius: 10,
                    marginLeft: 10,
                  }}
                />
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <View style={styles.boxBodyContent}>
                    <Text style={styles.textBold}>
                      {`${data.customerName} - ${data.customerPhone}`}
                    </Text>
                    <Text style={{color: 'black', marginBottom: 5}}>
                      {data.customerAddress}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.boxHeader}>
                <Image
                  source={require('../../../assets/images/type/rate.png')}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
                <Text style={styles.tittleText}>Đánh giá</Text>
              </View>
              <Rating
                type="custom"
                ratingCount={5}
                imageSize={24}
                ratingColor="#FEC54B"
                tintColor="#F0F0F0"
                jumpValue={1}
                startingValue={rating}
                onFinishRating={setRating}
                onSwipeRating={setRating}
                onStartRating={setRating}
                style={{
                  marginHorizontal: 10,
                  paddingLeft: 24,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              />
              <View style={styles.boxHeader}>
                <Image
                  source={require('../../../assets/images/type/writing.png')}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
                <Text style={styles.tittleText}>Nhận xét</Text>
              </View>
              <View style={{flex: 4, marginLeft: 30, marginTop: 10}}>
                <TextInput
                  multiline
                  numberOfLines={5}
                  onChangeText={text => setComment(text)}
                  value={comment}
                  style={{
                    padding: 8,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    height: '80%',
                    color: 'black',
                  }}
                  placeholder="Nhập lời nhận xét"
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <Button
          style={{
            marginVertical: 8,
            width: '100%',
            alignSelf: 'center',
          }}
          onPress={handleRatingCustomer}
          buttonText="Đánh giá"
        />
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'black',
    marginTop: getStatusBarHeight(),
    paddingBottom: 15,
    alignSelf: 'center',
  },
  box: {
    height: 'auto',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: '6%',
    paddingBottom: 16,
    paddingTop: 10,
    marginVertical: 6,
  },
  boxHeader: {
    flexDirection: 'row',
    flex: 2,
    alignItems: 'center',
    marginVertical: 8,
  },
  tittleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
    marginBottom: 3,
  },
  editTouch: {
    marginLeft: 'auto',
  },
  editText: {
    color: '#FEC54B',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 12,
  },
  boxBody: {
    flex: 8,
    flexDirection: 'row',
    marginVertical: 1,
  },
  boxBodyContent: {
    flex: 1,
    marginLeft: 10,
    height: '70%',
    width: '100%',
    paddingBottom: 5,
    justifyContent: 'space-between',
  },
  viewServiceButton: {
    paddingVertical: 4,
    width: 'auto',
    borderRadius: 10,
    backgroundColor: '#FEC54B',
    paddingHorizontal: 6,
  },
  textBold: {
    fontWeight: '600',
    color: 'black',
    fontSize: 14,
  },
  datePicker: {
    flexDirection: 'row',
    width: '80%',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  serviceName: {
    color: 'black',
  },
  servicePrice: {
    marginLeft: 'auto',
    color: 'black',
    fontWeight: '600',
  },
});

export default CommentScreen;
