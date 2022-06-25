import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
import {Checkbox, NativeBaseProvider} from 'native-base';

import CustomModal from '../../components/CustomModal';
import CustomDatePicker from '../../components/CustomDatePicker';
import Button from '../../components/SubmitButton';

const {width} = Dimensions.get('window');
const items = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}];
const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonIndex, setButtonIndex] = useState(0);
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
  const handlerToDateConfirm = selectedDate => {
    setToDate(moment(selectedDate));
    setToDateVisible(false);
  };
  const hideToDatePicker = () => {
    setToDateVisible(false);
  };
  const handleSuggestButton = () => {
    setButtonIndex(0);
  };
  const handleInterrestButton = () => {
    setButtonIndex(1);
  };
  const handleFilterClicked = () => {
    setButtonIndex(2);
    setModalVisible(true);
  };
  const renderItem = ({item}) => {
    return (
      <View style={styles.box}>
        <View style={styles.headerBox}>
          <TouchableOpacity
            style={{
              width: 0.1 * width,
              aspectRatio: 1,
              borderRadius: 0.05 * width,
              resizeMode: 'contain',
              overflow: 'hidden',
            }}>
            <Image
              source={require('../../../assets/images/extra_icon/filter.png')}
              resizeMode="cover"
              style={{width: '100%', height: '100%'}}
            />
          </TouchableOpacity>
          <View style={styles.profileView}>
            <Text style={[styles.textBold, {fontSize: 16}]}>Johnny Depp</Text>
            <Text>08:47 - 27/05/2022</Text>
          </View>
          <TouchableOpacity style={styles.viewDetail}>
            <Text style={styles.viewDetailText}>{'Xem chi tiết>'}</Text>
          </TouchableOpacity>
        </View>
        <View style={{width: '100%', overflow: 'hidden'}}>
          <View style={styles.bodyRow}>
            <View style={styles.rowIcon}>
              <Icon name="tools" size={22} style={styles.icon} />
            </View>
            <Text style={[styles.textBold, {fontSize: 18}]}>Điều hòa</Text>
          </View>
          <View style={styles.bodyRow}>
            <View style={styles.rowIcon}>
              <Ionicons
                name="md-calendar-sharp"
                size={22}
                style={styles.icon}
              />
            </View>
            <Text style={styles.textBold}>31/05/2022</Text>
          </View>
          <View style={styles.bodyRow}>
            <View style={styles.rowIcon}>
              <Ionicons
                name="document-text-outline"
                size={22}
                style={styles.icon}
              />
            </View>
            <ScrollView
              style={{
                width: '60%',
                height: 40,
                backgroundColor: 'white',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: 'black',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                }}>
                to popular belief, Lorem Ipsum is not simply random text. It has
                roots in a piece of classical Latin literature from 45 BC,
                making it over 2000 years old. Richard McClintock, a Latin
                professor at Hampden-Sydney College in Virginia, looked up one
                of the more obscure Latin words
              </Text>
            </ScrollView>
          </View>
          <View style={styles.bodyRow}>
            <View style={styles.rowIcon}>
              <Ionicons name="location-outline" size={22} style={styles.icon} />
            </View>
            <Text
              style={{
                fontSize: 16,
                marginRight: 10,
                color: 'black',
                flex: 1,
              }}>
              Phường Minh Khai, Quận Hai Bà Trưng, Hà Nội
            </Text>
          </View>
        </View>
      </View>
    );
  };
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
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#CACACA',
            paddingBottom: 10,
          }}>
          <TouchableOpacity
            style={[
              styles.suggestButton,
              buttonIndex === 0 ? {backgroundColor: '#FEC54B'} : {},
            ]}
            onPress={handleSuggestButton}>
            <Text style={[styles.textBold]}>Gợi ý cho bạn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.suggestButton,
              buttonIndex === 1 ? {backgroundColor: '#FEC54B'} : {},
            ]}
            onPress={handleInterrestButton}>
            <Text style={[styles.textBold]}>Có thể bạn quan tâm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.suggestButton,
              {
                width: '12%',
                resizeMode: 'contain',
              },
              buttonIndex === 2 ? {backgroundColor: '#FEC54B'} : {},
            ]}
            onPress={handleFilterClicked}>
            <Image
              source={require('../../../assets/images/extra_icon/filter.png')}
              resizeMode="cover"
              style={{width: '60%', height: '60%'}}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      </SafeAreaView>
      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalRatio={0.7}
        modalStyle={{padding: 20}}>
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
            <View style={styles.dateForm}>
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
              </View>
            </View>
          </View>
          <Button
            style={{marginTop: 10, marginHorizontal: 10, marginBottom: 20}}
            onPress={() => {}}
            buttonText="ÁP DỤNG"
          />
        </ScrollView>
      </CustomModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: 'white',
    height: '100%',
  },
  box: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    width: '100%',
  },
  headerBox: {
    flexDirection: 'row',
  },
  profileView: {
    marginLeft: 20,
  },
  viewDetail: {
    marginLeft: 'auto',
  },
  viewDetailText: {
    fontWeight: 'bold',
    color: '#FEC54B',
    fontSize: 15,
  },
  bodyRow: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  rowIcon: {width: 0.1 * width, marginRight: 20},
  icon: {marginLeft: 'auto', color: 'black'},
  suggestButton: {
    width: '40%',
    height: 35,
    borderWidth: 2,
    borderColor: '#FEC54B',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBold: {
    fontWeight: 'bold',
    color: 'black',
  },
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

export default HomeScreen;
