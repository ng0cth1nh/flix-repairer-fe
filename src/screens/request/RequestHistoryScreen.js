import React from 'react';
import {View, SafeAreaView} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ApprovedScreen from '../request_history/ApprovedScreen';
import CancelledScreen from '../request_history/CancelledScreen';
import DoneScreen from '../request_history/DoneScreen';
import FixingScreen from '../request_history/FixingScreen';
import PaymentWaitingScreen from '../request_history/PaymentWaitingScreen';
import TopHeaderComponent from '../../components/TopHeaderComponent';

const TopTabs = createMaterialTopTabNavigator();

const RequestHistoryScreen = ({navigation}) => {
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Lịch sử sửa chữa"
        isBackButton={false}
        statusBarColor="white"
      />
      <SafeAreaView style={{flex: 1}}>
        <TopTabs.Navigator
          tabBarOptions={{
            scrollEnabled: true,
            tabStyle: {width: 'auto', marginHorizontal: 8},
            indicatorStyle: {
              backgroundColor: '#FEC54B',
            },
            labelStyle: {textTransform: 'none'},
            activeTintColor: '#FEC54B',
            inactiveTintColor: 'black',
          }}>
          <TopTabs.Screen
            name="ApprovedScreen"
            component={ApprovedScreen}
            options={{tabBarLabel: 'Đã xác nhận'}}
          />
          <TopTabs.Screen
            name="FixingScreen"
            component={FixingScreen}
            options={{tabBarLabel: 'Đang sửa'}}
          />
          <TopTabs.Screen
            name="PaymentWaitingScreen"
            component={PaymentWaitingScreen}
            options={{tabBarLabel: 'Chờ thanh toán'}}
          />
          <TopTabs.Screen
            name="DoneScreen"
            component={DoneScreen}
            options={{tabBarLabel: 'Đã hoàn thành'}}
          />
          <TopTabs.Screen
            name="CancelledScreen"
            component={CancelledScreen}
            options={{tabBarLabel: 'Đã hủy'}}
          />
        </TopTabs.Navigator>
      </SafeAreaView>
    </View>
  );
};

export default RequestHistoryScreen;
