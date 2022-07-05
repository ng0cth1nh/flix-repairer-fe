import React, {useState} from 'react';
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
const {width, height} = Dimensions.get('window');
import ApprovedScreen from '../request_history/ApprovedScreen';
import CancelledScreen from '../request_history/CancelledScreen';
import DoneScreen from '../request_history/DoneScreen';
import FixingScreen from '../request_history/FixingScreen';
import PaymentWaitingScreen from '../request_history/PaymentWaitingScreen';
import TopHeaderComponent from '../../components/TopHeaderComponent';

const TopTabs = createMaterialTopTabNavigator();
function RequestHistory() {
  return (
    <TopTabs.Navigator
      tabBarOptions={{
        scrollEnabled: true,
        tabStyle: {width: 0.3 * width},
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
      <TopTabs.Screen name="Đã xác nhận" component={ApprovedScreen} />
      <TopTabs.Screen name="Đang sửa" component={FixingScreen} />
      <TopTabs.Screen name="Chờ thanh toán" component={PaymentWaitingScreen} />
      <TopTabs.Screen name="Đã hoàn thành" component={DoneScreen} />
      <TopTabs.Screen name="Đã hủy" component={CancelledScreen} />
    </TopTabs.Navigator>
  );
}
const RequestHistoryScreen = ({navigation}) => {
  const [reqStatus, setReqStatus] = useState(0);
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Lịch sử sửa chữa"
        isBackButton={false}
        statusBarColor="white"
      />
      <SafeAreaView style={{flex: 1}}>
        <RequestHistory />
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    textTransform: 'none',
  },
});

export default RequestHistoryScreen;
