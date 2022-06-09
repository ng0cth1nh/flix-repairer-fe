import 'react-native-gesture-handler';
import React, {useEffect, useState, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './src/RootNavigation';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Provider as AuthProvider,
  Context as AuthContext,
} from './src/context/AuthContext';
import LoginScreen from './src/screens/auth/LoginScreen';
import SplashScreen from './src/screens/SplashScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ConfirmOTPScreen from './src/screens/auth/ConfirmOTPScreen';
import TermsOfUseScreen from './src/screens/auth/TermsOfUseScreen';
import ForgotPassScreen from './src/screens/auth/ForgotPassScreen';
import OrderScreen from './src/screens/order/OrderScreen';
import {HomeScreen} from './src/screens/main/HomeScreen';

import {
  requestUserPermission,
  notificationListener,
} from './src/notification/PushNotification';
const Stack = createStackNavigator();

function App() {
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
  return (
    <NavigationContainer ref={navigationRef}>
      {state.token ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="OrderScreen" component={OrderScreen} />
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
          <Stack.Screen name="TermsOfUseScreen" component={TermsOfUseScreen} />
          <Stack.Screen name="ConfirmOTPScreen" component={ConfirmOTPScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
export default () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};
