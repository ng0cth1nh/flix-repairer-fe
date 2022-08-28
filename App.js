import './src/utils/ignoreWarnings';
import 'react-native-gesture-handler';
import React, {useEffect, useState, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Image, View, Text, Dimensions, StyleSheet} from 'react-native';
import {fetchProfile} from './src/features/user/userSlice';
import {fetchRequests} from './src/features/request/requestSlice';
import {useSelector, useDispatch} from 'react-redux';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebase} from '@react-native-firebase/database';
import {navigationRef} from './src/RootNavigation';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Provider as AuthProvider,
  Context as AuthContext,
} from './src/context/AuthContext';
const {width} = Dimensions.get('window');
import SplashScreen from './src/screens/SplashScreen';
import CommentScreen from './src/screens/feedback/CommentScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ConfirmOTPScreen from './src/screens/auth/ConfirmOTPScreen';
import TermsOfUseScreen from './src/screens/auth/TermsOfUseScreen';
import ForgotPassScreen from './src/screens/auth/ForgotPassScreen';
import ChangePasswordScreen from './src/screens/profile/ChangePasswordScreen';
import RequestDetailScreen from './src/screens/request/RequestDetailScreen';
import EditProfileInfoScreen from './src/screens/profile/EditProfileInfoScreen';
import ProfileInfoScreen from './src/screens/profile/ProfileInfoScreen';
import RequestHistoryScreen from './src/screens/request/RequestHistoryScreen';
import AddFixedServiceScreen from './src/screens/request/AddFixedServiceScreen';
import AddExtraServiceScreen from './src/screens/request/AddExtraServiceScreen';
import AddSubServiceScreen from './src/screens/request/AddSubServiceScreen';
import AddFixedAccessoriesScreen from './src/screens/request/AddFixedAccessoriesScreen';
import FeedbackScreen from './src/screens/feedback/FeedbackScreen';
import InvoiceScreen from './src/screens/request/InvoiceScreen';
import HomeScreen from './src/screens/main/HomeScreen';
import ServiceFilterScreen from './src/screens/main/ServiceFilterScreen';
import SearchServiceFilterScreen from './src/screens/main/SearchServiceFilterScreen';
import ServicePriceScreen from './src/screens/main/ServicePriceScreen';
import NotificationScreen from './src/screens/main/NotificationScreen';
import ChatListScreen from './src/screens/chat/ChatListScreen';
import ChatScreen from './src/screens/chat/ChatScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';
import Toast from 'react-native-toast-message';
import BalanceChangeScreen from './src/screens/transaction/BalanceChangeScreen';
import DepositScreen from './src/screens/transaction/DepositScreen';
import WithdrawScreen from './src/screens/transaction/WithdrawScreen';
import {
  requestUserPermission,
  notificationListener,
} from './src/notification/PushNotification';
import {store} from './src/features/store';
import {Provider} from 'react-redux';
import useAxios from './src/hooks/useAxios';
import linking from './global/Linking';
import ApiConstants from './src/constants/Api';
import {
  fetchNotifications,
  setNotifications as setNotis,
  setPageNumbers,
  setTotalPageNotifications,
  setNumberOfUnread,
  selectNumberOfUnread,
} from './src/features/user/userSlice';
import {NUMBER_RECORD_PER_PAGE} from './src/constants/Api';
import firestore from '@react-native-firebase/firestore';
import {RequestStatus} from './src/utils/util';
import {useNetInfo} from '@react-native-community/netinfo';
import CustomModal from './src/components/CustomModal';
import SubmitButton from './src/components/SubmitButton';

const toastConfig = {
  customToast: ({text1}) => (
    <View
      style={{
        height: 64,
        backgroundColor: '#56CA76',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        width: '92%',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 16,
          color: 'white',
          textAlign: 'center',
        }}>
        {text1}
      </Text>
    </View>
  ),
  customErrorToast: ({text1}) => (
    <View
      style={{
        height: 64,
        backgroundColor: 'red',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        width: '92%',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 16,
          color: 'white',
          textAlign: 'center',
        }}>
        {text1}
      </Text>
    </View>
  ),
};

