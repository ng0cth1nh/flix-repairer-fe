import {View, Dimensions} from 'react-native';
import React, {useMemo} from 'react';
import Modal from 'react-native-modal';
const {width, height} = Dimensions.get('window');
export default function CustomModal(props) {
  const {
    modalVisible = false,
    setModalVisible,
    children,
    modalRatio,
    modalStyle = {},
  } = props;
  const styles = useMemo(
    () => ({
      centeredView: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: height * (1 - modalRatio),
        height: height * modalRatio,
        width,
      },
      modalView: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 10,
      },
    }),
    [modalRatio],
  );
  return (
    <Modal
      animationType="fade"
      transparent={true}
      isVisible={modalVisible}
      onBackdropPress={() => setModalVisible(false)}
      style={{margin: 0}}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, modalStyle]}>{children}</View>
      </View>
    </Modal>
  );
}
