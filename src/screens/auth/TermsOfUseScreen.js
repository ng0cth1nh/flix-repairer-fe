import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import BackButton from '../../components/BackButton';
import Button from '../../components/Button';
export default function TermsOfUseScreen({navigation}) {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <BackButton onPressHandler={navigation.goBack} color="#FEC54B" />
      <SafeAreaView style={styles.container}>
        <View style={styles.logoArea}>
          <View style={styles.logo}>
            <Image
              style={styles.imageLogo}
              source={require('../../../assets/images/logo/logo.png')}
            />
          </View>
        </View>
        <Text style={styles.headerText}>Điều khoản sử dụng dịch vụ</Text>
        <ScrollView>
          <View>
            <Text style={styles.titleText}>What is Lorem Ipsum? </Text>
            <Text>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum. Why do we use it? It is a long established fact that
              a reader will be distracted by the readable content of a page when
              looking at its layout. The point of using Lorem Ipsum is that it
              has a more-or-less normal distribution of letters, as opposed to
              using 'Content here, content here', making it look like readable
              English. Many desktop publishing packages and web page editors now
              use Lorem Ipsum as their default model text, and a search for
              'lorem ipsum' will uncover many web sites still in their infancy.
              Various versions have evolved over the years, sometimes by
              accident, sometimes on purpose (injected humour and the like).
              Where does it come from? Contrary to popular belief, Lorem Ipsum
              is not simply random text. It has roots in a piece of classical
              Latin literature from 45 BC, making it over 2000 years old.
              Richard McClintock, a Latin professor at Hampden-Sydney College in
              Virginia, looked up one of the more obscure Latin words,
              consectetur, from a Lorem Ipsum passage, and going through the
              cites of the word in classical literature, discovered the
              undoubtable source.
            </Text>
          </View>
          <Button
            style={{marginTop: 30, marginBottom: 40}}
            onPress={navigation.goBack}
            buttonText="ĐỒNG Ý"
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1, paddingLeft: 30, paddingRight: 30},
  logoArea: {
    height: '30%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  logo: {
    width: '32%',
    aspectRatio: 1,
  },
  imageLogo: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  titleText: {
    fontWeight: 'bold',
    color: 'black',
  },
});
