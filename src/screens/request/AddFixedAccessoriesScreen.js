import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {Checkbox, NativeBaseProvider} from 'native-base';

import {getStatusBarHeight} from 'react-native-status-bar-height';

import BackButton from '../../components/BackButton';
import Button from '../../components/SubmitButton';
import SearchForm from '../../components/SearchForm';

const listId = [
  {id: 1},
  {id: 2},
  {id: 3},
  {id: 4},
  {id: 5},
  {id: 6},
  {id: 7},
  {id: 8},
  {id: 9},
  {id: 10},
  {id: 11},
  {id: 12},
];

export default function AddFixedAccessoriesScreen({navigation}) {
  const [search, setSearch] = useState('');
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
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <BackButton onPressHandler={navigation.goBack} color="black" />
      <SafeAreaView style={{flex: 1, paddingHorizontal: 20}}>
        <View style={styles.headerBox}>
          <View style={{flex: 1, marginLeft: 20}}>
            <Text style={styles.headerText}>Thêm linh kiện đã thay</Text>
          </View>
        </View>
        <SearchForm
          search={search}
          setSearch={setSearch}
          placeholder="Nhập tên linh kiện"
        />
        <View
          style={{
            flex: 1,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#CACACA',
          }}>
          <ScrollView>
            <View>
              <View style={styles.titleBox}>
                <Text style={[styles.textBold, {fontSize: 20}]}>
                  Linh kiện đã thay
                </Text>
              </View>
              <FlatList
                nestedScrollEnabled
                data={listId}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
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
    marginBottom: 10,
  },
  textBold: {
    fontWeight: 'bold',
    color: 'black',
  },
  titleBox: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
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
});
