import './src/utils/ignoreWarnings';
import 'react-native-gesture-handler';
import React, {useEffect, useState, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Image, View, Text, Dimensions} from 'react-native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {navigationRef} from './src/RootNavigation';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ModalsProvider} from 'react-native-nested-modals';
import {
  Provider as AuthProvider,
  Context as AuthContext,
} from './src/context/AuthContext';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ConfirmOTPScreen from './src/screens/auth/ConfirmOTPScreen';
import TermsOfUseScreen from './src/screens/auth/TermsOfUseScreen';
import ForgotPassScreen from './src/screens/auth/ForgotPassScreen';
import AddRequestScreen from './src/screens/request/AddRequestScreen';
import RequestDetailScreen from './src/screens/request/RequestDetailScreen';
import ChoosePaymentMethodScreen from './src/screens/request/ChoosePaymentMethodScreen';
import RequestHistoryScreen from './src/screens/request/RequestHistoryScreen';
import AddFixedServiceScreen from './src/screens/request/AddFixedServiceScreen';
import AddExtraServiceScreen from './src/screens/request/AddExtraServiceScreen';
import AddSubServiceScreen from './src/screens/request/AddSubServiceScreen';
import AddFixedAccessoriesScreen from './src/screens/request/AddFixedAccessoriesScreen';
import AddAddressScreen from './src/screens/address/AddAddressScreen';
import AddressListScreen from './src/screens/address/AddressListScreen';
import EditAddressScreen from './src/screens/address/EditAddressScreen';
import InvoiceScreen from './src/screens/request/InvoiceScreen';
import HomeScreen from './src/screens/main/HomeScreen';
import ServiceFilterScreen from './src/screens/main/ServiceFilterScreen';
import SearchServiceFilterScreen from './src/screens/main/SearchServiceFilterScreen';
import NotificationScreen from './src/screens/main/NotificationScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';
import Toast from 'react-native-toast-message';
import {
  requestUserPermission,
  notificationListener,
} from './src/notification/PushNotification';
import {store} from './src/features/store';
import {Provider} from 'react-redux';

const toastConfig = {
  customToast: ({text1}) => (
    <View
      style={{
        height: 64,
        backgroundColor: '#56CA76',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 18,
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
        width: '90%',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 18,
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

  const [isLoading, setIsLoading] = useState(true);
  let {state, TryLocalLogin, clearErrorMessage} = useContext(AuthContext);
  useEffect(() => {
    TryLocalLogin();
    requestUserPermission();
    //notificationListener();
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [TryLocalLogin]);
  if (isLoading) {
    return <SplashScreen />;
  }
  function HomeStackScreen() {
    return (
      <Stack.Navigator
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
      </Stack.Navigator>
    );
  }

  function RequestHistoryStackScreen() {
    return (
      <Stack.Navigator
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
      </Stack.Navigator>
    );
  }

  return (
    <>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          {/* state.token */}
          {state.token ? (
            <Tab.Navigator
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
                  } else if (route.name === 'Profile') {
                    icon = focused
                      ? require('./assets/images/type/user-profile-active.png')
                      : require('./assets/images/type/user-profile.png');
                  }
                  return (
                    <Image style={{height: 24, width: 24}} source={icon} />
                  );
                },
              })}>
              <Tab.Screen name="HomeStackScreen" component={HomeStackScreen} />
              <Tab.Screen
                name="RequestHistoryStackScreen"
                component={RequestHistoryStackScreen}
              />
              <Tab.Screen name="Notification" component={NotificationScreen} />
              <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
          ) : (
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                // gestureEnabled: true,
                // gestureDirection: 'horizontal',
                // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
                name="ChoosePaymentMethodScreen"
                component={ChoosePaymentMethodScreen}
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
        </NavigationContainer>
        <Toast
          config={toastConfig}
          position="bottom"
          visibilityTime={2000}
          bottomOffset={90}
        />
      </Provider>
    </>
  );
}
export default () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};
