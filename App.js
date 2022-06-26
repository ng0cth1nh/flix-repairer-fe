import 'react-native-gesture-handler';
import React, {useEffect, useState, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Image} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
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

function App() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  const [isLoading, setIsLoading] = useState(true);
  let {state, TryLocalLogin, clearErrorMessage} = useContext(AuthContext);
  useEffect(() => {
    // TryLocalLogin();
    requestUserPermission();
    notificationListener();
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [TryLocalLogin]);
  if (isLoading) {
    return <SplashScreen />;
  }
  function HomeStackScreen() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          name="ServiceFilterScreen"
          component={ServiceFilterScreen}
        />
        <Stack.Screen
          name="SearchServiceFilterScreen"
          component={SearchServiceFilterScreen}
        />
      </Stack.Navigator>
    );
  }
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        {/* state.token */}
        {true ? (
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
                } else if (route.name === 'RequestHistory') {
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
                return <Image style={{height: 24, width: 24}} source={icon} />;
              },
            })}>
            <Tab.Screen name="HomeStackScreen" component={HomeStackScreen} />
            <Tab.Screen
              name="RequestHistory"
              component={RequestHistoryScreen}
            />
            <Tab.Screen name="Notification" component={NotificationScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{headerShown: false}}>
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
      <Toast />
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
