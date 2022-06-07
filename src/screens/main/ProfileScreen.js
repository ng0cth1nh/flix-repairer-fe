/* eslint-disable prettier/prettier */
import React, { useRef, useState, useEffect } from 'react';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import {
   View,
   Text,
   Dimensions,
   StyleSheet,
   Platform,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const ENTRIES1 = [
   {
      title: 'Ưu đãi hôm nay',
      image: 'https://i.postimg.cc/QN2jQkDW/emmanuel-ikwuegbu-0-kl1-Bjv-Fc-unsplash.jpg',
   },
   {
      title: 'Ưu đãi cho khách hàng mới',
      image: 'https://i.imgur.com/UPrs1EWl.jpg',
   }
];


const ProfileScreen = props => {
   const [entries, setEntries] = useState([]);
   const carouselRef = useRef(null);

   const goForward = () => {
      carouselRef.current.snapToNext();
   };

   useEffect(() => {
      setEntries(ENTRIES1);
   }, []);

   const renderItem = ({ item, index }, parallaxProps) => {
      return (
         <View style={styles.item}>
            <ParallaxImage
               source={{ uri: item.illustration }}
               containerStyle={styles.imageContainer}
               style={styles.image}
               parallaxFactor={0.4}
               {...parallaxProps}
            />
            <Text style={styles.title} numberOfLines={2}>
               {item.title}
            </Text>
         </View>
      );
   };

   return (
      <View style={styles.container}>
         <Carousel
            ref={carouselRef}
            sliderWidth={screenWidth}
            sliderHeight={screenWidth}
            itemWidth={screenWidth - 60}
            data={entries}
            renderItem={renderItem}
            hasParallaxImages={true}
         />
      </View>
   );
};

export default ProfileScreen;

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   title: {
      position: 'absolute',
      color: 'white',
      bottom: 10,
      left: 20,
      fontWeight: '700',
      fontSize: 24,
   },
   item: {
      width: screenWidth - 60,
      height: 150,
      position: 'relative',
   },
   imageContainer: {
      flex: 1,
      marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
      backgroundColor: 'white',
      borderRadius: 8,
   },
   image: {
      ...StyleSheet.absoluteFillObject,
      resizeMode: 'cover',
   },
});