import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/FontAwesome5';

const {width, height} = Dimensions.get('window');
const OrderHistoryScreen = ({navigation}) => {
  const [reqStatus, setReqStatus] = useState(0);
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView style={{flex: 1}}>
        <Text style={styles.headerText}>Lịch sử đặt lịch</Text>
        <View
          style={{
            height: 40,
            borderBottomColor: '#CACACA',
            borderBottomWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() => setReqStatus(0)}
            style={[
              {
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                width: width / 3,
              },
              reqStatus === 0
                ? {borderBottomColor: '#FEC54B', borderBottomWidth: 1}
                : {},
            ]}>
            <Text
              style={
                reqStatus === 0 ? {fontWeight: 'bold', color: '#FEC54B'} : {}
              }>
              Chờ xác nhận
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setReqStatus(1)}
            style={[
              {
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                width: width / 3,
              },
              reqStatus === 1
                ? {borderBottomColor: '#FEC54B', borderBottomWidth: 1}
                : {},
            ]}>
            <Text
              style={
                reqStatus === 1 ? {fontWeight: 'bold', color: '#FEC54B'} : {}
              }>
              Đã xác nhận
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setReqStatus(2)}
            style={[
              {
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                width: width / 3,
              },
              reqStatus === 2
                ? {borderBottomColor: '#FEC54B', borderBottomWidth: 1}
                : {},
            ]}>
            <Text
              style={
                reqStatus === 2 ? {fontWeight: 'bold', color: '#FEC54B'} : {}
              }>
              Đang sửa
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{marginLeft: 20, marginRight: 20}}>
          <View
            style={[
              styles.box,
              {height: 0.25 * height, flexDirection: 'column'},
            ]}>
            <View style={styles.boxHeader}>
              <Icon name="tools" size={20} />
              <Text style={styles.tittleText}>Dịch vụ sửa chữa</Text>
              <Text style={styles.editText}>13:05 - 20/05/2022</Text>
            </View>
            <View style={styles.boxBody}>
              <Image
                source={require('../../../assets/images/login_register_bg/bg.png')}
                style={{
                  height: '70%',
                  width: '25%',
                  alignSelf: 'center',
                  borderRadius: 10,
                  marginLeft: 15,
                }}
              />
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={styles.boxBodyContent}>
                  <Text style={[styles.textBold, {fontSize: 24}]}>
                    Lò nướng
                  </Text>
                  <Text style={{fontSize: 16, color: 'black'}}>
                    Phí dịch vụ kiểm tra
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingRight: 20,
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textBold}>200,000 vnđ</Text>
                    <TouchableOpacity style={styles.viewServiceButton}>
                      <Text style={styles.textBold}>Xem giá dịch vụ</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.serviceRow}>
              <Text style={styles.textBold}>TỔNG THANH TOÁN(dự kiến)</Text>
              <Text style={styles.servicePrice}>200,000 vnđ</Text>
            </View>
          </View>
          <View
            style={[
              styles.box,
              {height: 0.25 * height, flexDirection: 'column'},
            ]}>
            <View style={styles.boxHeader}>
              <Icon name="tools" size={20} />
              <Text style={styles.tittleText}>Dịch vụ sửa chữa</Text>
              <Text style={styles.editText}>13:05 - 20/05/2022</Text>
            </View>
            <View style={styles.boxBody}>
              <Image
                source={require('../../../assets/images/login_register_bg/bg.png')}
                style={{
                  height: '70%',
                  width: '25%',
                  alignSelf: 'center',
                  borderRadius: 10,
                  marginLeft: 15,
                }}
              />
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={styles.boxBodyContent}>
                  <Text style={[styles.textBold, {fontSize: 24}]}>
                    Lò nướng
                  </Text>
                  <Text style={{fontSize: 16, color: 'black'}}>
                    Phí dịch vụ kiểm tra
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingRight: 20,
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textBold}>200,000 vnđ</Text>
                    <TouchableOpacity style={styles.viewServiceButton}>
                      <Text style={styles.textBold}>Xem giá dịch vụ</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.serviceRow}>
              <Text style={styles.textBold}>TỔNG THANH TOÁN(dự kiến)</Text>
              <Text style={styles.servicePrice}>200,000 vnđ</Text>
            </View>
          </View>
        </ScrollView>
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
    borderBottomWidth: 0.7,
    borderBottomColor: '#CACACA',
    width: '100%',
  },
  box: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
  },
  boxHeader: {flexDirection: 'row', flex: 2, alignItems: 'flex-end'},
  tittleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginLeft: 15,
  },
  editText: {
    marginLeft: 'auto',
  },

  boxBody: {
    flex: 8,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CACACA',
  },
  boxBodyContent: {
    marginLeft: 20,
    height: '70%',
    width: '100%',
    paddingBottom: 5,
    justifyContent: 'space-between',
  },
  viewServiceButton: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 15,
    backgroundColor: '#FEC54B',
    marginLeft: 'auto',
  },
  textBold: {
    fontWeight: 'bold',
    color: 'black',
  },
  serviceRow: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 5,
  },
  servicePrice: {
    marginLeft: 'auto',
    color: '#E67F1E',
  },
});

export default OrderHistoryScreen;
