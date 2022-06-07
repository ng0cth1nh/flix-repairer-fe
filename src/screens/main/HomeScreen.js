/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, Dimensions, Image, SafeAreaView, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
const { width } = Dimensions.get('window');
import Carousel from 'react-native-snap-carousel';
import BannerSlider from '../../components/BannerSlider';
import ForwardButton from '../../components/ForwardButton';
import MajorComponent from '../../components/MajorComponent';

const ENTRIES = [
  {
    title: 'Ưu đãi hôm nay',
    image: 'https://i.postimg.cc/QN2jQkDW/emmanuel-ikwuegbu-0-kl1-Bjv-Fc-unsplash.jpg',
  },
  {
    title: 'Ưu đãi cho khách hàng mới',
    image: 'https://i.imgur.com/UPrs1EWl.jpg',
  },
];

const MAJORS = [
  {
    title: 'Thiết bị giặt ủi',
    image: 'https://i.postimg.cc/L85TSmzM/engin-akyurt-y-CYVV8-k-QNM-unsplash.jpg',
  },
  {
    title: 'Thiết bị nhà bếp',
    image: 'https://i.postimg.cc/dQRnmHqg/erik-mclean-a-Po-F91-L-n6k-unsplash.jpg',
  },
  {
    title: 'Thiết bị giải trí',
    image: 'https://i.postimg.cc/NjjN06vS/fabio-silva-nm-Tm7kn-Unqs-unsplash.jpg',
  },
  {
    title: 'Thiết bị văn phòng',
    image: 'https://i.postimg.cc/ZKVcXWvc/linus-mimietz-gvpt-Kmonylk-unsplash.jpg',
  },
];


function HomeScreen() {

  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState([]);
  const [majors, setMajors] = useState([]);
  const carouselRef = useRef(null);

  const goForward = () => {
    carouselRef.current.snapToNext();
  };

  useEffect(() => {
    setEntries(ENTRIES);
  }, []);

  useEffect(() => {
    setMajors(MAJORS);
  }, []);


  const renderBanner = ({ item, index }) => {
    return <BannerSlider data={item} />;
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.searchForm}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm dịch vụ"
              onChangeText={text => setSearch(text)}
              defaultValue={search}
            />
            <Icon name="search" size={24} style={{ paddingTop: 12, alignItems: 'center' }} />
          </View>
          <View>
            <Carousel
              ref={carouselRef}
              data={entries}
              renderItem={renderBanner}
              sliderWidth={width}
              itemWidth={300}
              loop={true}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{ fontSize: 20, color: 'black', fontFamily: 'Poppins', fontWeight: '700' }}>
              Dịch vụ sửa chữa nổi bật
            </Text>
            <ForwardButton color='black' onPressHandler={console.log("a")} />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {majors.map((data, index) => {
              return <MajorComponent key={index} data={data} onPressHandler={console.log('a')} />;
            })}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{ fontSize: 20, color: 'black', fontFamily: 'Poppins', fontWeight: '700' }}>
              Danh mục
            </Text>
            <ForwardButton color='black' onPressHandler={console.log("a")} />
          </View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 50, marginTop: 10 }}>
            <TouchableOpacity
              style={{ backgroundColor: '#FEC54B', height: width * 0.22, width: width * 0.25, borderRadius: 18, alignItems: 'center', marginRight: 10 }}
              onPress={console.log('a')}
            >
              <Image source={require('../../../assets/images/type/wrench.png')} style={{ width: 30, height: 30, marginTop: 20 }} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: 'black' }}>Dịch vụ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#FEC54B', height: width * 0.22, width: width * 0.25, borderRadius: 18, alignItems: 'center', marginHorizontal: 10 }}
              onPress={console.log('a')}
            >
              <Image source={require('../../../assets/images/type/cpu.png')} style={{ width: 30, height: 30, marginTop: 20 }} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: 'black' }}>Linh kiện</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#FEC54B', height: width * 0.22, width: width * 0.25, borderRadius: 18, alignItems: 'center', marginHorizontal: 10 }}
              onPress={console.log('a')}
            >
              <Image source={require('../../../assets/images/type/discount.png')} style={{ width: 30, height: 30, marginTop: 20 }} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: 'black' }}>Ưu đãi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#FEC54B', height: width * 0.22, width: width * 0.25, borderRadius: 18, alignItems: 'center', marginLeft: 10 }}
              onPress={console.log('a')}
            >
              <Image source={require('../../../assets/images/type/discount.png')} style={{ width: 30, height: 30, marginTop: 20 }} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: 'black' }}>Sự kiện</Text>
            </TouchableOpacity>
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  searchForm: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    justifyContent: 'space-between',
    borderRadius: 18,
    paddingHorizontal: 15,
  },
  searchInput: {
    width: '80%',
  },
  container: {
    paddingHorizontal: '7%',
    paddingTop: 16,
    backgroundColor: 'white',
    height: '100%',
  }
});

export default HomeScreen;
