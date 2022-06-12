import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TextInput,
  ScrollView,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Button from './SubmitButton';
import BackButton from './BackButton';

const CreateAddressForm = ({navigation, cityId, setCityId, isAddAddress}) => {
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <BackButton onPressHandler={navigation.goBack} color="black" />
      <SafeAreaView>
        <ScrollView style={{marginLeft: 20, marginRight: 20}}>
          <Text style={styles.headerText}>
            {isAddAddress ? 'Thêm địa chỉ' : 'Sửa địa chỉ'}
          </Text>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#CACACA',
              paddingBottom: 10,
            }}>
            <View
              style={[
                styles.box,
                {height: 'auto', flexDirection: 'column', marginTop: 10},
              ]}>
              <View style={styles.boxHeader}>
                <Icon name="user-o" size={25} />
                <Text style={styles.tittleText}>Thông tin khách hàng</Text>
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Họ và tên</Text>
                <View style={styles.valueSpace}>
                  <TextInput
                    style={styles.valueText}
                    placeholder="Nhập họ và tên"
                  />
                </View>
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Số điện thoại liên lạc</Text>
                <View style={styles.valueSpace}>
                  <TextInput
                    style={styles.valueText}
                    placeholder="Nhập số điện thoại"
                  />
                </View>
              </View>
            </View>
            <View
              style={[
                styles.box,
                {height: 'auto', flexDirection: 'column', marginTop: 10},
              ]}>
              <View style={styles.boxHeader}>
                <Ionicons name="location-outline" size={25} />
                <Text style={styles.tittleText}>Địa chỉ</Text>
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Tỉnh/Thành Phố</Text>
                <View style={styles.valueSpace}>
                  <RNPickerSelect
                    value={cityId}
                    fixAndroidTouchableBug={true}
                    onValueChange={value => setCityId(value)}
                    placeholder={{
                      label: 'Tỉnh/Thành Phố',
                      value: null,
                    }}
                    useNativeAndroidPickerStyle={false}
                    style={styles.pickerStyle}
                    items={[{label: 'Phú Thọ', value: 'thang'}]}
                    Icon={() => (
                      <Icon
                        name="caret-down"
                        size={20}
                        style={{marginTop: 10}}
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Quận/Huyện</Text>
                <View style={styles.valueSpace}>
                  <RNPickerSelect
                    value={cityId}
                    fixAndroidTouchableBug={true}
                    onValueChange={value => setCityId(value)}
                    placeholder={{
                      label: 'Quận/Huyện',
                      value: null,
                    }}
                    useNativeAndroidPickerStyle={false}
                    style={styles.pickerStyle}
                    items={[{label: 'Phú Thọ', value: 'thang'}]}
                    Icon={() => (
                      <Icon
                        name="caret-down"
                        size={20}
                        style={{marginTop: 10}}
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Phường/Xã</Text>
                <View style={styles.valueSpace}>
                  <RNPickerSelect
                    value={cityId}
                    fixAndroidTouchableBug={true}
                    onValueChange={value => setCityId(value)}
                    placeholder={{
                      label: 'Phường/Xã',
                      value: null,
                    }}
                    useNativeAndroidPickerStyle={false}
                    style={styles.pickerStyle}
                    items={[{label: 'Phú Thọ', value: 'thang'}]}
                    Icon={() => (
                      <Icon
                        name="caret-down"
                        size={20}
                        style={{marginTop: 10}}
                      />
                    )}
                  />
                </View>
              </View>

              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Địa chỉ chi tiết</Text>
                <View style={styles.valueSpace}>
                  <TextInput style={styles.valueText} />
                </View>
              </View>
            </View>
          </View>
          <Button
            style={{marginTop: 20, marginBottom: 40}}
            onPress={() => {
              console.log('handle clicked');
            }}
            buttonText={isAddAddress ? 'THÊM ĐỊA CHỈ' : 'LƯU LẠI'}
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
  boxHeader: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  tittleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginLeft: 15,
  },
  inputField: {marginBottom: 12},
  inputLabel: {
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  valueSpace: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  valueText: {
    fontSize: 16,
    color: 'black',
  },
  pickerStyle: {
    inputIOS: {
      fontSize: 16,
      color: 'black',
    },
    inputAndroid: {
      fontSize: 16,
      color: 'black',
    },
  },
});

export default CreateAddressForm;
