import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useState, useRef} from 'react';
import {Checkbox, NativeBaseProvider} from 'native-base';
import useAxios from '../../hooks/useAxios';
import ApiConstants from '../../constants/Api';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import TopHeaderComponent from '../../components/TopHeaderComponent';
import Button from '../../components/SubmitButton';
import SearchForm from '../../components/SearchForm';
import NotFound from '../../components/NotFound';

export default function AddSubServiceScreen({route, navigation}) {
  const [search, setSearch] = useState('');
  const {
    requestCode,
    serviceId,
    subServiceIds,
    setSubServiceId,
    setSubServiceIds,
  } = route.params;
  const [loading, setLoading] = useState(false);
  const repairerAPI = useAxios();
  const typingTimeoutRef = useRef(null);
  const [addedSubServiceIds, setAddedSubServiceIds] = useState(subServiceIds);
  const [searchedSubServiceId, setSearchedSubServiceId] = useState(null);

  const handleOnChangeSearch = async text => {
    setSearch(text);
    if (text === '') {
      return;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setLoading(true);
    typingTimeoutRef.current = setTimeout(async () => {
      let response = await repairerAPI.get(
        ApiConstants.SEARCH_SUB_SERVICE_BY_SERVICE_API,
        {
          params: {keyword: text, serviceId},
        },
      );
      console.log('search: ' + text);
      setSearchedSubServiceId(response.data.subServices);
      setLoading(false);
    }, 200);
  };

  const handleDeleteAddedService = async index => {
    const temp = [];
    for (let i = 0; i < addedSubServiceIds.length; i++) {
      if (i !== index) {
        temp.push(addedSubServiceIds[i]);
      }
    }
    setAddedSubServiceIds(temp);
  };

  const handleAddButton = async () => {
    let temp = addedSubServiceIds.map((item, index) => {
      const [id, name, price] = item.split('[SPACE]');
      return {id, name, price};
    });
    setSubServiceId(temp);
    setSubServiceIds(addedSubServiceIds);
    navigation.goBack();
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Thêm dịch vụ đã sửa"
        isBackButton={true}
        statusBarColor="white"
      />
      <SafeAreaView
        style={{flex: 1, marginHorizontal: '4%', marginVertical: 10}}>
        <SearchForm
          search={search}
          setSearch={setSearch}
          handleOnChangeSearch={handleOnChangeSearch}
          placeholder="Nhập tên dịch vụ"
        />
        <View
          style={{
            flex: 1,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#CACACA',
          }}>
          <ScrollView>
            {addedSubServiceIds.length !== 0 ? (
              <View>
                <View style={styles.titleBox}>
                  <Text style={[styles.textBold, {fontSize: 20}]}>Đã thêm</Text>
                </View>
                {addedSubServiceIds.map((item, index) => {
                  const [id, name, price] = item.split('[SPACE]');
                  return (
                    <View
                      key={index.toString()}
                      style={[
                        styles.serviceRow,
                        {
                          paddingHorizontal: 20,
                          width: '98%',
                          marginVertical: 6,
                          paddingVertical: 6,
                        },
                      ]}>
                      <Text>{name}</Text>
                      <Text style={[styles.textBold, {marginLeft: 'auto'}]}>
                        {price} vnđ
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteAddedService(index)}
                        style={styles.closeIcon}>
                        <Ionicons name="close" size={16} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ) : null}

            {loading ? (
              <ActivityIndicator
                size="small"
                color="#FEC54B"
                style={{
                  marginTop: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            ) : (
              <View>
                {searchedSubServiceId !== null ? (
                  searchedSubServiceId.length !== 0 ? (
                    <NativeBaseProvider>
                      <View style={styles.titleBox}>
                        <Text style={[styles.textBold, {fontSize: 20}]}>
                          Tất cả dịch vụ
                        </Text>
                      </View>
                      <Checkbox.Group
                        onChange={setAddedSubServiceIds}
                        value={addedSubServiceIds}
                        accessibilityLabel="choose numbers">
                        {searchedSubServiceId.map((item, index) => (
                          <View
                            key={index.toString()}
                            style={[styles.serviceRow, {marginVertical: 6}]}>
                            <Checkbox
                              accessibilityLabel={item.name}
                              value={`${item.id}[SPACE]${item.name}[SPACE]${item.price}`}
                              colorScheme="yellow"
                              _icon={{color: 'black'}}>
                              {item.name}
                            </Checkbox>
                            <Text
                              style={[styles.textBold, {marginLeft: 'auto'}]}>
                              {item.price} vnđ
                            </Text>
                          </View>
                        ))}
                      </Checkbox.Group>
                    </NativeBaseProvider>
                  ) : (
                    <NotFound />
                  )
                ) : null}
              </View>
            )}
          </ScrollView>
        </View>
        <Button
          style={{
            marginVertical: 8,
            width: '100%',
            alignSelf: 'center',
          }}
          onPress={handleAddButton}
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
    width: '100%',
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
    right: -6,
  },
});
