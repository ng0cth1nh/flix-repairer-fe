import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {height} = Dimensions.get('window');
import moment from 'moment';

import BackButton from '../../components/BackButton';
import CustomDatePicker from '../../components/CustomDatePicker';
import Button from '../../components/Button';

const OrderScreen = ({navigation}) => {
  const [date, setDate] = useState(moment());
  const [dateVisible, setDateVisible] = useState(false);
  const [description, setDiscription] = useState('');
  const handlerDateConfirm = selectedDate => {
    setDate(moment(selectedDate));
    setDateVisible(false);
  };
  const hideDatePicker = () => {
    setDateVisible(false);
  };
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <BackButton onPressHandler={navigation.goBack} color="black" />
      <SafeAreaView style={{flex: 1}}>
        <Text style={styles.headerText}>Đặt lịch</Text>
        <ScrollView style={{marginLeft: 20, marginRight: 20}}>
          <View
            style={[
              styles.box,
              {height: 0.25 * height, flexDirection: 'column'},
            ]}>
            <View style={styles.boxHeader}>
              <Icon name="tools" size={20} style={{marginBottom: 3}} />
              <Text style={styles.tittleText}>Dịch vụ sửa chữa</Text>
              <Text style={styles.editText}>Thay đổi</Text>
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
          </View>
          <View
            style={[
              styles.box,
              {height: 0.2 * height, flexDirection: 'column', marginTop: 10},
            ]}>
            <View style={styles.boxHeader}>
              <Ionicons
                name="location-outline"
                size={20}
                style={{marginBottom: 3}}
              />
              <Text style={styles.tittleText}>Địa chỉ của bạn</Text>
              <Text style={styles.editText}>Thay đổi</Text>
            </View>
            <View style={{flex: 5, marginLeft: 40}}>
              <Text
                style={[
                  styles.textBold,
                  {fontSize: 16, marginBottom: 15, marginTop: 5},
                ]}>
                Nguyễn Văn A - 0912345678
              </Text>
              <Text style={{color: 'black'}}>
                123 Minh Khai, Phường Minh Khai, Quận Hai Bà Trưng, Hà Nội
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.box,
              {height: 0.15 * height, flexDirection: 'column', marginTop: 10},
            ]}>
            <View style={styles.boxHeader}>
              <Ionicons
                name="md-calendar-sharp"
                size={20}
                style={{marginBottom: 3}}
              />
              <Text style={styles.tittleText}>Chọn ngày muốn sửa</Text>
            </View>
            <View style={{flex: 4, marginLeft: 40, marginTop: 10}}>
              <TouchableOpacity
                style={styles.datePicker}
                onPress={() => setDateVisible(true)}>
                <Text style={styles.textBold}>{date.format('DD/MM/YYYY')}</Text>
                <Ionicons
                  name="chevron-down-sharp"
                  size={20}
                  style={{marginBottom: 3, color: 'black', marginLeft: 'auto'}}
                />
                <CustomDatePicker
                  isVisible={dateVisible}
                  handleConfirm={handlerDateConfirm}
                  hideDatePicker={hideDatePicker}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[
              styles.box,
              {height: 0.2 * height, flexDirection: 'column', marginTop: 10},
            ]}>
            <View style={styles.boxHeader}>
              <Ionicons
                name="document-text-outline"
                size={20}
                style={{marginBottom: 3}}
              />
              <Text style={styles.tittleText}>Tình trạng</Text>
            </View>
            <View style={{flex: 4, marginLeft: 40, marginTop: 10}}>
              <TextInput
                multiline
                numberOfLines={2}
                onChangeText={text => setDiscription(text)}
                value={description}
                style={{
                  padding: 5,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  height: '80%',
                }}
                editable
                placeholder="Nhập tình trạng của thiết bị"
              />
            </View>
          </View>
          <View
            style={[
              styles.box,
              {
                height: 0.08 * height,
                flexDirection: 'row',
                marginTop: 10,
                alignItems: 'center',
              },
            ]}>
            <MaterialCommunityIcons
              name="ticket-percent-outline"
              size={20}
              style={{marginBottom: 3}}
            />
            <Text style={styles.tittleText}>Flix voucher</Text>
            <Text style={styles.editText}>Chọn hoặc nhập mã</Text>
          </View>
          <View
            style={[
              styles.box,
              {height: 0.15 * height, flexDirection: 'column', marginTop: 10},
            ]}>
            <View style={styles.boxHeader}>
              <Ionicons
                name="wallet-outline"
                size={20}
                style={{marginBottom: 3}}
              />
              <Text style={styles.tittleText}>Phương thức thanh toán</Text>
              <Text style={styles.editText}>Thay đổi</Text>
            </View>
            <View
              style={{
                flex: 3,
                marginLeft: 40,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <RadioButton value="Tiền mặt" status="checked" color="#FFBC00" />
              <Text style={{color: 'black', fontSize: 16}}>Tiền mặt</Text>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 10,
              paddingBottom: 40,
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
            <View style={styles.serviceRow}>
              <Text style={styles.textBold}>TỔNG THANH TOÁN(dự kiến)</Text>
              <Text style={styles.servicePrice}>200,000 vnđ</Text>
            </View>
          </View>
          <Button
            style={{marginTop: 10, marginBottom: 40}}
            onPress={navigation.goBack}
            buttonText="ĐẶT LỊCH"
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
    textAlign: 'center',
    color: 'black',
    marginTop: getStatusBarHeight(),
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CACACA',
    width: '100%',
    marginBottom: 10,
  },
  box: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  boxHeader: {flexDirection: 'row', flex: 2, alignItems: 'flex-end'},
  tittleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginLeft: 20,
    marginBottom: 3,
  },
  editText: {
    marginLeft: 'auto',
    color: '#FEC54B',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  boxBody: {flex: 8, flexDirection: 'row'},
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
  },
  confirmButton: {
    marginTop: 10,
    height: 0.075 * height,
    borderRadius: 30,
    backgroundColor: '#FEC54B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default OrderScreen;
