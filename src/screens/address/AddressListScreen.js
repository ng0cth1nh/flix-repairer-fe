import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
const {height} = Dimensions.get('window');
import {RadioButton} from 'react-native-paper';
import Toast from 'react-native-toast-message';

import SubmitButton from '../../components/SubmitButton';
import BackButton from '../../components/BackButton';

const AddressListScreen = ({navigation, cityId, setCityId, isAddAddress}) => {
  const [checked, setChecked] = useState('first');
  const showToast = () => {
    console.log('show toast');
    Toast.show({
      type: 'success',
      text1: 'Flix',
      text2: 'Thay đổi địa chỉ mặc định thành công!',
    });
  };
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView>
        <ScrollView
          style={{
            marginLeft: 20,
            marginRight: 20,
            height: 0.83 * height,
            borderBottomWidth: 1,
            borderBottomColor: '#CACACA',
          }}>
          <Text style={styles.headerText}>Địa chỉ của bạn</Text>
          <View
            style={{
              paddingBottom: 10,
            }}>
            <View style={[styles.box, {height: 'auto', marginTop: 10}]}>
              <View style={styles.boxHeader}>
                <Text style={styles.tittleText}>Nguyễn Văn A</Text>
                <TouchableOpacity style={styles.editTouch}>
                  <Text style={styles.editText}>Thay đổi</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.addressInfo}>
                <RadioButton
                  value="first"
                  status={checked === 'first' ? 'checked' : 'unchecked'}
                  color="#FFBC00"
                  onPress={() => {
                    setChecked('first');
                    showToast();
                  }}
                />
                <View>
                  <Text style={styles.textBold}>0912345678</Text>
                  <Text>
                    123 Minh Khai, Phường Minh Khai, Quận Hai Bà Trưng, Hà Nội
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.box, {height: 'auto', marginTop: 10}]}>
              <View style={styles.boxHeader}>
                <Text style={styles.tittleText}>Nguyễn Văn B</Text>
                <TouchableOpacity style={styles.editTouch}>
                  <Text style={styles.editText}>Thay đổi</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.addressInfo}>
                <RadioButton
                  value="second"
                  status={checked === 'second' ? 'checked' : 'unchecked'}
                  color="#FFBC00"
                  onPress={() => setChecked('second')}
                />
                <View>
                  <Text style={styles.textBold}>0912345678</Text>
                  <Text>
                    123 Minh Khai, Phường Minh Khai, Quận Hai Bà Trưng, Hà Nội
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <SubmitButton
          style={{marginTop: 10, width: '90%', alignSelf: 'center'}}
          onPress={() => {
            console.log('handle clicked');
          }}
          buttonText="THÊM ĐỊA CHỈ"
        />
      </SafeAreaView>
      <BackButton onPressHandler={navigation.goBack} color="black" />
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
    height: 35,
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  tittleText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
    marginLeft: 40,
  },
  editTouch: {
    marginLeft: 'auto',
  },
  editText: {
    color: '#FEC54B',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
    marginBottom: 10,
  },
  textBold: {
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
});

export default AddressListScreen;
