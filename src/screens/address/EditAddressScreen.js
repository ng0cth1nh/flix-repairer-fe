import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import CreateAddressForm from '../../components/CreateAddressForm';
import CustomModal from '../../components/CustomModal';
const EditAddressScreen = ({navigation}) => {
  const [cityId, setCityId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [communeId, setCommuneId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const showModal = () => {
    setModalVisible(true);
  };
  const saveButtonClicked = () => {
    //save data
  };
  return (
    <>
      <View style={[{flex: 1}, modalVisible ? {opacity: 0.3} : {}]}>
        <CreateAddressForm
          navigation={navigation}
          setCityId={setCityId}
          cityId={cityId}
          isAddAddress={false}
          saveButtonClicked={saveButtonClicked}
          showModal={showModal}
        />
      </View>
      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalRatio={0.35}>
        <Text style={styles.modalText}>
          Bạn có chắc chắn muốn xóa địa chỉ này không?
        </Text>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            style={[styles.button, styles.buttonOpen]}
            onPress={() => console.log('handle this')}>
            <Text style={styles.textStyle}>XÓA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.textStyle}>THOÁT</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
    </>
  );
};
const styles = StyleSheet.create({
  button: {
    width: '40%',
    borderRadius: 20,
    paddingVertical: 10,
  },
  buttonOpen: {
    backgroundColor: '#FEC54B',
  },
  buttonClose: {
    backgroundColor: '#F0F0F0',
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 40,
    textAlign: 'center',
  },
});
export default EditAddressScreen;
