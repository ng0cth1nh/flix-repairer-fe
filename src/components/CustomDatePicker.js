import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
const CustomDatePicker = props => {
  return (
    <DateTimePickerModal
      isVisible={props.isVisible}
      mode="datetime"
      onConfirm={props.handleConfirm}
      onCancel={props.hideDatePicker}
      minimumDate={new Date(moment())}
      maximumDate={new Date(moment().add(120, 'days'))}
    />
  );
};

export default CustomDatePicker;
