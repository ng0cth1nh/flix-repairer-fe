import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import moment from 'moment';
import {RadioButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import BackButton from '../../components/BackButton';
import Button from '../../components/SubmitButton';

const {height} = Dimensions.get('window');
const listId = [{id: 1}, {id: 2}, {id: 3}];
const InvoiceScreen = ({navigation}) => {
  const date = moment();
  const renderServiceItem = ({item}) => {
    return (
      <View style={[styles.serviceRow, {paddingHorizontal: 10}]}>
        <Text style={styles.serviceName}>Phí dịch vụ kiểm tra</Text>
        <Text style={[styles.textBold, {marginLeft: 'auto', fontSize: 12}]}>
          200,000 vnđ
        </Text>
      </View>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <BackButton onPressHandler={navigation.goBack} color="black" />
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            borderBottomWidth: 1,
            borderBottomColor: '#CACACA',
            paddingRight: 20,
          }}>
          <View style={{flex: 1, marginLeft: 20}}>
            <Text style={styles.headerText}>Xem hóa đơn</Text>
          </View>
        </View>
        <ScrollView style={{marginHorizontal: 20}}>
          <View style={[styles.box, {minHeight: 0.25 * height}]}>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#CACACA',
                paddingBottom: 10,
              }}>
              <View style={styles.boxHeader}>
                <FontAwesome
                  name="user-o"
                  size={20}
                  style={{marginBottom: 3}}
                />
                <Text style={styles.tittleText}>Khách hàng</Text>
              </View>
              <View style={styles.boxBody}>
                <Image
                  source={require('../../../assets/images/login_register_bg/bg.png')}
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
                      Nguyễn Văn Anh - 0812378899
                    </Text>
                    <Text style={{color: 'black', marginBottom: 5}}>
                      123 Minh Khai, Phường Minh Khai, Quận Hai Bà Trưng, Hà Nội
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.boxHeader}>
                <Image
                  source={require('../../../assets/images/type/repairman.png')}
                  style={{
                    width: 25,
                    aspectRatio: 1,
                    marginBottom: 3,
                  }}
                />
                <Text style={[styles.tittleText, {marginLeft: 12}]}>
                  Thợ sửa chữa
                </Text>
              </View>
              <View style={styles.boxBody}>
                <Image
                  source={require('../../../assets/images/login_register_bg/bg.png')}
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
                      Nguyễn Văn Anh - 0812378899
                    </Text>
                    <Text style={{color: 'black', marginBottom: 5}}>
                      123 Minh Khai, Phường Minh Khai, Quận Hai Bà Trưng, Hà Nội
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.boxHeader}>
                <Icon name="tools" size={20} style={{marginBottom: 3}} />
                <Text style={styles.tittleText}>Dịch vụ sửa chữa</Text>
              </View>
              <View style={styles.boxBody}>
                <Image
                  source={require('../../../assets/images/login_register_bg/bg.png')}
                  style={{
                    width: '25%',
                    aspectRatio: 0.9,
                    alignSelf: 'center',
                    borderRadius: 10,
                    marginLeft: 15,
                  }}
                />
                <View style={{justifyContent: 'space-between', marginLeft: 20}}>
                  <Text style={[styles.textBold, {fontSize: 24}]}>
                    Lò nướng
                  </Text>
                  <TouchableOpacity style={styles.viewServiceButton}>
                    <Text style={styles.textBold}>Xem giá dịch vụ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{marginTop: 15}}>
              <Text style={[styles.textBold, {fontSize: 18}]}>
                Dịch vụ đã sửa chi tiết
              </Text>
              <FlatList
                data={listId}
                renderItem={renderServiceItem}
                keyExtractor={item => item.id}
              />
              <View style={[styles.serviceRow, {marginLeft: 10}]}>
                <Text style={styles.textBold}>Tổng</Text>
                <Text style={styles.servicePrice}>200,000 vnđ</Text>
              </View>
            </View>
            <View style={{marginTop: 15}}>
              <Text style={[styles.textBold, {fontSize: 18}]}>
                Dịch vụ đã sửa chi tiết
              </Text>
              <FlatList
                data={listId}
                renderItem={renderServiceItem}
                keyExtractor={item => item.id}
              />
              <View style={[styles.serviceRow, {marginLeft: 10}]}>
                <Text style={styles.textBold}>Tổng</Text>
                <Text style={[styles.servicePrice, {fontWeight: 'bold'}]}>
                  200,000 vnđ
                </Text>
              </View>
            </View>
            <View style={styles.boxHeader}>
              <Ionicons
                name="md-calendar-sharp"
                size={20}
                style={{marginBottom: 3}}
              />
              <Text style={styles.tittleText}>Ngày bắt đầu sửa</Text>
            </View>
            <View style={{flex: 4, marginLeft: 40, marginVertical: 10}}>
              <View style={styles.datePicker}>
                <Text style={styles.textBold}>{date.format('DD/MM/YYYY')}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                // height: 40,
                alignItems: 'flex-end',
              }}>
              <MaterialCommunityIcons
                name="ticket-percent-outline"
                size={20}
                style={{marginBottom: 3}}
              />
              <Text style={styles.tittleText}>Flix voucher</Text>
            </View>
            <Text
              style={{
                marginLeft: 40,
                color: '#12B76A',
                fontWeight: 'bold',
                marginTop: 10,
              }}>
              Giảm 10%
            </Text>
            <View
              style={{
                flex: 3,
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginVertical: 5,
              }}>
              <RadioButton value="Tiền mặt" status="checked" color="#FFBC00" />
              <Text style={{color: 'black', fontSize: 16, width: '80%'}}>
                Mã giảm giá áp dụng cho tất cả các shop ở Hà Nội
              </Text>
            </View>
            <View style={styles.boxHeader}>
              <Ionicons
                name="wallet-outline"
                size={20}
                style={{marginBottom: 3}}
              />
              <Text style={styles.tittleText}>Phương thức thanh toán</Text>
            </View>
            <View
              style={{
                flex: 3,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <RadioButton value="Tiền mặt" status="checked" color="#FFBC00" />
              <Text style={{color: 'black', fontSize: 16}}>Tiền mặt</Text>
            </View>
            <View style={styles.boxHeader}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                style={{marginBottom: 3}}
              />
              <Text style={styles.tittleText}>Mã yêu cầu</Text>
              <Text
                style={{
                  color: '#FEC54B',
                  marginLeft: 'auto',
                  marginBottom: 3,
                }}>
                FASG1212342
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <Text style={{color: 'black', fontSize: 16, marginLeft: 40}}>
                Thời gian tạo
              </Text>
              <Text style={{marginLeft: 'auto'}}>13:05 - 20/05/2022</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{color: 'black', fontSize: 16, marginLeft: 40}}>
                Thời gian xác nhận
              </Text>
              <Text style={{marginLeft: 'auto'}}>13:05 - 20/05/2022</Text>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 10,
              paddingBottom: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#CACACA',
            }}>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceName}>Phí dịch vụ kiểm tra</Text>
              <Text style={styles.servicePrice}>200,000 vnđ</Text>
            </View>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceName}>Phí dịch vụ kiểm tra</Text>
              <Text style={styles.servicePrice}>200,000 vnđ</Text>
            </View>
          </View>
          <View style={{paddingHorizontal: 10}}>
            <View style={styles.serviceRow}>
              <Text style={styles.textBold}>Tổng</Text>
              <Text style={styles.servicePrice}>200,000 vnđ</Text>
            </View>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceName}>Phí dịch vụ kiểm tra</Text>
              <Text style={styles.servicePrice}>200,000 vnđ</Text>
            </View>
            <View style={styles.serviceRow}>
              <Text style={styles.textBold}>TỔNG THANH TOÁN</Text>
              <Text style={styles.servicePrice}>200,000 vnđ</Text>
            </View>
          </View>
          <Button
            style={{marginTop: 20, marginBottom: 40}}
            onPress={() => {}}
            buttonText="Xác nhận đã thanh toán"
          />
        </ScrollView>
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
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
  },
  boxHeader: {flexDirection: 'row', height: 40, alignItems: 'flex-end'},
  tittleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginLeft: 20,
    marginBottom: 3,
  },
  editTouch: {
    marginLeft: 'auto',
  },
  editText: {
    color: '#FEC54B',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  boxBody: {flex: 1, flexDirection: 'row', marginTop: 10},
  boxBodyContent: {
    marginLeft: 15,
    width: '100%',
    paddingBottom: 10,
    paddingRight: 5,
    justifyContent: 'space-between',
  },
  viewServiceButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#FEC54B',
    flexWrap: 'wrap',
  },
  textBold: {
    fontWeight: 'bold',
    color: 'black',
  },
  datePicker: {
    flexDirection: 'row',
    width: '50%',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  serviceRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  serviceName: {
    color: 'black',
  },
  servicePrice: {
    marginLeft: 'auto',
    color: '#E67F1E',
    fontWeight: 'bold',
  },
});

export default InvoiceScreen;
