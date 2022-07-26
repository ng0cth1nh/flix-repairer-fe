import moment from 'moment';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
const {height} = Dimensions.get('window');
import {numberWithCommas} from '../utils/util';
export default function RequestItem({
  item,
  index,
  handleNavigationToDetailRequest,
  handleButtonPress,
  textButton,
  text,
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        handleNavigationToDetailRequest(item.requestCode, item.serviceId);
      }}
      style={[
        styles.box,
        {
          height: 'auto',
          flexDirection: 'column',
          marginTop: index === 0 ? 12 : 0,
        },
      ]}>
      <View style={styles.boxHeader}>
        <Image
          source={require('../../assets/images/type/support.png')}
          style={{
            height: 20,
            width: 20,
          }}
        />
        <Text style={styles.tittleText}>{item.requestCode}</Text>
        <Text style={styles.editText}>
          {moment(item.date).format('HH:mm - DD/MM/YYYY')}
        </Text>
      </View>
      <View style={styles.boxBody}>
        <Image
          source={{uri: item.image}}
          style={{
            height: height * 0.12,
            width: height * 0.111,
            borderRadius: 10,
            alignSelf: 'center',
            marginHorizontal: '2%',
          }}
        />
        <View style={styles.boxBodyContent}>
          <Text style={[styles.textBold, {fontSize: 24}]}>
            {item.serviceName}
          </Text>
          <Text style={{fontSize: 16, color: 'black', marginVertical: 6}}>
            {text}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.textBold}>{`${numberWithCommas(
              item.actualPrice,
            )} vnđ`}</Text>
            <TouchableOpacity
              style={styles.viewServiceButton}
              onPress={() => {
                handleButtonPress(item);
              }}>
              <Text style={styles.textBold}>{textButton}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#F0F0F0',
    borderRadius: 18,
    paddingHorizontal: '4%',
    marginVertical: 12,
    flexDirection: 'row',
    height: height * 0.152,
  },
  boxHeader: {
    flexDirection: 'row',
    flex: 2,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tittleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
  },
  editText: {
    marginLeft: 'auto',
    fontSize: 11,
  },

  boxBody: {
    flex: 8,
    flexDirection: 'row',
    marginVertical: 1,
    paddingBottom: 16,
  },
  boxBodyContent: {
    flex: 1,
    marginLeft: 10,
    height: '70%',
    width: '100%',
    paddingBottom: 5,
    justifyContent: 'space-between',
  },
  viewServiceButton: {
    paddingVertical: 4,
    width: 'auto',
    borderRadius: 10,
    backgroundColor: '#FEC54B',
    paddingHorizontal: 6,
  },
  textBold: {
    fontWeight: '600',
    color: 'black',
    fontSize: 12,
  },
  serviceRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  servicePrice: {
    marginLeft: 'auto',
    color: '#E67F1E',
    fontWeight: '600',
  },
});
