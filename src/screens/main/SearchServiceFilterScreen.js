import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {Checkbox, NativeBaseProvider} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import TopHeaderComponent from '../../components/TopHeaderComponent';
import Button from '../../components/SubmitButton';
import SearchForm from '../../components/SearchForm';
import useAxios from '../../hooks/useAxios';
import ApiConstants from '../../constants/Api';
import NotFound from '../../components/NotFound';
import Loading from '../../components/Loading';

export default function SearchServiceFilterScreen({route, navigation}) {
  const [search, setSearch] = useState('');
  const {addedService, setAddedService} = route.params;
  const [searchedService, setSearchedService] = useState(null);
  const [addService, setAddService] = useState(addedService);
  const [loading, setLoading] = useState(false);
  const typingTimeoutRef = useRef(null);
  const repairerAPI = useAxios();

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
      let response = await repairerAPI.get(ApiConstants.SEARCH_SERVICE_API, {
        params: {keyword: text},
      });
      console.log('search: ' + text);
      setSearchedService(response.data.services);
      setLoading(false);
    }, 200);
  };

  const handleDeleteAddedService = async index => {
    const temp = [];
    for (let i = 0; i < addService.length; i++) {
      if (i !== index) {
        temp.push(addService[i]);
      }
    }
    setAddService(temp);
  };

  const handleAddButton = async () => {
    setAddedService(addService);
    navigation.goBack();
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <TopHeaderComponent
        navigation={navigation}
        title="D???ch v??? s???a ch???a"
        isBackButton={true}
        statusBarColor="white"
      />
      <SafeAreaView
        style={{flex: 1, paddingHorizontal: '4%', marginVertical: 10}}>
        <SearchForm
          search={search}
          setSearch={setSearch}
          handleOnChangeSearch={handleOnChangeSearch}
          placeholder="T??m ki???m d???ch v???"
        />
        <View
          style={{
            flex: 1,
            paddingVertical: 10,
          }}>
          <ScrollView>
            {addService.length !== 0 ? (
              <View>
                <View style={styles.titleBox}>
                  <Text style={[styles.textBold, {fontSize: 20}]}>???? th??m</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginBottom: 5,
                  }}>
                  {addService.map((item, index) => {
                    const [serviceId, serviceName, icon] =
                      item.split('[SPACE]');
                    return (
                      <View
                        style={styles.selectedService}
                        key={index.toString()}>
                        <Image
                          source={{uri: icon}}
                          style={{width: 24, height: 24}}
                        />
                        <Text style={{marginLeft: 10, color: 'black'}}>
                          {serviceName}
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
              </View>
            ) : null}
            {loading ? (
              <Loading
                style={{
                  marginTop: 20,
                }}
              />
            ) : (
              <View>
                {searchedService !== null ? (
                  searchedService.length !== 0 ? (
                    <NativeBaseProvider>
                      <View style={styles.titleBox}>
                        <Text style={[styles.textBold, {fontSize: 20}]}>
                          T???t c??? d???ch v???
                        </Text>
                      </View>
                      <Checkbox.Group
                        onChange={setAddService}
                        value={addService}
                        accessibilityLabel="choose numbers">
                        {searchedService.map((item, index) => (
                          <View
                            style={styles.serviceRow}
                            key={index.toString()}>
                            <Image
                              source={{uri: item.icon}}
                              style={{width: 24, height: 24}}
                            />
                            <Text
                              style={{
                                color: 'black',
                                fontSize: 16,
                                marginLeft: 20,
                                marginRight: 50,
                              }}>
                              {item.serviceName}
                            </Text>
                            <View style={{marginLeft: 'auto'}}>
                              <Checkbox
                                accessibilityLabel={item.serviceName}
                                value={`${item.serviceId}[SPACE]${item.serviceName}[SPACE]${item.icon}`}
                                colorScheme="yellow"
                                _icon={{color: 'black'}}
                              />
                            </View>
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
          buttonText="TH??M"
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#D3D3D3',
    marginVertical: 6,
    width: '100%',
  },
  selectedService: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 16,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#CACACA',
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
