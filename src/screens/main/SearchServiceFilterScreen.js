import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {Checkbox, NativeBaseProvider} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
const items = [{id: 1}, {id: 2}, {id: 3}];

export default function SearchServiceFilterScreen({navigation}) {
  const [search, setSearch] = useState('');
  const renderItem = ({item}) => {
    return (
      <NativeBaseProvider>
        <View style={styles.serviceRow}>
          <Icon
            name="tools"
            size={20}
            style={{marginBottom: 3, marginRight: 15}}
          />
          <Text style={{color: 'black', fontSize: 16}}>Tủ lạnh</Text>
          <View style={{marginLeft: 'auto'}}>
            <Checkbox
              value={'fjsdkfjsldf'}
              onChange={() => console.log('testing smth')}
              colorScheme="yellow"
              _icon={{color: 'black'}}
            />
          </View>
        </View>
      </NativeBaseProvider>
    );
  };
  const renderService = ({item}) => {
    return (
      <View style={styles.selectedService}>
        <Ionicons name="location-outline" size={22} style={{color: 'black'}} />
        <Text style={{marginLeft: 5, color: 'black'}}>Máy tính abcjsjs</Text>
        <TouchableOpacity style={styles.closeIcon}>
          <Ionicons name="close" size={16} />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView style={{flex: 1, paddingHorizontal: 20}}>
        <View style={styles.headerBox}>
          <View style={{flex: 1, marginLeft: 20}}>
            <Text style={styles.headerText}>Dịch vụ sửa chữa</Text>
          </View>
        </View>
        <SearchForm
          search={search}
          setSearch={setSearch}
          placeholder="Tìm kiếm dịch vụ"
        />
        <View
          style={{
            flex: 1,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#CACACA',
          }}>
          <ScrollView>
            {items.length !== 0 && (
              <View style={{marginBottom: 20}}>
                <View style={styles.titleBox}>
                  <Text style={[styles.textBold, {fontSize: 20}]}>Đã thêm</Text>
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
            )}
            <View>
              <View style={styles.titleBox}>
                <Text style={[styles.textBold, {fontSize: 20}]}>
                  Tất cả dịch vụ
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
            marginVertical: 10,
          }}
          onPress={() => console.log('test')}
          buttonText="THÊM"
        />
      </SafeAreaView>
      <BackButton onPressHandler={navigation.goBack} color="black" />
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
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#D3D3D3',
    marginTop: 10,
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
});
