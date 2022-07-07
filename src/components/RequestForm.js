import React, {useState} from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import SubmitButton from '../components/SubmitButton';
import {numberWithCommas} from '../utils/util';
const {height} = Dimensions.get('window');
import CustomDatePicker from './CustomDatePicker';
import Button from './SubmitButton';
import moment from 'moment';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native-safe-area-context';

const RequestForm = function ({
  submitButtonText,
  buttonClicked,
  date,
  setDate,
  data,
  description,
  setDiscription,
  isShowCancelButton,
  handlerCancel,
  isAddableDetailService,
  handlerSubmitButtonClick,
  handlerAddDetailServiceButtonClick,
  isRequestIdVisible = false,
}) {
  const [dateVisible, setDateVisible] = useState(false);
  const handlerDateConfirm = selectedDate => {
    setDate(moment(selectedDate));
    setDateVisible(false);
  };
  const hideDatePicker = () => {
    setDateVisible(false);
  };

  const copyToClipboard = () => {
    Clipboard.setString(data.requestCode);
    Toast.show({
      type: 'customToast',
      text1: 'Đã sao chép vào khay nhớ tạm',
    });
  };

  return (
    <SafeAreaView style={{flex: 1, marginHorizontal: '4%'}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.box, {marginTop: 12}]}>
          <View style={styles.boxHeader}>
            <Image
              source={require('../../assets/images/type/user.png')}
              style={{
                height: 18,
                width: 18,
              }}
            />
            <Text style={styles.tittleText}>Khách hàng</Text>
          </View>
          <View style={styles.boxBody}>
            <Image
              source={{uri: data.avatar}}
              style={{
                height: height * 0.12,
                width: height * 0.111,
                borderRadius: 10,
                alignSelf: 'center',
                marginHorizontal: '2%',
              }}
            />
            <View style={{flex: 1, justifyContent: 'center'}}>
              <View style={styles.boxBodyContent}>
                <Text style={[styles.textBold, {fontSize: 16}]}>
                  {data.customerName}
                </Text>
                <Text style={[styles.textBold, {fontSize: 16}]}>
                  {data.customerPhone}
                </Text>
                <Text style={{color: 'black', marginBottom: 5}}>
                  {data.customerAddress}
                </Text>
                <TouchableOpacity
                  style={[styles.viewServiceButton, {width: '60%'}]}>
                  <Text style={[styles.textBold, {textAlign: 'center'}]}>
                    Nhắn tin với khách
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.box, {flexDirection: 'column'}]}>
          <View style={styles.boxHeader}>
            <Image
              source={require('../../assets/images/type/support.png')}
              style={{
                height: 18,
                width: 18,
              }}
            />
            <Text style={styles.tittleText}>Dịch vụ sửa chữa</Text>
            {isAddableDetailService && (
              <TouchableOpacity
                style={styles.editTouch}
                onPress={handlerAddDetailServiceButtonClick}>
                <Text style={styles.editText}>Thêm</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.boxBody}>
            <Image
              source={{uri: data.serviceImage}}
              style={{
                height: height * 0.12,
                width: height * 0.111,
                borderRadius: 10,
                alignSelf: 'center',
                marginHorizontal: '2%',
              }}
            />
            <View style={styles.boxBodyContent}>
              <Text style={[styles.textBold, {fontSize: 24}]}>
                {data.serviceName}
              </Text>
              <Text style={{fontSize: 16, color: 'black', marginVertical: 6}}>
                Phí dịch vụ kiểm tra
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.textBold}>{`${numberWithCommas(
                  data.price,
                )} vnđ`}</Text>
                <TouchableOpacity style={styles.viewServiceButton}>
                  <Text style={styles.textBold}>Xem giá dịch vụ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.box,
            {height: 0.15 * height, flexDirection: 'column'},
          ]}>
          <View style={styles.boxHeader}>
            <Image
              source={require('../../assets/images/type/calendar.png')}
              style={{
                height: 18,
                width: 18,
              }}
            />
            <Text style={styles.tittleText}>Ngày muốn sửa</Text>
          </View>
          <View style={{flex: 4, marginLeft: 40}}>
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => setDateVisible(true)}>
              <Text style={styles.textBold}>
                {moment(data.expectFixingTime).format('HH:mm - DD/MM/YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[styles.box, {height: 0.2 * height, flexDirection: 'column'}]}>
          <View style={styles.boxHeader}>
            <Image
              source={require('../../assets/images/type/writing.png')}
              style={{
                height: 20,
                width: 20,
              }}
            />
            <Text style={styles.tittleText}>Tình trạng</Text>
          </View>
          <View style={{flex: 4, marginLeft: 40, marginTop: 10}}>
            <TextInput
              multiline
              numberOfLines={2}
              value={data.requestDescription}
              style={{
                padding: 5,
                backgroundColor: 'white',
                borderRadius: 10,
                height: '80%',
                color: 'black',
              }}
              editable={false}
            />
          </View>
        </View>
        <View style={[styles.box]}>
          <View style={styles.boxHeader}>
            <Image
              source={require('../../assets/images/type/coupon.png')}
              style={{
                height: 20,
                width: 20,
              }}
            />
            <Text style={styles.tittleText}>Flix voucher</Text>
          </View>
          {/* <Text style={{marginLeft: 40, color: '#12B76A', fontWeight: 'bold'}}>
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
        </View> */}
        </View>
        <View
          style={[
            styles.box,
            {height: 0.15 * height, flexDirection: 'column'},
          ]}>
          <View style={styles.boxHeader}>
            <Image
              source={require('../../assets/images/type/wallet.png')}
              style={{
                height: 22,
                width: 22,
              }}
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
            <Text style={{color: 'black', fontSize: 16}}>
              {data.paymentMethod === 'CASH' ? 'Tiền mặt' : data.paymentMethod}
            </Text>
          </View>
        </View>
        {isRequestIdVisible && (
          <View
            style={[
              styles.box,
              {
                flexDirection: 'column',
              },
            ]}>
            <View style={styles.boxHeader}>
              <Image
                source={require('../../assets/images/type/info.png')}
                style={{
                  height: 22,
                  width: 22,
                }}
              />
              <Text style={styles.tittleText}>Mã yêu cầu</Text>
              <TouchableOpacity
                style={{marginLeft: 'auto', marginBottom: 3}}
                onPress={copyToClipboard}>
                <Text
                  style={{color: '#FEC54B', fontSize: 16, fontWeight: 'bold'}}>
                  {data.requestCode}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 3,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{color: 'black', fontSize: 16, marginLeft: 40}}>
                Thời gian
              </Text>
              <Text style={{marginLeft: 'auto'}}>
                {moment(data.date).format('HH:mm - DD/MM/YYYY')}
              </Text>
            </View>
          </View>
        )}
        <View
          style={{
            paddingHorizontal: 10,
            paddingBottom: 20,
          }}>
          <View style={styles.serviceRow}>
            <Text style={styles.serviceName}>Phí dịch vụ kiểm tra</Text>
            <Text style={styles.servicePrice}>{`${numberWithCommas(
              data.price,
            )} vnđ`}</Text>
          </View>

          <View style={styles.serviceRow}>
            <Text style={styles.serviceName}>Thuế VAT(5%)</Text>
            <Text style={styles.servicePrice}>
              {`${numberWithCommas(data.vatPrice)} vnđ`}
            </Text>
          </View>

          {/* {service.actualPrice !== null ? (
          <View style={styles.serviceRow}>
            <Text style={styles.serviceName}>TỔNG THANH TOÁN(dự kiến)</Text>
            <Text style={styles.servicePrice}>{`${numberWithCommas(
              service.actualPrice,
            )} vnđ`}</Text>
          </View>
        ) : null} */}
          <View style={styles.serviceRow}>
            <Text style={styles.textBold}>TỔNG THANH TOÁN (dự kiến)</Text>
            <Text style={styles.servicePrice}>
              {`${numberWithCommas(data.actualPrice)} vnđ`}
            </Text>
          </View>
        </View>
        {isShowCancelButton ? (
          <Button
            style={{marginVertical: 10, height: 40}}
            onPress={handlerCancel}
            buttonText="Hủy yêu cầu"
          />
        ) : null}
      </ScrollView>
      <SubmitButton
        style={{
          marginVertical: 8,
          width: '100%',
          alignSelf: 'center',
        }}
        onPress={handlerSubmitButtonClick}
        buttonText={submitButtonText}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  box: {
    height: 'auto',
    backgroundColor: '#F0F0F0',
    borderRadius: 18,
    paddingHorizontal: '4%',
    paddingVertical: 14,
    marginVertical: 6,
  },
  boxHeader: {
    flexDirection: 'row',
    flex: 2,
    alignItems: 'center',
  },
  tittleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
    marginBottom: 3,
  },
  editTouch: {
    marginLeft: 'auto',
  },
  editText: {
    color: '#FEC54B',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 12,
  },
  boxBody: {
    flex: 8,
    flexDirection: 'row',
    marginVertical: 1,
  },
  boxBodyContent: {
    flex: 1,
    marginLeft: 10,
    height: '70%',
    width: '100%',
    paddingBottom: 5,
    justifyContent: 'space-between',
  },
  viewServiceButton: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FEC54B',
  },
  textBold: {
    fontWeight: '700',
    color: 'black',
    fontSize: 14,
    marginRight: 8,
  },
  datePicker: {
    flexDirection: 'row',
    width: '80%',
    height: 40,
    borderRadius: 10,
    marginTop: 10,
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
    fontWeight: '600',
  },
});
export default RequestForm;
