import React, {useState} from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

import RequestItem from '../../components/RequestItem';
import CustomModal from '../../components/CustomModal';
import CustomDatePicker from '../../components/CustomDatePicker';
import Button from '../../components/SubmitButton';
import moment from 'moment';
const {height} = Dimensions.get('window');

const listId = [{id: 1}, {id: 2}];
const ScreenA = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);
  const [date, setDate] = useState(moment());
  const handlerDateConfirm = selectedDate => {
    setDate(moment(selectedDate));
    setDateVisible(false);
  };
  const hideDatePicker = () => {
    setDateVisible(false);
  };
  const handleRequestPress = () => {
    setModalVisible(true);
  };
  const confirmHandle = () => {
    //  handle here
  };
  return (
    <>
      <View
        style={[
          {flex: 1, backgroundColor: 'white'},
          modalVisible ? {opacity: 0.3} : {},
        ]}>
        <FlatList
          style={{marginHorizontal: 15, paddingTop: 10}}
          data={listId}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return <RequestItem handlePress={handleRequestPress} />;
          }}
        />
      </View>
      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalRatio={0.6}>
        <Text style={styles.modalText}>Thông tin cần xác nhận</Text>
        <View
          style={[
            styles.box,
            {height: 0.15 * height, flexDirection: 'column'},
          ]}>
          <View style={styles.boxHeader}>
            <Ionicons
              name="md-calendar-sharp"
              size={20}
              style={{marginBottom: 3}}
            />
            <Text style={styles.tittleText}>Ngày bắt đầu sửa</Text>
          </View>
          <View style={{marginLeft: 40, marginTop: 10}}>
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => setDateVisible(true)}>
              <Text style={styles.textBold}>
                {date.format('HH:mm - DD/MM/YYYY')}
              </Text>
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
            {height: 0.15 * height, flexDirection: 'column'},
          ]}>
          <View style={styles.boxHeader}>
            <Feather name="clock" size={20} style={{marginBottom: 3}} />
            <Text style={styles.tittleText}>Số ngày cần sửa tối đa</Text>
          </View>
          <View style={{marginLeft: 40, marginTop: 10}}>
            <TextInput
              keyboardType="numeric"
              placeholder="Nhập số ngày"
              style={{
                backgroundColor: 'white',
                height: 40,
                width: '60%',
                borderRadius: 10,
                textAlign: 'center',
              }}
            />
          </View>
        </View>
        <Button
          style={{marginTop: 10, width: '90%'}}
          onPress={confirmHandle}
          buttonText="CẬP NHẬT"
        />
      </CustomModal>
    </>
  );
};
const styles = StyleSheet.create({
  modalText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  box: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
    width: '100%',
  },
  boxHeader: {flexDirection: 'row', height: 40, alignItems: 'flex-end'},
  tittleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginLeft: 20,
    marginBottom: 3,
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
export default ScreenA;
