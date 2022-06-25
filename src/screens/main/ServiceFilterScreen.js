import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
import {Checkbox, NativeBaseProvider} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
const {width} = Dimensions.get('window');

import CustomDatePicker from '../../components/CustomDatePicker';
import Button from '../../components/SubmitButton';

const items = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}];
export default function ServiceFilterScreen() {
  const [fromDate, setFromDate] = useState(moment());
  const [fromDateVisible, setFromDateVisible] = useState(false);
  const [toDate, setToDate] = useState(moment());
  const [toDateVisible, setToDateVisible] = useState(false);
  const handlerFromDateConfirm = selectedDate => {
    setFromDate(moment(selectedDate));
    setFromDateVisible(false);
  };
  const hideFromDatePicker = () => {
    setFromDateVisible(false);
  };
  //   const handlerToDateConfirm = selectedDate => {
  //     setToDate(moment(selectedDate));
  //     setToDateVisible(false);
  //   };
  //   const hideToDatePicker = () => {
  //     setToDateVisible(false);
  //   };
  const renderService = ({item}) => {
    return (
      <View style={styles.selectedService}>
        <Ionicons name="location-outline" size={22} />
        <Text style={{marginLeft: 5}}>Máy tính abcjsjs</Text>
        <TouchableOpacity style={styles.closeIcon}>
          <Ionicons name="close" size={16} />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={{padding: 20}}>
      <Text style={styles.modalText}>Tùy chỉnh bộ lọc</Text>
      <ScrollView>
        <View style={[styles.box, {minHeight: 0.28 * width}]}>
          <View style={styles.boxHeader}>
            <Icon name="tools" size={25} style={{marginBottom: 3}} />
            <Text style={styles.tittleText}>Dịch vụ sửa chữa</Text>

            <NativeBaseProvider>
              <View style={{marginLeft: 'auto'}}>
                <Checkbox
                  // value={toggleCheckBox}
                  onChange={() => console.log('testing smth')}
                  colorScheme="yellow"
                  _icon={{color: 'black'}}
                />
              </View>
            </NativeBaseProvider>
          </View>

          <FlatList
            data={items}
            keyExtractor={item => item.id}
            renderItem={renderService}
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: 5,
            }}
          />
        </View>
        <View style={styles.box}>
          <View style={styles.boxHeader}>
            <Ionicons
              name="location-outline"
              size={25}
              style={{marginBottom: 3}}
            />
            <Text style={styles.tittleText}>Khu vực muốn sửa</Text>

            <NativeBaseProvider>
              <View style={{marginLeft: 'auto'}}>
                <Checkbox
                  // value={toggleCheckBox}
                  onChange={() => console.log('testing smth')}
                  colorScheme="yellow"
                  _icon={{color: 'black'}}
                />
              </View>
            </NativeBaseProvider>
          </View>
          <View style={styles.valueSpace}>
            <RNPickerSelect
              // value={cityId}
              fixAndroidTouchableBug={true}
              // onValueChange={value => setCityId(value)}
              placeholder={{
                label: 'Tỉnh/Thành Phố',
                value: null,
              }}
              useNativeAndroidPickerStyle={false}
              style={styles.pickerStyle}
              items={[{label: 'Phú Thọ', value: 'thang'}]}
              Icon={() => (
                <Icon name="caret-down" size={20} style={{marginTop: 5}} />
              )}
            />
          </View>
          <View style={styles.valueSpace}>
            <RNPickerSelect
              // value={cityId}
              fixAndroidTouchableBug={true}
              // onValueChange={value => setCityId(value)}
              placeholder={{
                label: 'Quận/Huyện',
                value: null,
              }}
              useNativeAndroidPickerStyle={false}
              style={styles.pickerStyle}
              items={[{label: 'Phú Thọ', value: 'thang'}]}
              Icon={() => (
                <Icon name="caret-down" size={20} style={{marginTop: 5}} />
              )}
            />
          </View>
          <View style={styles.valueSpace}>
            <RNPickerSelect
              // value={cityId}
              fixAndroidTouchableBug={true}
              // onValueChange={value => setCityId(value)}
              placeholder={{
                label: 'Phường/Xã',
                value: null,
              }}
              useNativeAndroidPickerStyle={false}
              style={styles.pickerStyle}
              items={[{label: 'Phú Thọ', value: 'thang'}]}
              Icon={() => (
                <Icon name="caret-down" size={20} style={{marginTop: 5}} />
              )}
            />
          </View>
        </View>
        <View style={styles.box}>
          <View style={styles.boxHeader}>
            <Ionicons
              name="md-calendar-sharp"
              size={20}
              style={{marginBottom: 3}}
            />
            <Text style={styles.tittleText}>Chọn ngày muốn sửa</Text>
            <NativeBaseProvider>
              <View style={{marginLeft: 'auto'}}>
                <Checkbox
                  // value={toggleCheckBox}
                  onChange={() => console.log('testing smth')}
                  colorScheme="yellow"
                  _icon={{color: 'black'}}
                />
              </View>
            </NativeBaseProvider>
          </View>
          <View style={styles.dateForm}>
            <Text style={styles.dateLabel}>Từ ngày</Text>
            <View style={{marginLeft: 40, marginTop: 10}}>
              <TouchableOpacity
                style={styles.datePicker}
                onPress={() => {
                  setFromDateVisible(true);
                }}>
                <Text style={styles.textBold}>
                  {fromDate.format('DD/MM/YYYY')}
                </Text>
                <Ionicons
                  name="chevron-down-sharp"
                  size={20}
                  style={{
                    marginBottom: 3,
                    color: 'black',
                    marginLeft: 'auto',
                  }}
                />
                <CustomDatePicker
                  isVisible={fromDateVisible}
                  handleConfirm={handlerFromDateConfirm}
                  hideDatePicker={hideFromDatePicker}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* <View style={styles.dateForm}>
            <Text style={styles.dateLabel}>Đến ngày</Text>
            <View style={{marginLeft: 40, marginTop: 10}}>
              <TouchableOpacity
                style={styles.datePicker}
                onPress={() => setToDateVisible(true)}>
                <Text style={styles.textBold}>
                  {toDate.format('DD/MM/YYYY')}
                </Text>
                <Ionicons
                  name="chevron-down-sharp"
                  size={20}
                  style={{
                    marginBottom: 3,
                    color: 'black',
                    marginLeft: 'auto',
                  }}
                />
                <CustomDatePicker
                  isVisible={toDateVisible}
                  handleConfirm={handlerToDateConfirm}
                  hideDatePicker={hideToDatePicker}
                />
              </TouchableOpacity>
            </View> */}
          {/* </View> */}
        </View>
        <Button
          style={{marginTop: 10, marginHorizontal: 10, marginBottom: 20}}
          onPress={() => {}}
          buttonText="ÁP DỤNG"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 5,
  },
  boxHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  tittleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginLeft: 20,
    marginBottom: 3,
  },
  selectedService: {
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 10,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#CACACA',
    marginTop: 15,
    marginRight: 15,
  },

  closeIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#FEC54B',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -10,
    right: -10,
  },
  valueSpace: {
    height: 30,
    width: '55%',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginLeft: 40,
    marginBottom: 8,
  },
  pickerStyle: {
    inputIOS: {
      fontSize: 12,
      color: 'black',
    },
    inputAndroid: {
      fontSize: 12,
      color: 'black',
      padding: 3,
    },
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateForm: {
    flexDirection: 'row',
    marginLeft: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabel: {
    color: 'black',
    fontSize: 15,
  },
  datePicker: {
    flexDirection: 'row',
    width: '80%',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
});
