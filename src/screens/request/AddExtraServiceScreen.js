import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import CustomModal from '../../components/CustomModal';

import {getStatusBarHeight} from 'react-native-status-bar-height';
const {height} = Dimensions.get('window');
import TopHeaderComponent from '../../components/TopHeaderComponent';
import Button from '../../components/SubmitButton';
import {formatCurrency, removeCommas} from '../../utils/FormattingCurrency';

export default function AddExtraServiceScreen({route, navigation}) {
  const {item, index, extraService, setExtraServices, setExtraService} =
    route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [price, setPrice] = useState(item ? item.price : null);
  const [name, setName] = useState(item ? item.name : null);
  const [description, setDescription] = useState(
    item ? item.description : null,
  );
  const [insuranceTime, setInsuranceTime] = useState(
    item ? item.insuranceTime : null,
  );

  const handlerSubmitButtonClick = () => {
    if (!price || !name) {
      setModalVisible(true);
    } else {
      let temp = [];
      if (item) {
        for (let i = 0; i < extraService.length; i++) {
          i !== index
            ? temp.push(extraService[i])
            : temp.push({price, description, insuranceTime, name});
        }
      } else {
        temp = [...extraService, {price, description, insuranceTime, name}];
      }

      setExtraService(temp);
      let temp1 = [];
      for (const item1 of temp) {
        temp1.push(
          `${item1.name}[SPACE]${item1.price}[SPACE]${item1.description}[SPACE]${item1.insuranceTime}`,
        );
      }
      setExtraServices(temp1);
      navigation.goBack();
    }
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Thêm dịch vụ bên ngoài"
        isBackButton={true}
        statusBarColor="white"
      />
      <SafeAreaView
        style={{flex: 1, marginHorizontal: '4%', marginVertical: 10}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.box,
              {height: 0.15 * height, flexDirection: 'column'},
            ]}>
            <View style={styles.boxHeader}>
              <Image
                source={require('../../../assets/images/type/support.png')}
                style={{
                  height: 18,
                  width: 18,
                }}
              />
              <Text style={styles.tittleText}>Tên dịch vụ hoặc linh kiện</Text>
            </View>
            <View style={{marginLeft: 40, marginTop: 10}}>
              <TextInput
                style={styles.inputField}
                value={name}
                onChangeText={text => setName(text)}
                placeholder="Nhập tên dịch vụ hoặc linh kiện"
              />
            </View>
          </View>
          <View
            style={[
              styles.box,
              {
                minHeight: 0.15 * height,
                flexDirection: 'column',
                paddingBottom: 10,
              },
            ]}>
            <View style={styles.boxHeader}>
              <Image
                source={require('../../../assets/images/type/writing.png')}
                style={{
                  height: 20,
                  width: 20,
                }}
              />
              <Text style={styles.tittleText}>Mô tả</Text>
            </View>
            <View style={{marginLeft: 40, marginTop: 10}}>
              <TextInput
                multiline
                numberOfLines={2}
                placeholder="Nhập mô tả"
                value={description}
                onChangeText={text => setDescription(text)}
                style={[styles.inputField, {height: 60}]}
              />
            </View>
          </View>
          <View
            style={[
              styles.box,
              {height: 0.15 * height, flexDirection: 'column'},
            ]}>
            <View style={styles.boxHeader}>
              <Image
                source={require('../../../assets/images/type/wallet.png')}
                style={{
                  height: 22,
                  width: 22,
                }}
              />
              <Text style={styles.tittleText}>Giá thành</Text>
            </View>
            <View style={{marginLeft: 40, marginTop: 10}}>
              <View
                style={[
                  styles.inputField,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '46%',
                  },
                ]}>
                <TextInput
                  keyboardType="numeric"
                  value={price}
                  onChangeText={newPrice => setPrice(formatCurrency(newPrice))}
                  style={{flex: 1, marginRight: 5}}
                />
                <Text style={styles.textBold}>vnđ</Text>
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
                source={require('../../../assets/images/type/calendar.png')}
                style={{
                  height: 20,
                  width: 20,
                }}
              />
              <Text style={styles.tittleText}>Thời gian bảo hành</Text>
            </View>
            <View style={{marginLeft: 40, marginTop: 10}}>
              <View
                style={[
                  styles.inputField,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '30%',
                  },
                ]}>
                <TextInput
                  keyboardType="numeric"
                  value={insuranceTime}
                  onChangeText={text => setInsuranceTime(text)}
                  style={{flex: 1, marginRight: 5}}
                />
                <Text style={styles.textBold}>tháng</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <Button
          style={{
            marginVertical: 8,
            width: '100%',
            alignSelf: 'center',
          }}
          onPress={handlerSubmitButtonClick}
          buttonText="THÊM"
        />
        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          modalRatio={0.3}>
          <Text style={styles.modalText}>Lưu ý</Text>
          <View style={{marginTop: 20, marginBottom: 20}}>
            <Text>Vui lòng điền đầy đủ tên và giá</Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              style={[styles.button, styles.buttonOpen]}
              onPress={() => {
                setModalVisible(false);
              }}>
              <Text style={styles.textStyle}>Đồng ý</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 5,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 10,
  },
  buttonOpen: {
    backgroundColor: '#FEC54B',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: 'black',
    marginTop: getStatusBarHeight(),
    paddingBottom: 15,
    alignSelf: 'center',
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#CACACA',
    paddingRight: 20,
  },
  box: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: '100%',
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
  inputField: {
    backgroundColor: 'white',
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  textBold: {
    fontWeight: 'bold',
    color: 'black',
  },
});
