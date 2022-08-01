import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  Image,
  View,
  SafeAreaView,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import moment from 'moment';
import uuid from 'react-native-uuid';
import {useSelector} from 'react-redux';
import {selectUser} from '../../features/user/userSlice';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
const {height, width} = Dimensions.get('window');
import {getFileNameFromPath} from '../../utils/util';
import Loading from '../../components/Loading';
import {firebase} from '@react-native-firebase/database';
import {default as ImageResize} from 'react-native-scalable-image';
import ImageView from 'react-native-image-viewing';
import {Context as AuthContext} from '../../context/AuthContext';

import BackButton from '../../components/BackButton';
const ChatScreen = ({route, navigation}) => {
  let storeDate = null;
  const {state} = useContext(AuthContext);
  const user = useSelector(selectUser);
  const thisUserId = state.userId;
  const thisUserAvatar = user.avatar;
  const targetUserAvatar = route.params.targetUserAvatar;
  const targetUsername = route.params.targetUsername;
  const targetUserId = route.params.targetUserId;
  const [onlineStatus, setOnlineStatus] = useState(null);
  const [data, setData] = useState([]);
  const messRef = useRef(null);
  const [textMessage, setTextMessage] = useState('');
  const [fileSelect, setFileSelect] = useState(null);
  const [conversationId, setConversationId] = useState(
    route.params.conversationId,
  );
  const [isloading, setIsLoading] = useState(true);
  const [visible, setIsVisible] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      .doc(conversationId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(onResult, onError);
    const setReadSubcriber = firestore()
      .collection('conversations')
      .doc(conversationId)
      .onSnapshot(documentSnapshot => {
        if (!documentSnapshot.data()) {
          return;
        }
        if (documentSnapshot.data().senderId !== thisUserId) {
          firestore()
            .collection('conversations')
            .doc(conversationId)
            .update({
              isRead: true,
            })
            .then(() => {
              console.log('Conversations updated!');
            })
            .catch(error => {
              console.log('set isRead fail: ' + error);
            });
        }
      });
    const fetchMessages = async () => {
      if (!conversationId) {
        setIsLoading(true);
        await getConversation();
        setIsLoading(false);
      }
    };
    fetchMessages();

    return () => {
      setIsLoading(true);
      subscriber();
      setReadSubcriber();
    };
  }, [conversationId, getConversation, thisUserId]);
  //watch user online status
  useEffect(() => {
    firebase
      .app()
      .database(
        'https://flix-cb844-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref(`/online/${targetUserId}`)
      .on('value', snapshot => {
        setOnlineStatus(snapshot.val());
      });
  }, []);
  function onResult(querySnapshot) {
    setIsLoading(false);
    setData(querySnapshot.docs.map(doc => doc.data()));
  }

  function onError(error) {
    setIsLoading(false);
    console.error(error);
  }
  const sendImage = (converId = conversationId) => {
    let imageRef =
      'images/' +
      uuid.v4() +
      '.' +
      getFileNameFromPath(fileSelect.path).split('.')[1];

    const uploadUri =
      Platform.OS === 'ios'
        ? fileSelect.path.replace('file://', '')
        : fileSelect.path;
    const uploadTask = storage().ref(imageRef).putFile(uploadUri);
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      error => {
        console.log('upload file fail' + error);
      },
      async () => {
        const url = await storage().ref(imageRef).getDownloadURL();
        sendMessage('image', url, converId);
      },
    );
  };
  const sendMessage = (type, content, converId = conversationId) => {
    let timestamp = Date.now();
    firestore()
      .collection('chats')
      .doc(converId)
      .collection('messages')
      .add({
        senderId: thisUserId,
        receiverId: targetUserId,
        type,
        content,
        timestamp,
      })
      .then(() => {
        console.log('Send  message success!');
        updateLatestMessage(converId, content, timestamp, type);
      });
  };
  const getConversation = useCallback(() => {
    return firestore()
      .collection('conversations')
      .where(
        'memberOne',
        '==',
        thisUserId < targetUserId ? thisUserId : targetUserId,
      )
      .where(
        'memberTwo',
        '==',
        thisUserId < targetUserId ? targetUserId : thisUserId,
      )
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size > 0) {
          querySnapshot.forEach(documentSnapshot => {
            setConversationId(documentSnapshot.id);
          });
          console.log('get conver success');
          return true;
        }
        console.log('get conver failed');
        return false;
      })
      .catch(error => {
        console.log('get conver failed', error);
        return false;
      });
  }, [targetUserId, thisUserId]);
  const updateLatestMessage = (
    converId,
    content,
    timestamp,
    messType = 'text',
  ) => {
    firestore()
      .collection('conversations')
      .doc(converId)
      .update({
        senderId: thisUserId,
        latestMessage: content,
        messType,
        latestTimestamp: timestamp,
        isRead: false,
      })
      .then(() => {
        console.log('Conversations updated!');
      });
  };
  const createConversation = useCallback(() => {
    let id = uuid.v4();
    return firestore()
      .collection('conversations')
      .doc(id)
      .set({
        memberOne: thisUserId < targetUserId ? thisUserId : targetUserId,
        memberTwo: thisUserId < targetUserId ? targetUserId : thisUserId,
        senderId: thisUserId,
        latestMessage: null,
        messType: null,
        latestTimestamp: null,
        isRead: false,
      })
      .then(() => {
        console.log('create conver success');
        setConversationId(id);
        return id;
      })
      .catch(error => {
        console.log('Create conversation error: ' + error);
        return null;
      });
  }, [targetUserId, thisUserId]);
  const handleSendMessage = async () => {
    if (!fileSelect && (!textMessage || textMessage.trim().length === 0)) {
      return;
    }

    if (!conversationId) {
      setIsLoading(true);
      let converId = await createConversation();
      setIsLoading(false);
      console.log('create conver id :', converId);
      if (fileSelect) {
        sendImage(converId);
        setFileSelect(null);
      }
      if (textMessage) {
        sendMessage('text', textMessage, converId);
        setTextMessage('');
      }
      return;
    }
    if (fileSelect) {
      sendImage();
      setFileSelect(null);
    }
    if (textMessage) {
      sendMessage('text', textMessage);
      setTextMessage('');
    }
  };
  const selectFile = () => {
    ImagePicker.openPicker({
      cropping: false,
    })
      .then(file => {
        setFileSelect(file);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const renderDate = (thisDate, messDateFormater) => {
    if (thisDate !== storeDate) {
      storeDate = thisDate;
      return (
        <Text
          style={{
            textAlign: 'center',
            marginTop: 10,
            marginBottom: 20,
            fontSize: 12,
          }}>
          {messDateFormater.format('DD/MM/YYYY')}
        </Text>
      );
    }
  };
  const renderOtherMessage = (item, messDateFormater) => {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <Image
          source={{
            uri:
              item.senderId === thisUserId ? thisUserAvatar : targetUserAvatar,
          }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            resizeMode: 'cover',
          }}
        />
        <View style={{marginLeft: 10}}>
          {item.type === 'text' ? (
            <Text
              style={{
                maxWidth: 0.7 * width,
                color: 'black',
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: '#F0F0F0',
                borderRadius: 10,
                fontWeight: '500',
              }}>
              {item.content}
            </Text>
          ) : (
            <>
              <ImageResize
                source={{uri: item.content}}
                width={width * 0.4}
                style={{borderRadius: 10}}
                onPress={() => {
                  setImages([
                    {
                      uri: item.content,
                    },
                  ]);
                  setIsVisible(true);
                }}
              />
              <ImageView
                images={images}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
              />
            </>
          )}
          <Text
            style={{
              fontSize: 12,
              color: '#8D8D8D',
              marginTop: 3,
            }}>
            {messDateFormater.format('H:mm')}
          </Text>
        </View>
      </View>
    );
  };
  const renderMyMessage = (item, messDateFormater) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 10,
        }}>
        <View style={{alignItems: 'flex-end', marginRight: 10}}>
          {item.type === 'text' ? (
            <Text
              style={{
                maxWidth: 0.7 * width,
                color: 'black',
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: '#FEC54B',
                borderRadius: 10,
                fontWeight: '500',
              }}>
              {item.content}
            </Text>
          ) : (
            <>
              <ImageResize
                source={{uri: item.content}}
                width={width * 0.4}
                style={{borderRadius: 10}}
                onPress={() => {
                  setImages([
                    {
                      uri: item.content,
                    },
                  ]);
                  setIsVisible(true);
                }}
              />
              <ImageView
                images={images}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
              />
            </>
          )}
          <Text style={{fontSize: 12, color: '#8D8D8D', marginTop: 3}}>
            {messDateFormater.format('H:mm')}
          </Text>
        </View>
        <Image
          source={{
            uri:
              item.senderId === thisUserId ? thisUserAvatar : targetUserAvatar,
          }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            resizeMode: 'cover',
          }}
        />
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    if (index === 0) {
      storeDate = null;
    }
    let messDateFormater = moment(new Date(item.timestamp));
    return (
      <View>
        {renderDate(messDateFormater.format('DD/MM/YYYY'), messDateFormater)}
        <View>
          {item.senderId === thisUserId
            ? renderMyMessage(item, messDateFormater)
            : renderOtherMessage(item, messDateFormater)}
        </View>
      </View>
    );
  };
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View
        style={{
          height: height * 0.1,
          borderBottomWidth: 1,
          borderBottomColor: '#CACACA',
          justifyContent: 'center',
        }}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        <BackButton onPressHandler={navigation.goBack} color="black" />

        <View
          style={{
            flexDirection: 'row',
            marginLeft: 60,
            marginVertical: 'auto',
          }}>
          <Image
            source={{
              uri: targetUserAvatar,
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              resizeMode: 'cover',
            }}
          />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-around',
              marginLeft: 15,
            }}>
            <Text
              numberOfLines={1}
              style={{fontWeight: 'bold', color: 'black'}}>
              {targetUsername}
            </Text>
            <Text style={{fontSize: 12, color: '#8D8D8D'}}>
              {onlineStatus ? 'Đang hoạt động' : 'Không hoạt động'}
            </Text>
          </View>
        </View>
      </View>
      <SafeAreaView style={{flex: 1, paddingHorizontal: 10}}>
        {isloading ? (
          <Loading />
        ) : (
          <View style={{flex: 1}}>
            {data.length > 0 ? (
              <FlatList
                ref={messRef}
                onContentSizeChange={() => messRef.current.scrollToEnd()}
                onLayout={() => messRef.current.scrollToEnd()}
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                scrollEnabled={true}
              />
            ) : (
              <Text
                style={{
                  flex: 1,
                  color: 'black',
                  alignSelf: 'center',
                  textAlign: 'center',
                  marginTop: 20,
                  width: '70%',
                }}>{`Bạn hiện chưa có tin nhắn với người này. Nhắn tin ngay với ${targetUsername}!`}</Text>
            )}

            <View
              style={{
                marginVertical: 10,
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}>
              <View
                style={{
                  paddingHorizontal: 10,
                  width: '82%',
                  backgroundColor: '#F0F0F0',
                  justifyContent: 'space-between',
                  borderRadius: 10,
                }}>
                {fileSelect != null && (
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      marginVertical: 20,
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={{uri: fileSelect.path}}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 15,
                        resizeMode: 'cover',
                      }}
                    />
                    <TouchableOpacity
                      style={styles.closeIcon}
                      onPress={() => {
                        setFileSelect(null);
                      }}>
                      <Ionicons name="close" size={16} />
                    </TouchableOpacity>
                  </View>
                )}

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextInput
                    onChangeText={setTextMessage}
                    value={textMessage}
                    placeholder="Nhập tin nhắn"
                    style={{width: '80%'}}
                  />
                  <View style={{width: '20%'}}>
                    <TouchableOpacity
                      style={{
                        width: '50%',
                        marginLeft: 'auto',
                      }}
                      disabled={fileSelect}
                      onPress={selectFile}>
                      <Image
                        source={require('../../../assets/images/type/image.png')}
                        style={{
                          height: 20,
                          width: 20,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  height: 48,
                  width: '15%',
                  borderRadius: 10,
                  backgroundColor:
                    textMessage.trim() !== '' || fileSelect
                      ? '#FEC54B'
                      : '#F0F0F0',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 'auto',
                }}
                onPress={handleSendMessage}>
                <Image
                  source={
                    textMessage.trim() !== '' || fileSelect
                      ? require('../../../assets/images/type/send-active.png')
                      : require('../../../assets/images/type/send.png')
                  }
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    color: 'black',
    marginTop: getStatusBarHeight(),
    width: '100%',
  },
  selectedService: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#CACACA',
    marginTop: 15,
    marginRight: 15,
  },
  closeIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#FEC54B',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -10,
    right: -10,
  },
});
