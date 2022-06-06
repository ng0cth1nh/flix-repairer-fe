import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  StatusBar,
} from 'react-native';
export default function SplashScreen() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <SafeAreaView style={styles.container}>
        <View style={styles.logoArea}>
          <View style={styles.logo}>
            <Image
              style={styles.imageLogo}
              source={require('../../assets/images/logo/logo.png')}
            />
          </View>
        </View>
        <View style={[styles.introText, {opacity: 1}]}>
          <Text style={styles.headerText}>
            Dịch vụ tìm thợ sửa chữa đồ gia dụng
          </Text>
          <Text style={styles.descriptionText}>
            Chuyên nghiệp, nhanh chóng, tiện lợi
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1},
  logoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  logo: {
    width: '40%',
    aspectRatio: 1,
  },
  imageLogo: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  introText: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },

  headerText: {
    width: '80%',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    color: 'black',
  },
  descriptionText: {
    width: '60%',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: 'black',
  },
});
