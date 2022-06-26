import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');
const items = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}];
const HomeScreen = ({navigation}) => {
  const [buttonIndex, setButtonIndex] = useState(0);
  const handleSuggestButton = () => {
    setButtonIndex(0);
  };
  const handleInterrestButton = () => {
    setButtonIndex(1);
  };
  const handleFilterClicked = () => {
    setButtonIndex(2);
    navigation.push('ServiceFilterScreen');
  };
  const renderItem = ({item}) => {
    return (
      <View style={styles.box}>
        <View style={styles.headerBox}>
          <TouchableOpacity
            style={{
              width: 0.1 * width,
              aspectRatio: 1,
              borderRadius: 0.05 * width,
              resizeMode: 'contain',
              overflow: 'hidden',
            }}>
            <Image
              source={require('../../../assets/images/extra_icon/filter.png')}
              resizeMode="cover"
              style={{width: '100%', height: '100%'}}
            />
          </TouchableOpacity>
          <View style={styles.profileView}>
            <Text style={[styles.textBold, {fontSize: 16}]}>Johnny Depp</Text>
            <Text>08:47 - 27/05/2022</Text>
          </View>
          <TouchableOpacity style={styles.viewDetail}>
            <Text style={styles.viewDetailText}>{'Xem chi tiết>'}</Text>
          </TouchableOpacity>
        </View>
        <View style={{width: '100%', overflow: 'hidden'}}>
          <View style={styles.bodyRow}>
            <View style={styles.rowIcon}>
              <Icon name="tools" size={22} style={styles.icon} />
            </View>
            <Text style={[styles.textBold, {fontSize: 18}]}>Điều hòa</Text>
          </View>
          <View style={styles.bodyRow}>
            <View style={styles.rowIcon}>
              <Ionicons
                name="md-calendar-sharp"
                size={22}
                style={styles.icon}
              />
            </View>
            <Text style={styles.textBold}>31/05/2022</Text>
          </View>
          <View style={styles.bodyRow}>
            <View style={styles.rowIcon}>
              <Ionicons
                name="document-text-outline"
                size={22}
                style={styles.icon}
              />
            </View>
            <ScrollView
              style={{
                width: '60%',
                height: 40,
                backgroundColor: 'white',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: 'black',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                }}>
                to popular belief, Lorem Ipsum is not simply random text. It has
                roots in a piece of classical Latin literature from 45 BC,
                making it over 2000 years old. Richard McClintock, a Latin
                professor at Hampden-Sydney College in Virginia, looked up one
                of the more obscure Latin words
              </Text>
            </ScrollView>
          </View>
          <View style={styles.bodyRow}>
            <View style={styles.rowIcon}>
              <Ionicons name="location-outline" size={22} style={styles.icon} />
            </View>
            <Text
              style={{
                fontSize: 16,
                marginRight: 10,
                color: 'black',
                flex: 1,
              }}>
              Phường Minh Khai, Quận Hai Bà Trưng, Hà Nội
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#CACACA',
            paddingBottom: 10,
          }}>
          <TouchableOpacity
            style={[
              styles.suggestButton,
              buttonIndex === 0 ? {backgroundColor: '#FEC54B'} : {},
            ]}
            onPress={handleSuggestButton}>
            <Text style={[styles.textBold]}>Gợi ý cho bạn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.suggestButton,
              buttonIndex === 1 ? {backgroundColor: '#FEC54B'} : {},
            ]}
            onPress={handleInterrestButton}>
            <Text style={[styles.textBold]}>Có thể bạn quan tâm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.suggestButton,
              {
                width: '12%',
                resizeMode: 'contain',
              },
              buttonIndex === 2 ? {backgroundColor: '#FEC54B'} : {},
            ]}
            onPress={handleFilterClicked}>
            <Image
              source={require('../../../assets/images/extra_icon/filter.png')}
              resizeMode="cover"
              style={{width: '60%', height: '60%'}}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: 'white',
    height: '100%',
  },
  box: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    width: '100%',
  },
  headerBox: {
    flexDirection: 'row',
  },
  profileView: {
    marginLeft: 20,
  },
  viewDetail: {
    marginLeft: 'auto',
  },
  viewDetailText: {
    fontWeight: 'bold',
    color: '#FEC54B',
    fontSize: 15,
  },
  bodyRow: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  rowIcon: {width: 0.1 * width, marginRight: 20},
  icon: {marginLeft: 'auto', color: 'black'},
  suggestButton: {
    width: '40%',
    height: 35,
    borderWidth: 2,
    borderColor: '#FEC54B',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBold: {
    fontWeight: 'bold',
    color: 'black',
  },
});

export default HomeScreen;
