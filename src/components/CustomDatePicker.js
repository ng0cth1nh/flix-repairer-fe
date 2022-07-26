import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
const CustomDatePicker = ({
  isVisible,
  handleConfirm,
  hideDatePicker,
  minimumDate,
  mode = 'date',
}) => {
  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode={mode}
      onConfirm={handleConfirm}
      onCancel={hideDatePicker}
      minimumDate={minimumDate ? new Date(moment()) : null}
      maximumDate={new Date(moment().add(120, 'days'))}
    />
  );
};

export default CustomDatePicker;
