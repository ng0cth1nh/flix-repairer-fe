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
import {formatCurrency} from '../../utils/FormattingCurrency';

export default function AddExtraServiceScreen({route, navigation}) {
  const {item, index, extraService, setExtraServices, setExtraService} =
    route.params;
  console.log(item);
  const [modalVisible, setModalVisible] = useState(false);
  const [price, setPrice] = useState(
    item ? formatCurrency(item.price.toString()) : null,
  );
  const [name, setName] = useState(item ? item.name : null);
  const [description, setDescription] = useState(
    item && item.description !== 'null' ? item.description : null,
  );
  const [insuranceTime, setInsuranceTime] = useState(
    item ? item.insuranceTime + '' : null,
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
        title="Th??m d???ch v??? b??n ngo??i"
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
              <Text style={styles.tittleText}>T??n d???ch v??? ho???c linh ki???n</Text>
            </View>
            <View style={{marginLeft: 40, marginTop: 10}}>
              <TextInput
                style={styles.inputField}
                value={name}
                onChangeText={text => setName(text)}
                placeholder="Nh???p t??n d???ch v??? ho???c linh ki???n"
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
              <Text style={styles.tittleText}>M?? t???</Text>
            </View>
            <View style={{marginLeft: 40, marginTop: 10}}>
              <TextInput
                multiline
                numberOfLines={2}
                placeholder="Nh???p m?? t???"
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
              <Text style={styles.tittleText}>Gi?? th??nh</Text>
            </View>
            <View style={{marginLeft: 40, marginTop: 10}}>
              <View
                style={[
                  styles.inputField,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '54%',
                  },
                ]}>
                <TextInput
                  keyboardType="numeric"
                  value={price}
                  onChangeText={newPrice => setPrice(formatCurrency(newPrice))}
                  style={{flex: 1, marginRight: 5}}
                />
                <Text style={styles.textBold}>vn??</Text>
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
              <Text style={styles.tittleText}>Th???i gian b???o h??nh</Text>
            </View>
            <View style={{marginLeft: 40, marginTop: 10}}>
              <View
                style={[
                  styles.inputField,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '36%',
                  },
                ]}>
                <TextInput
                  keyboardType="numeric"
                  value={insuranceTime}
                  onChangeText={text => setInsuranceTime(text)}
                  style={{flex: 1, marginRight: 5}}
                />
                <Text style={styles.textBold}>th??ng</Text>
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
          buttonText="TH??M"
        />
        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          modalRatio={0.28}>
          <Text style={styles.modalText}>L??u ??</Text>
          <View style={{marginVertical: 10}}>
            <Text>Vui l??ng ??i???n ?????y ????? t??n v?? gi??</Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <Button
              style={{
                marginVertical: 8,
                width: '100%',
                alignSelf: 'center',
              }}
              onPress={() => setModalVisible(false)}
              buttonText="?????NG ??"
            />
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