function App() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();
  const netInfo = useNetInfo();
  const [isLoading, setIsLoading] = useState(true);
  const [isNotiReceived, setIsNotiReceived] = useState(false);
  const [notificationType, setNotificationType] = useState('');
  const numberOfUnread = useSelector(selectNumberOfUnread);
  const [countOne, setCountOne] = useState(0);
  const [countTwo, setCountTwo] = useState(0);
  const [numberOfUnreadMessage, setNumberOfUnreadMessage] = useState(0);
  const dispatch = useDispatch();
  const repairerAPI = useAxios();
  const [modalVisible, setModalVisible] = useState(false);
  let {state, TryLocalLogin, clearErrorMessage} = useContext(AuthContext);

  useEffect(() => {
    console.log('netInfo.isConnected: ', netInfo.isConnected);
    setModalVisible(netInfo.isConnected ? false : true);
  }, [netInfo.isConnected]);

  useEffect(() => {
    TryLocalLogin();
    requestUserPermission();
    notificationListener(setIsNotiReceived, setNotificationType);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [TryLocalLogin]);

  useEffect(() => {
    if (
      notificationType === '' ||
      notificationType === 'REGISTER_SUCCESS' ||
      notificationType === 'REGISTER_SUCCESS' ||
      notificationType === 'ACCEPTED_WITHDRAW' ||
      notificationType === 'REQUEST_DONE'
    ) {
      dispatch(fetchProfile(repairerAPI));
      if (notificationType === 'REQUEST_DONE') {
        dispatch(
          fetchRequests({repairerAPI, status: RequestStatus.PAYMENT_WAITING}),
        );
        dispatch(fetchRequests({repairerAPI, status: RequestStatus.DONE}));
      }
    } else if (notificationType === 'REQUEST_CANCELED') {
      dispatch(fetchRequests({repairerAPI, status: RequestStatus.APPROVED}));
      dispatch(fetchRequests({repairerAPI, status: RequestStatus.FIXING}));
      dispatch(fetchRequests({repairerAPI, status: RequestStatus.CANCELLED}));
    }
  }, [notificationType]);

  useEffect(() => {
    if (state.token) {
      const saveFCMToken = async () => {
        let fcmToken = await AsyncStorage.getItem('fcmtoken');
        try {
          await repairerAPI.post(ApiConstants.SAVE_FCM_TOKEN, {
            token: fcmToken,
          });
          console.log('save token success');
        } catch (err) {
          console.log('save token error: ', err.toJSON());
        }
      };
      saveFCMToken();
      setIsNotiReceived(true);
    }
  }, [state.token]);

  useEffect(() => {
    const userId = state.userId;
    if (userId) {
      console.log('userId: ', userId);
      const reference = firebase
        .app()
        .database(
          'https://flix-cb844-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref(`/online/${userId}`);

      // Set the /users/:userId value to true
      reference
        .set(true)
        .then(() => console.log('Online presence set'))
        .catch(err => console.log(err));

      // Remove the node whenever the client disconnects
      reference
        .onDisconnect()
        .remove()
        .then(() => console.log('On disconnect function configured.'));

      const firstOneSubscriber = firestore()
        .collection('conversations')
        .where('memberOne', '==', userId)
        .where('enabled', '==', true)
        .onSnapshot(onResult(1), onError);
      const secondOneSubscriber = firestore()
        .collection('conversations')
        .where('memberTwo', '==', userId)
        .where('enabled', '==', true)
        .onSnapshot(onResult(2), onError);

      return () => {
        firstOneSubscriber();
        secondOneSubscriber();
      };
    }
  }, [state.userId]);

  const onResult = index => querySnapshot => {
    let count = 0;
    if (querySnapshot.size > 0) {
      count = querySnapshot.docs.filter(doc => {
        return (
          doc.data().senderId !== state.userId && doc.data().isRead === false
        );
      }).length;
    }
    if (index === 1) {
      setCountOne(count);
    } else {
      setCountTwo(count);
    }
  };

  function onError(error) {
    setNumberOfUnreadMessage(0);
  }

  useEffect(() => {
    setNumberOfUnreadMessage(countOne + countTwo);
  }, [countOne, countTwo]);

  useEffect(() => {
    (async () => {
      if (isNotiReceived) {
        console.log('isNotiReceived: ', isNotiReceived);
        try {
          let temp = 0;
          let res = await dispatch(
            fetchNotifications({
              repairerAPI,
              pageNumber: temp,
              pageSize: NUMBER_RECORD_PER_PAGE,
            }),
          ).unwrap();
          dispatch(
            setNumberOfUnread(res.numberOfUnread ? res.numberOfUnread : 0),
          );
          console.log('numberofunread: ', res.numberOfUnread);
          dispatch(setNotis(res.notifications));
          dispatch(setPageNumbers(0));
          dispatch(
            setTotalPageNotifications(
              Math.ceil(+res.totalRecord / NUMBER_RECORD_PER_PAGE),
            ),
          );
        } catch (err) {
        } finally {
          setIsNotiReceived(false);
        }
      }
    })();
  }, [isNotiReceived]);

  if (isLoading) {
    return <SplashScreen />;
  }
  function HomeStackScreen() {
    return (
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          name="ServiceFilterScreen"
          component={ServiceFilterScreen}
        />
        <Stack.Screen
          name="SearchServiceFilterScreen"
          component={SearchServiceFilterScreen}
        />
        <Stack.Screen
          name="RequestDetailScreen"
          component={RequestDetailScreen}
        />
        <Stack.Screen
          name="ServicePriceScreen"
          component={ServicePriceScreen}
        />
      </Stack.Navigator>
    );
  }
  const ChatStackScreen = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
      </Stack.Navigator>
    );
  };

  function RequestHistoryStackScreen() {
    return (
      <Stack.Navigator
        initialRouteName="RequestHistoryScreen"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen
          name="RequestHistoryScreen"
          component={RequestHistoryScreen}
        />
        <Stack.Screen
          name="RequestDetailScreen"
          component={RequestDetailScreen}
        />
        <Stack.Screen
          name="AddFixedServiceScreen"
          component={AddFixedServiceScreen}
        />
        <Stack.Screen
          name="AddFixedAccessoriesScreen"
          component={AddFixedAccessoriesScreen}
        />
        <Stack.Screen
          name="AddExtraServiceScreen"
          component={AddExtraServiceScreen}
        />
        <Stack.Screen
          name="AddSubServiceScreen"
          component={AddSubServiceScreen}
        />
        <Stack.Screen name="InvoiceScreen" component={InvoiceScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen
          name="ServicePriceScreen"
          component={ServicePriceScreen}
        />
        <Stack.Screen name="CommentScreen" component={CommentScreen} />
      </Stack.Navigator>
    );
  }

  function ProfileStackScreen() {
    return (
      <Stack.Navigator
        initialRouteName="ProfileScreen"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="ProfileInfoScreen" component={ProfileInfoScreen} />
        <Stack.Screen
          name="EditProfileInfoScreen"
          component={EditProfileInfoScreen}
        />
        <Stack.Screen
          name="SearchServiceFilterScreen"
          component={SearchServiceFilterScreen}
        />
        <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
        />
        <Stack.Screen
          name="BalanceChangeScreen"
          component={BalanceChangeScreen}
        />
        <Stack.Screen name="DepositScreen" component={DepositScreen} />
        <Stack.Screen name="WithdrawScreen" component={WithdrawScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <>
      <NavigationContainer ref={navigationRef} linking={linking}>
        {state.token ? (
          <Tab.Navigator
            initialRouteName="HomeStackScreen"
            tabBarOptions={{
              showLabel: false,
              keyboardHidesTabBar: true,
              style: {
                backgroundColor: '#FEC54B',
              },
            }}
            screenOptions={({route}) => ({
              tabBarShowLabel: false,
              headerShown: false,
              tabBarStyle: {
                height: 50,
              },
              tabBarIcon: ({focused, size, color}) => {
                let icon;
                if (route.name === 'HomeStackScreen') {
                  icon = focused
                    ? require('./assets/images/type/home-active.png')
                    : require('./assets/images/type/home.png');
                } else if (route.name === 'RequestHistoryStackScreen') {
                  icon = focused
                    ? require('./assets/images/type/archive-active.png')
                    : require('./assets/images/type/archive.png');
                } else if (route.name === 'Notification') {
                  icon = focused
                    ? require('./assets/images/type/bell-ring-active.png')
                    : require('./assets/images/type/bell-ring.png');
                } else if (route.name === 'ProfileStackScreen') {
                  icon = focused
                    ? require('./assets/images/type/user-profile-active.png')
                    : require('./assets/images/type/user-profile.png');
                } else if (route.name === 'ChatStackScreen') {
                  icon = focused
                    ? require('./assets/images/type/messenger-active.png')
                    : require('./assets/images/type/messenger.png');
                }
                return (
                  <View>
                    <Image style={{height: 24, width: 24}} source={icon} />
                    {route.name === 'Notification' && numberOfUnread !== 0 && (
                      <View
                        style={{
                          backgroundColor: 'red',
                          position: 'absolute',
                          top: -6,
                          right: numberOfUnread < 100 ? -4 : -6,
                          alignItems: 'center',
                          width: numberOfUnread < 100 ? 14 : 'auto',
                          height: numberOfUnread < 100 ? 14 : 16,
                          borderRadius: width * 0.5,
                          padding: numberOfUnread < 100 ? 0 : 2,
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 10,
                            fontWeight: '600',
                          }}>
                          {numberOfUnread}
                        </Text>
                      </View>
                    )}
                    {route.name === 'ChatStackScreen' &&
                      numberOfUnreadMessage !== 0 && (
                        <View
                          style={{
                            backgroundColor: 'red',
                            position: 'absolute',
                            top: -6,
                            right: numberOfUnreadMessage < 100 ? -4 : -6,
                            alignItems: 'center',
                            width: numberOfUnreadMessage < 100 ? 14 : 'auto',
                            height: numberOfUnreadMessage < 100 ? 14 : 16,
                            borderRadius: width * 0.5,
                            padding: numberOfUnreadMessage < 100 ? 0 : 2,
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 10,
                              fontWeight: '600',
                            }}>
                            {numberOfUnreadMessage}
                          </Text>
                        </View>
                      )}
                  </View>
                );
              },
            })}>
            <Tab.Screen name="HomeStackScreen" component={HomeStackScreen} />
            <Tab.Screen
              name="RequestHistoryStackScreen"
              component={RequestHistoryStackScreen}
            />
            <Tab.Screen name="Notification" component={NotificationScreen} />
            <Tab.Screen name="ChatStackScreen" component={ChatStackScreen} />
            <Tab.Screen
              name="ProfileStackScreen"
              component={ProfileStackScreen}
            />
          </Tab.Navigator>
        ) : (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
              gestureDirection: 'horizontal',
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              listeners={{
                focus: e => {
                  if (state.errorMessage !== '') {
                    clearErrorMessage();
                  }
                },
              }}
            />
            <Stack.Screen name="InvoiceScreen" component={InvoiceScreen} />
            <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              listeners={{
                focus: e => {
                  if (state.errorMessage !== '') {
                    clearErrorMessage();
                  }
                },
              }}
            />
            <Stack.Screen
              name="ForgotPassScreen"
              component={ForgotPassScreen}
              listeners={{
                focus: e => {
                  if (state.errorMessage !== '') {
                    clearErrorMessage();
                  }
                },
              }}
            />
            <Stack.Screen
              name="TermsOfUseScreen"
              component={TermsOfUseScreen}
            />
            <Stack.Screen
              name="ConfirmOTPScreen"
              component={ConfirmOTPScreen}
            />
          </Stack.Navigator>
        )}
        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          modalRatio={0.28}>
          <Text style={styles.modalText}>Lưu ý</Text>
          <View style={{marginVertical: 10}}>
            <Text>Không có kết nối internet</Text>
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
              buttonText="ĐÓNG"
            />
          </View>
        </CustomModal>
      </NavigationContainer>
      <Toast
        config={toastConfig}
        position="bottom"
        visibilityTime={2000}
        bottomOffset={90}
      />
    </>
  );
}

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

export default () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  );
};
