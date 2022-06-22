import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const {width} = Dimensions.get('window');
import ScreenA from '../request_history/ScreenA';
import ScreenB from '../request_history/ScreenB';
import ScreenC from '../request_history/ScreenC';
import ScreenD from '../request_history/ScreenD';
import ScreenE from '../request_history/ScreenE';
import ScreenF from '../request_history/ScreenF';

const TopTabs = createMaterialTopTabNavigator();
function RequestHistory() {
  return (
    <TopTabs.Navigator
      tabBarOptions={{
        scrollEnabled: true,
        tabStyle: {width: 0.28 * width},
        indicatorStyle: {
          backgroundColor: '#FEC54B',
        },
      }}
      screenOptions={({route}) => ({
        tabBarLabel: ({focused}) => {
          return (
            <Text
              style={[
                styles.label,
                focused
                  ? {color: '#FEC54B', fontWeight: '500'}
                  : {color: 'black'},
              ]}>
              {route.name}
            </Text>
          );
        },
      })}>
      <TopTabs.Screen name="Chờ xác nhận" component={ScreenA} />
      <TopTabs.Screen name="Đã xác nhận" component={ScreenB} />
      <TopTabs.Screen name="ScreenC" component={ScreenC} />
      <TopTabs.Screen name="ScreenD" component={ScreenD} />
      <TopTabs.Screen name="ScreenE" component={ScreenE} />
      <TopTabs.Screen name="ScreenF" component={ScreenF} />
    </TopTabs.Navigator>
  );
}
const RequestHistoryScreen = () => {
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView style={{flex: 1}}>
        <Text style={styles.headerText}>Lịch sử sửa chữa</Text>
        <RequestHistory />
      </SafeAreaView>
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
    brequestBottomWidth: 0.7,
    brequestBottomColor: '#CACACA',
    width: '100%',
  },
  label: {
    fontSize: 12,
    textTransform: 'none',
  },
});

export default RequestHistoryScreen;
