import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import React from 'react';
import {Checkbox, NativeBaseProvider} from 'native-base';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Button from '../../components/SubmitButton';
import TopHeaderComponent from '../../components/TopHeaderComponent';

const listId = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];
function AddFixedServiceScreen({navigation}) {
  // const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const handlerAddFixedAccessoriesButtonClick = async () => {
    try {
      navigation.push('AddFixedAccessoriesScreen', {
        // serviceName: service.serviceName,
        // serviceId: 1,
      });
    } catch (err) {
      // Toast.show({
      //   type: 'customErrorToast',
      //   text1: err,
      // });
    }
  };
  const handlerAddExtraServiceButtonClick = async () => {
    try {
      navigation.push('AddExtraServiceScreen', {
        // serviceName: service.serviceName,
        // serviceId: 1,
      });
    } catch (err) {
      // Toast.show({
      //   type: 'customErrorToast',
      //   text1: err,
      // });
    }
  };
  const handlerAddSubServiceButtonClick = async () => {
    try {
      navigation.push('AddSubServiceScreen', {
        // serviceName: service.serviceName,
        // serviceId: 1,
      });
    } catch (err) {
      // Toast.show({
      //   type: 'customErrorToast',
      //   text1: err,
      // });
    }
  };

  const renderItem = ({item}) => {
    return (
      <NativeBaseProvider>
        <View style={styles.serviceRow}>
          <Checkbox
            // value={toggleCheckBox}
            onChange={() => console.log('testing smth')}
            colorScheme="yellow"
            _icon={{color: 'black'}}>
            Điện trở lò nướng
          </Checkbox>
          <Text style={[styles.textBold, {marginLeft: 'auto'}]}>
            150,000 vnđ
          </Text>
        </View>
      </NativeBaseProvider>
    );
  };
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Dịch vụ đã sửa"
        isBackButton={true}
        statusBarColor="white"
      />
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            paddingBottom: 10,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.service}>
              <View style={styles.titleBox}>
                <Text style={[styles.textBold, {fontSize: 20}]}>
                  Linh kiện đã thay
                </Text>
                <TouchableOpacity
                  onPress={handlerAddFixedAccessoriesButtonClick}>
                  <Text style={styles.editItem}>Thêm</Text>
                </TouchableOpacity>
              </View>
              {listId.map((item, index) => {
                return (
                  <NativeBaseProvider>
                    <View style={styles.serviceRow}>
                      <Checkbox
                        // value={toggleCheckBox}
                        onChange={() => console.log('testing smth')}
                        colorScheme="yellow"
                        _icon={{color: 'black'}}>
                        Điện trở lò nướng
                      </Checkbox>
                      <Text style={[styles.textBold, {marginLeft: 'auto'}]}>
                        150,000 vnđ
                      </Text>
                    </View>
                  </NativeBaseProvider>
                );
              })}
            </View>
            <View style={styles.service}>
              <View style={styles.titleBox}>
                <Text style={[styles.textBold, {fontSize: 20}]}>
                  Dịch vụ đã sửa
                </Text>
                <TouchableOpacity onPress={handlerAddExtraServiceButtonClick}>
                  <Text style={styles.editItem}>Thêm</Text>
                </TouchableOpacity>
              </View>
              {listId.map((item, index) => {
                return (
                  <NativeBaseProvider key={({index}) => index}>
                    <View style={styles.serviceRow}>
                      <Checkbox
                        // value={toggleCheckBox}
                        onChange={() => console.log('testing smth')}
                        colorScheme="yellow"
                        _icon={{color: 'black'}}>
                        Điện trở lò nướng
                      </Checkbox>
                      <Text style={[styles.textBold, {marginLeft: 'auto'}]}>
                        150,000 vnđ
                      </Text>
                    </View>
                  </NativeBaseProvider>
                );
              })}
            </View>
            <View style={styles.service}>
              <View style={styles.titleBox}>
                <Text style={[styles.textBold, {fontSize: 20}]}>
                  Dịch vụ bên ngoài
                </Text>
                <TouchableOpacity onPress={handlerAddSubServiceButtonClick}>
                  <Text style={styles.editItem}>Thêm</Text>
                </TouchableOpacity>
              </View>
              {listId.map((item, index) => {
                return (
                  <NativeBaseProvider>
                    <View style={styles.serviceRow}>
                      <Checkbox
                        // value={toggleCheckBox}
                        onChange={() => console.log('testing smth')}
                        colorScheme="yellow"
                        _icon={{color: 'black'}}>
                        Điện trở lò nướng
                      </Checkbox>
                      <Text style={[styles.textBold, {marginLeft: 'auto'}]}>
                        150,000 vnđ
                      </Text>
                    </View>
                  </NativeBaseProvider>
                );
              })}
            </View>
          </ScrollView>
        </View>
        <Button
          style={{
            width: '80%',
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 20,
          }}
          onPress={() => console.log('test')}
          buttonText="THÊM"
        />
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
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
  service: {paddingHorizontal: 20, marginTop: 15},
  titleBox: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editItem: {
    color: '#FFBC00',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#D3D3D3',
    marginTop: 7,
  },
  textBold: {
    fontWeight: 'bold',
    color: 'black',
  },
});

export default AddFixedServiceScreen;
