import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
const CustomDatePicker = ({
  isVisible,
  handleConfirm,
  hideDatePicker,
  mode = 'date',
}) => {
  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode={mode}
      onConfirm={handleConfirm}
      onCancel={hideDatePicker}
      minimumDate={new Date(moment())}
      maximumDate={new Date(moment().add(120, 'days'))}
    />
  );
};

export default CustomDatePicker;
