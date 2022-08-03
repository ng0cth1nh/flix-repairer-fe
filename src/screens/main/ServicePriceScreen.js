import React from 'react';
import {FlatList, Text, View} from 'react-native';
import TopHeaderComponent from '../../components/TopHeaderComponent';
import ApiConstants from '../../constants/Api';
import NotFound from '../../components/NotFound';
import useFetchData from '../../hooks/useFetchData';
import {numberWithCommas} from '../../utils/util';
import Loading from '../../components/Loading';

const ServicePriceScreen = ({route, navigation}) => {
  const {serviceName, serviceId} = route.params;
  const {loading, data, isError} = useFetchData(
    ApiConstants.GET_SERVICE_DETAIL_API,
    {
      params: {serviceId: serviceId},
    },
  );

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <TopHeaderComponent
        navigation={navigation}
        title={serviceName}
        isBackButton={true}
        statusBarColor="white"
      />
      <View style={{flex: 1, marginHorizontal: '4%'}}>
        {isError ? <NotFound /> : null}
        {data !== null ? (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F0F0F0',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              height: 40,
              marginTop: 10,
            }}>
            <Text
              style={{
                flex: 5,
                color: 'black',
                alignSelf: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                paddingLeft: 10,
              }}>
              Các vấn đề thường gặp
            </Text>
            <Text
              style={{
                flex: 2,
                color: 'black',
                alignSelf: 'center',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              Giá dịch vụ
            </Text>
          </View>
        ) : null}
        {loading ? <Loading /> : null}
        {data !== null ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data.subServices}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View
                key={index.toString()}
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#DDDDDD',
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  paddingLeft: 15,
                  height: 'auto',
                  paddingVertical: 10,
                }}>
                <Text
                  style={{
                    flex: 2,
                    color: 'black',
                    fontSize: 14,
                    alignSelf: 'center',
                    paddingRight: 10,
                  }}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    color: 'black',
                    fontSize: 14,
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}>
                  {numberWithCommas(item.price)}
                </Text>
              </View>
            )}
          />
        ) : null}
      </View>
    </View>
  );
};

export default ServicePriceScreen;
