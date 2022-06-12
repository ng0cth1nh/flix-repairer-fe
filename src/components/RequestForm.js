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
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {height} = Dimensions.get('window');
import CustomDatePicker from './CustomDatePicker';
import Button from './SubmitButton';
import moment from 'moment';

const RequestForm = function ({
  buttonText,
  buttonClicked,
  date,
  setDate,
  description,
  setDiscription,
  editable,
  isOrderIdVisible = false,
}) {
  const [dateVisible, setDateVisible] = useState(false);
  const handlerDateConfirm = selectedDate => {
    setDate(moment(selectedDate));
    setDateVisible(false);
  };
  const hideDatePicker = () => {
    setDateVisible(false);
  };
  return (
    <ScrollView style={{marginLeft: 20, marginRight: 20}}>
      <View
        style={[styles.box, {height: 0.25 * height, flexDirection: 'column'}]}>
        <View style={styles.boxHeader}>
          <Icon name="tools" size={20} style={{marginBottom: 3}} />
          <Text style={styles.tittleText}>Dịch vụ sửa chữa</Text>
          {editable && (
            <TouchableOpacity style={styles.editTouch}>
              <Text style={styles.editText}>Thay đổi</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.boxBody}>
          <Image
            source={require('../../assets/images/login_register_bg/bg.png')}
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
              <Text style={[styles.textBold, {fontSize: 24}]}>Lò nướng</Text>
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
          {editable && (
            <TouchableOpacity style={styles.editTouch}>
              <Text style={styles.editText}>Thay đổi</Text>
            </TouchableOpacity>
          )}
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
            marginTop: 10,
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            height: 40,
            alignItems: 'flex-end',
            marginBottom: 15,
          }}>
          <MaterialCommunityIcons
            name="ticket-percent-outline"
            size={20}
            style={{marginBottom: 3}}
          />
          <Text style={styles.tittleText}>Flix voucher</Text>
          {editable && (
            <TouchableOpacity style={styles.editTouch}>
              <Text style={styles.editText}>Chọn hoặc nhập mã</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={{marginLeft: 40, color: '#12B76A', fontWeight: 'bold'}}>
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
      </View>
      <View
        style={[
          styles.box,
          {height: 0.15 * height, flexDirection: 'column', marginTop: 10},
        ]}>
        <View style={styles.boxHeader}>
          <Ionicons name="wallet-outline" size={20} style={{marginBottom: 3}} />
          <Text style={styles.tittleText}>Phương thức thanh toán</Text>
          {editable && (
            <TouchableOpacity style={styles.editTouch}>
              <Text style={styles.editText}>Thay đổi</Text>
            </TouchableOpacity>
          )}
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
      </View>
      {isOrderIdVisible && (
        <View
          style={[
            styles.box,
            {height: 0.1 * height, flexDirection: 'column', marginTop: 10},
          ]}>
          <View style={styles.boxHeader}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              style={{marginBottom: 3}}
            />
            <Text style={styles.tittleText}>Mã yêu cầu</Text>
            <Text
              style={{color: '#FEC54B', marginLeft: 'auto', marginBottom: 3}}>
              FASG1212342
            </Text>
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
            <Text style={{marginLeft: 'auto'}}>13:05 - 20/05/2022</Text>
          </View>
        </View>
      )}
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
        onPress={buttonClicked}
        buttonText={buttonText}
      />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
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
  editTouch: {
    marginLeft: 'auto',
  },
  editText: {
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
});

export default RequestForm;
