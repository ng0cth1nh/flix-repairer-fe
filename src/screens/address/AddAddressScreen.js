import React, {useState} from 'react';
import CreateAddressForm from '../../components/CreateAddressForm';

const AddAddressScreen = ({navigation}) => {
  const [cityId, setCityId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [communeId, setCommuneId] = useState(null);
  return (
    <CreateAddressForm
      navigation={navigation}
      setCityId={setCityId}
      cityId={cityId}
      isAddAddress={true}
    />
  );
};

export default AddAddressScreen;
