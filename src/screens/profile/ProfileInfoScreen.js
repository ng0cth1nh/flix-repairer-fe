import {
  View,
  Image,
  Text,
  Dimensions,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import React from 'react';
const {height, width} = Dimensions.get('window');
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useSelector} from 'react-redux';
import {selectUser} from '../../features/user/userSlice';
import TopHeaderComponent from '../../components/TopHeaderComponent';

const ProfileInfoScreen = ({navigation}) => {
  const user = useSelector(selectUser);

  return (
    <View style={{backgroundColor: '#FEC54B', flex: 1}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Thông tin tài khoản"
        isBackButton={true}
        isEditButton={true}
        onPressEdit={() => navigation.push('EditProfileInfoScreen')}
        statusBarColor="#FEC54B"
        style={{borderBottomColor: '#FEC54B'}}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          style={{
            width: 110,
            height: 110,
            borderRadius: width * 0.5,
            borderColor: '#F0F0F0',
            borderWidth: 1,
            alignSelf: 'center',
            marginTop: 20,
            marginBottom: 10,
          }}
          source={{uri: user.avatar}}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            alignSelf: 'center',
            color: 'black',
            marginBottom: 20,
          }}>
          {user.fullName}
        </Text>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            paddingHorizontal: '5%',
          }}>
          <View
            style={[
              styles.box,
              {
                height: 'auto',
                flexDirection: 'column',
                marginVertical: '5%',
              },
            ]}>
            <View style={styles.boxHeader}>
              <Image
                style={{width: 24, height: 24}}
                source={require('../../../assets/images/type/user.png')}
              />
              <Text style={styles.tittleText}>Thông tin tài khoản</Text>
            </View>
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Họ và tên</Text>
              <View style={styles.valueSpace}>
                <TextInput
                  style={styles.valueText}
                  editable={false}
                  value={user.fullName}
                />
              </View>
            </View>
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Số điện thoại liên lạc</Text>
              <View style={styles.valueSpace}>
                <TextInput
                  style={styles.valueText}
                  editable={false}
                  value={user.phone}
                />
              </View>
            </View>
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Ngày sinh</Text>
              <View style={styles.valueSpace}>
                <TextInput
                  style={
                    user.dateOfBirth ? styles.valueText : styles.valueTextBlur
                  }
                  editable={false}
                  value={user.dateOfBirth ? user.dateOfBirth : 'Chưa cập nhật'}
                />
              </View>
            </View>
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Giới tính</Text>
              <View style={styles.valueSpace}>
                <TextInput
                  style={
                    user.gender !== null
                      ? styles.valueText
                      : styles.valueTextBlur
                  }
                  editable={false}
                  value={
                    user.gender !== null
                      ? user.gender
                        ? 'Nam'
                        : 'Nữ'
                      : 'Chưa cập nhật'
                  }
                />
              </View>
            </View>
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.valueSpace}>
                <TextInput
                  style={user.email ? styles.valueText : styles.valueTextBlur}
                  editable={false}
                  value={user.email ? user.email : 'Chưa cập nhật'}
                />
              </View>
            </View>
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Mô tả kinh nghiệm</Text>
              <View style={[styles.valueSpace, {height: 'auto'}]}>
                <TextInput
                  style={
                    user.experienceDescription
                      ? styles.valueText
                      : styles.valueTextBlur
                  }
                  multiline={true}
                  editable={false}
                  value={
                    user.experienceDescription
                      ? user.experienceDescription
                      : 'Chưa cập nhật'
                  }
                />
              </View>
            </View>
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Số CMND/CCCD</Text>
              <View style={styles.valueSpace}>
                <TextInput
                  style={
                    user.identityCardNumber
                      ? styles.valueText
                      : styles.valueTextBlur
                  }
                  editable={false}
                  value={
                    user.identityCardNumber
                      ? user.identityCardNumber
                      : 'Chưa cập nhật'
                  }
                />
              </View>
            </View>
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Địa chỉ</Text>
              <View style={[styles.valueSpace, {height: 'auto'}]}>
                <TextInput
                  style={user.address ? styles.valueText : styles.valueTextBlur}
                  multiline={true}
                  editable={false}
                  value={user.address ? user.address : 'Chưa cập nhật'}
                />
              </View>
            </View>
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Dịch vụ sửa chữa</Text>
              <View
                style={[
                  styles.valueSpace,
                  {height: 'auto', paddingBottom: 10},
                ]}>
                {user.registerServices ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginBottom: 5,
                    }}>
                    {user.registerServices.map((item, index) => {
                      return (
                        <View
                          style={styles.selectedService}
                          key={index.toString()}>
                          <Image
                            source={{uri: item.serviceIcon}}
                            style={{width: 24, height: 24}}
                          />
                          <Text style={{marginLeft: 5, color: 'black'}}>
                            {item.serviceName}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    color: 'black',
    marginTop: getStatusBarHeight(),
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CACACA',
    width: '100%',
    marginBottom: 10,
  },
  box: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  boxHeader: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  tittleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginLeft: 15,
  },
  inputField: {marginBottom: 12},
  inputLabel: {
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  valueSpace: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  valueText: {
    fontSize: 16,
    color: 'black',
  },
  valueTextBlur: {
    fontSize: 16,
    color: 'black',
    opacity: 0.5,
  },
  pickerStyle: {
    inputIOS: {
      fontSize: 16,
      color: 'black',
    },
    inputAndroid: {
      fontSize: 16,
      color: 'black',
    },
  },
  selectedService: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    marginTop: 15,
    marginRight: 15,
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

export default ProfileInfoScreen;
