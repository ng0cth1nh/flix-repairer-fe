import {
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import React, {useState, useContext, useEffect, useCallback} from 'react';
const {width} = Dimensions.get('window');
import {Context as AuthContext} from '../../context/AuthContext';
import CustomModal from '../../components/CustomModal';
import {useSelector, useDispatch} from 'react-redux';
import useAxios from '../../hooks/useAxios';
import {
  fetchProfile,
  selectUser,
  resetState as resetUserState,
} from '../../features/user/userSlice';
import {resetState as resetRequestState} from '../../features/request/requestSlice';
import {resetState as resetHomeState} from '../../features/home/homeSlice';
import {numberWithCommas} from '../../utils/util';
import Icon from 'react-native-vector-icons/FontAwesome';
import SubmitButton from '../../components/SubmitButton';

const ProfileScreen = ({navigation}) => {
  const {logout, state} = useContext(AuthContext);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [coverBalance, setCoverBalance] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const repairerAPI = useAxios();

  const user = useSelector(selectUser);

  useEffect(() => {
    if (!user.role && state.token) {
      dispatch(fetchProfile(repairerAPI));
    }
  }, []);

  const onRefresh = useCallback(() => {
    try {
      setRefreshing(true);
      dispatch(fetchProfile(repairerAPI));
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <SafeAreaView
      style={[
        {backgroundColor: '#FEC54B', flex: 1},
        modalVisible ? {opacity: 0.9} : {},
      ]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FEC54B" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FEC54B']}
          />
        }>
        <Image
          style={{
            width: 110,
            height: 110,
            borderRadius: width * 0.5,
            borderColor: '#F0F0F0',
            borderWidth: 1,
            alignSelf: 'center',
            marginTop: 100,
            marginBottom: 10,
          }}
          source={{uri: user.avatar}}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            alignSelf: 'center',
            color: 'black',
            marginBottom: 6,
          }}>
          {user.fullName}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
            marginBottom: 40,
          }}>
          {user.role === 'ROLE_REPAIRER' ? (
            <>
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/images/type/check.png')}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'black',
                  marginLeft: 6,
                }}>
                ???? x??c th???c
              </Text>
            </>
          ) : user.role === 'ROLE_PENDING_REPAIRER' ? (
            <>
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/images/type/unCheck.png')}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'black',
                  marginLeft: 6,
                }}>
                Ch??? x??c th???c
              </Text>
            </>
          ) : null}
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            paddingTop: 20,
          }}>
          <View style={styles.wrapper}>
            <View style={[styles.container, {height: 60}]}>
              <View style={{flexDirection: 'row', flex: 11, marginLeft: 16}}>
                <Image
                  style={[
                    styles.icon,
                    {width: 30, height: 30, borderRadius: 8},
                  ]}
                  source={require('../../../assets/images/logo/logo_size.jpg')}
                />
                <View>
                  <Text style={[styles.title, {fontSize: 16}]}>
                    S??? d?? t??i kho???n
                  </Text>
                  <Text
                    style={[styles.title, {fontSize: 16, color: '#E9AB0D'}]}>
                    {coverBalance ? '********' : numberWithCommas(user.balance)}{' '}
                    VND
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.iconView}
                onPress={() => setCoverBalance(!coverBalance)}>
                {coverBalance ? (
                  <Icon name="eye" size={18} color="black" />
                ) : (
                  <Icon name="eye-slash" size={18} color="black" />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.push('ProfileInfoScreen')}
            style={styles.wrapper}>
            <View style={styles.container}>
              <View style={{flexDirection: 'row', flex: 11, marginLeft: 16}}>
                <Image
                  style={styles.icon}
                  source={require('../../../assets/images/type/user-profile.png')}
                />
                <Text style={styles.title}>Th??ng tin t??i kho???n</Text>
              </View>
              <Image
                style={styles.iconNext}
                source={require('../../../assets/images/type/right-arrow.png')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.push('ChangePasswordScreen')}
            style={styles.wrapper}>
            <View style={styles.container}>
              <View style={{flexDirection: 'row', flex: 11, marginLeft: 16}}>
                <Image
                  style={styles.icon}
                  source={require('../../../assets/images/type/padlock.png')}
                />
                <Text style={styles.title}>Thay ?????i m???t kh???u</Text>
              </View>
              <Image
                style={styles.iconNext}
                source={require('../../../assets/images/type/right-arrow.png')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (user.role && user.role === 'ROLE_REPAIRER') {
                setShowExtra(!showExtra);
              } else {
                setModalVisible(true);
              }
            }}
            style={styles.wrapper}>
            <View style={styles.container}>
              <View style={{flexDirection: 'row', flex: 11, marginLeft: 16}}>
                <Image
                  style={styles.icon}
                  source={require('../../../assets/images/type/transaction.png')}
                />
                <Text style={styles.title}>Qu???n l?? giao d???ch</Text>
              </View>
              <Image
                style={[
                  styles.iconNext,
                  {transform: [{rotate: showExtra ? '90deg' : '0deg'}]},
                ]}
                source={require('../../../assets/images/type/right-arrow.png')}
              />
            </View>
          </TouchableOpacity>
          {showExtra ? (
            <>
              <TouchableOpacity
                onPress={() => navigation.push('BalanceChangeScreen')}
                style={styles.wrapper}>
                <View style={[styles.container, {marginHorizontal: '6%'}]}>
                  <View
                    style={{flexDirection: 'row', flex: 11, marginLeft: 16}}>
                    <Image
                      style={styles.icon}
                      source={require('../../../assets/images/type/list.png')}
                    />
                    <Text style={styles.title}>Bi???n ?????ng s??? d??</Text>
                  </View>
                  <Image
                    style={styles.iconNext}
                    source={require('../../../assets/images/type/right-arrow.png')}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.push('DepositScreen', {
                    vnp_TxnRef: null,
                    vnp_ResponseCode: null,
                  })
                }
                style={styles.wrapper}>
                <View style={[styles.container, {marginHorizontal: '6%'}]}>
                  <View
                    style={{flexDirection: 'row', flex: 11, marginLeft: 16}}>
                    <Image
                      style={styles.icon}
                      source={require('../../../assets/images/type/deposit.png')}
                    />
                    <Text style={styles.title}>N???p ti???n v??o t??i kho???n</Text>
                  </View>
                  <Image
                    style={styles.iconNext}
                    source={require('../../../assets/images/type/right-arrow.png')}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.push('WithdrawScreen')}
                style={styles.wrapper}>
                <View style={[styles.container, {marginHorizontal: '6%'}]}>
                  <View
                    style={{flexDirection: 'row', flex: 11, marginLeft: 16}}>
                    <Image
                      style={styles.icon}
                      source={require('../../../assets/images/type/withdraw.png')}
                    />
                    <Text style={styles.title}>Y??u c???u r??t ti???n</Text>
                  </View>
                  <Image
                    style={styles.iconNext}
                    source={require('../../../assets/images/type/right-arrow.png')}
                  />
                </View>
              </TouchableOpacity>
            </>
          ) : null}
          <TouchableOpacity
            onPress={() => navigation.push('FeedbackScreen')}
            style={styles.wrapper}>
            <View style={styles.container}>
              <View style={{flexDirection: 'row', flex: 11, marginLeft: 16}}>
                <Image
                  style={styles.icon}
                  source={require('../../../assets/images/type/help-desk.png')}
                />
                <Text style={styles.title}>Y??u c???u h??? tr???</Text>
              </View>
              <Image
                style={styles.iconNext}
                source={require('../../../assets/images/type/right-arrow.png')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLogoutModalVisible(true)}
            style={[styles.wrapper, {paddingBottom: 60}]}>
            <View style={styles.container}>
              <View style={{flexDirection: 'row', flex: 11, marginLeft: 16}}>
                <Image
                  style={styles.icon}
                  source={require('../../../assets/images/type/exit.png')}
                />
                <Text style={styles.title}>????ng xu???t</Text>
              </View>
              <Image
                style={styles.iconNext}
                source={require('../../../assets/images/type/right-arrow.png')}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CustomModal
        modalVisible={logoutModalVisible}
        setModalVisible={setLogoutModalVisible}
        modalRatio={0.28}>
        <Text style={styles.modalText}>
          B???n c?? ch???c ch???n mu???n ????ng xu???t t??i kho???n n??y kh??ng?
        </Text>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            style={[styles.button, styles.buttonOpen]}
            onPress={async () => {
              await logout();
              dispatch(resetRequestState());
              dispatch(resetHomeState());
              dispatch(resetUserState());
            }}>
            <Text style={styles.textStyle}>????NG XU???T</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => setLogoutModalVisible(false)}>
            <Text style={styles.textStyle}>????NG</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalRatio={0.28}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'black',
            textAlign: 'center',
            marginBottom: 5,
          }}>
          L??u ??
        </Text>
        <View style={{marginVertical: 10}}>
          <Text>T??i kho???n c???a b???n ch??a ???????c x??c th???c</Text>
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
            buttonText="?????NG ??"
          />
        </View>
      </CustomModal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    borderRadius: 10,
    marginHorizontal: '4%',
    flex: 1,
    height: 42,
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  icon: {width: 24, height: 24, marginRight: 24, alignSelf: 'center'},
  iconNext: {width: 18, height: 18, marginRight: 16},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 60,
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
  iconView: {
    height: '100%',
    width: '12%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 16,
    color: 'black',
  },
});
export default ProfileScreen;
