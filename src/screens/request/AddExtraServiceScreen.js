import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {getStatusBarHeight} from 'react-native-status-bar-height';
const {height} = Dimensions.get('window');
import TopHeaderComponent from '../../components/TopHeaderComponent';
import BackButton from '../../components/BackButton';
import Button from '../../components/SubmitButton';
import {formatCurrency, removeCommas} from '../../utils/FormattingCurrency';

export default function AddExtraServiceScreen({navigation}) {
  const [price, setPrice] = useState('');
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Thêm dịch vụ bên ngoài"
        isBackButton={true}
        statusBarColor="white"
      />
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#CACACA',
            paddingHorizontal: 20,
          }}>
          <ScrollView>
            <View
              style={[
                styles.box,
                {height: 0.15 * height, flexDirection: 'column'},
              ]}>
              <View style={styles.boxHeader}>
                <Icon name="tools" size={25} style={{marginBottom: 3}} />

                <Text style={styles.tittleText}>
                  Tên dịch vụ hoặc linh kiện
                </Text>
              </View>
              <View style={{marginLeft: 40, marginTop: 10}}>
                <TextInput style={styles.inputField} />
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
                <Ionicons
                  name="document-text-outline"
                  size={25}
                  style={{marginBottom: 3}}
                />

                <Text style={styles.tittleText}>Mô tả</Text>
              </View>
              <View style={{marginLeft: 40, marginTop: 10}}>
                <TextInput
                  multiline
                  numberOfLines={2}
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
                <Ionicons
                  name="wallet-outline"
                  size={20}
                  style={{marginBottom: 3}}
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
                    onChangeText={newPrice =>
                      setPrice(formatCurrency(newPrice))
                    }
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
                <Feather name="clock" size={25} style={{marginBottom: 3}} />
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
                    style={{flex: 1, marginRight: 5}}
                  />
                  <Text style={styles.textBold}>tháng</Text>
                </View>
              </View>
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
