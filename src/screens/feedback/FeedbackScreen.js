import React, {useState, useRef} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
const {width, height} = Dimensions.get('window');
import Ionicons from 'react-native-vector-icons/Ionicons';
import TopHeaderComponent from '../../components/TopHeaderComponent';
import RNPickerSelect from 'react-native-picker-select';
import {FeedbackType} from '../../utils/util';
import Toast from 'react-native-toast-message';
import ImagePicker from 'react-native-image-crop-picker';
import SubmitButton from '../../components/SubmitButton';
import useAxios from '../../hooks/useAxios';
import ProgressLoader from 'rn-progress-loader';
import {useSelector, useDispatch} from 'react-redux';
import {
  sendFeedback,
  setIsLoading,
  selectIsLoading,
} from '../../features/user/userSlice';

const FeedbackScreen = ({navigation}) => {
  const [feedbackType, setFeedbackType] = useState(null);
  const [requestCode, setRequestCode] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [images, setImages] = useState([]);
  const [feedbackTypeError, setFeedbackTypeError] = useState(null);
  const [requestCodeInputError, setRequestCodeInputError] = useState(null);
  const [titleInputError, setTitleInputError] = useState(null);
  const [descriptionInputError, setDescriptionInputError] = useState(null);
  const isLoading = useSelector(selectIsLoading);
  const repairerAPI = useAxios();
  const dispatch = useDispatch();
  const scrollRef = useRef();

  const selectFile = async () => {
    try {
      const file = await ImagePicker.openPicker({
        cropping: false,
        multiple: true,
      });
      let temp = [...file, ...images];
      setImages(temp.slice(0, 5));
    } catch (error) {
      console.log(error);
    }
  };

  const checkRequestCodeValid = async () => {
    if (requestCode && requestCode.length !== 12) {
      setRequestCodeInputError('Mã yêu cầu không hợp lệ');
      return false;
    }
    return true;
  };
  const checkTitleValid = async () => {
    if (!title || title.trim() === '') {
      setTitleInputError('Vui lòng nhập tiêu đề');
      return false;
    }
    return true;
  };
  const checkDescriptionValid = async () => {
    if (!description || description.trim() === '') {
      setDescriptionInputError('Vui lòng nhập nội dung');
      return false;
    }
    return true;
  };

  const checkFeedbackTypeValid = async () => {
    if (!feedbackType || feedbackType.trim() === '') {
      setFeedbackTypeError('Vui lòng nhập loại phản hồi');
      return false;
    }
    return true;
  };

  const handleClose = index => {
    let temp = [];
    for (let i = 0; i < images.length; i++) {
      if (i !== index) {
        temp.push(images[i]);
      }
    }
    setImages(temp);
  };

  const handleSubmitButton = async () => {
    try {
      let isDescriptionValid = await checkDescriptionValid();
      let isFeedbackValid = await checkFeedbackTypeValid();
      let isRequestCodeValid = await checkRequestCodeValid();
      let isTitleValid = await checkTitleValid();

      if (!isFeedbackValid) {
        scrollRef.current?.scrollTo({x: 0, y: 0, animated: true});
      }

      if (
        isDescriptionValid &&
        isFeedbackValid &&
        isRequestCodeValid &&
        isTitleValid
      ) {
        await dispatch(setIsLoading());
        await dispatch(
          sendFeedback({
            repairerAPI,
            body: {
              images,
              requestCode,
              feedbackType,
              title,
              description,
            },
          }),
        ).unwrap();
        Toast.show({
          type: 'customToast',
          text1: 'Tạo phản hồi thành công',
        });
        navigation.goBack();
      }
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: err,
      });
    }
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <TopHeaderComponent
        navigation={navigation}
        title="Gửi yêu cầu hỗ trợ"
        isBackButton={true}
        statusBarColor="white"
      />
      <SafeAreaView style={{flex: 1, marginHorizontal: '4%'}}>
        <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
          <View style={[styles.inputField, {marginTop: 10}]}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.inputLabel}>Loại yêu cầu *</Text>
            </View>
            <View
              style={[
                styles.valueSpace,
                {borderColor: feedbackTypeError ? '#FF6442' : '#CACACA'},
              ]}>
              <RNPickerSelect
                value={feedbackType ? feedbackType : 'Chọn loại yêu cầu'}
                fixAndroidTouchableBug={true}
                onValueChange={value => {
                  setFeedbackType(value);
                  setFeedbackTypeError(null);
                }}
                placeholder={{
                  label: 'Chọn loại yêu cầu',
                  value: null,
                }}
                useNativeAndroidPickerStyle={false}
                style={styles.pickerStyle}
                items={FeedbackType}
                Icon={() => (
                  <Ionicons
                    name="chevron-down-sharp"
                    size={20}
                    color="black"
                    style={{marginTop: (0.075 * height) / 4}}
                  />
                )}
              />
              {feedbackTypeError && (
                <Text style={styles.errorMessage}>{feedbackTypeError}</Text>
              )}
            </View>
          </View>
          <View style={styles.inputField}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.inputLabel}>Mã yêu cầu sửa chữa</Text>
            </View>
            <View
              style={[
                styles.valueSpace,
                {borderColor: requestCodeInputError ? '#FF6442' : '#CACACA'},
              ]}>
              <TextInput
                style={styles.valueText}
                value={requestCode}
                onChangeText={text => setRequestCode(text)}
                onFocus={() => setRequestCodeInputError(null)}
                placeholder="Nhập mã yêu cầu"
                placeholderTextColor="#DFDFDF"
              />
              {requestCodeInputError && (
                <Text style={styles.errorMessage}>{requestCodeInputError}</Text>
              )}
            </View>
          </View>
          <View style={styles.inputField}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.inputLabel}>Tiêu đề *</Text>
            </View>
            <View
              style={[
                styles.valueSpace,
                {borderColor: titleInputError ? '#FF6442' : '#CACACA'},
              ]}>
              <TextInput
                style={styles.valueText}
                value={title}
                onChangeText={text => setTitle(text)}
                onFocus={() => setTitleInputError(null)}
                placeholder="Nhập tiêu đề"
                placeholderTextColor="#DFDFDF"
              />
              {titleInputError && (
                <Text style={styles.errorMessage}>{titleInputError}</Text>
              )}
            </View>
          </View>
          <View style={styles.inputField}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.inputLabel}>Nội dung *</Text>
            </View>
            <View
              style={[
                styles.valueSpace,
                {
                  height: 100,
                  borderColor: descriptionInputError ? '#FF6442' : '#CACACA',
                },
              ]}>
              <TextInput
                style={styles.valueText}
                value={description}
                onChangeText={text => setDescription(text)}
                placeholder="Mô tả chi tiết vấn đề của bạn"
                placeholderTextColor="#DFDFDF"
                onFocus={() => setDescriptionInputError(null)}
                multiline
                numberOfLines={5}
              />
              {descriptionInputError && (
                <Text style={styles.errorMessage}>{descriptionInputError}</Text>
              )}
            </View>
          </View>
          <View style={styles.inputField}>
            <Text style={styles.inputLabel}>Tệp ảnh đính kèm (nếu có)</Text>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginBottom: 10,
              }}>
              {images.length !== 0
                ? images.map((item, index) => {
                    return (
                      <ImageBackground
                        source={{uri: item.path}}
                        key={index}
                        style={styles.avatar}
                        resizeMode="cover">
                        <TouchableOpacity
                          style={styles.cameraButton}
                          onPress={() => handleClose(index)}>
                          <Image
                            style={{
                              width: 12,
                              height: 12,
                            }}
                            source={require('../../../assets/images/type/close.png')}
                          />
                        </TouchableOpacity>
                      </ImageBackground>
                    );
                  })
                : null}
              {images.length < 5 && (
                <TouchableOpacity onPress={selectFile}>
                  <Image
                    style={{
                      width: width * 0.18,
                      height: width * 0.18,
                      marginRight: 20,
                      marginVertical: 20,
                    }}
                    source={require('../../../assets/images/type/add-image.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
        <ProgressLoader
          visible={isLoading}
          isModal={true}
          isHUD={true}
          hudColor={'#FEC54B'}
          color={'#000000'}
        />
        <SubmitButton
          style={{
            marginVertical: 10,
            width: '100%',
            alignSelf: 'center',
          }}
          onPress={handleSubmitButton}
          buttonText="GỬI YÊU CẦU"
        />
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  avatar: {
    width: width * 0.18,
    aspectRatio: 1,
    borderRadius: width * 0.15,
    alignSelf: 'center',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginRight: 20,
    marginBottom: 20,
  },
  cameraButton: {
    width: width * 0.3 * 0.2,
    top: -6,
    right: -6,
    position: 'absolute',
    aspectRatio: 1,
    backgroundColor: '#D9D9D9',
    borderRadius: width * 0.15 * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  boxHeader: {
    flexDirection: 'row',
    height: 35,
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  tittleText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
    marginLeft: 40,
  },
  editTouch: {
    marginLeft: 'auto',
  },
  editText: {
    color: '#FEC54B',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
    marginBottom: 10,
  },
  textBold: {
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  errorMessage: {
    position: 'absolute',
    bottom: -14,
    left: 5,
    fontSize: 10,
    color: '#FF6442',
  },
  inputField: {marginBottom: 16},
  inputLabel: {
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    fontSize: 14,
  },
  valueSpace: {
    height: 'auto',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    width: '100%',
  },
  valueText: {
    fontSize: 16,
    color: 'black',
  },
  valueTextBlur: {
    fontSize: 16,
    color: '#DFDFDF',
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
});

export default FeedbackScreen;
