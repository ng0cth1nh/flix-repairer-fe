export const numberWithCommas = inputNumber => {
  let formattedNumber = Number(inputNumber)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,');
  let splitArray = formattedNumber.split('.');
  if (splitArray.length > 1) {
    formattedNumber = splitArray[0];
  }
  return formattedNumber;
};
export const getFileNameFromPath = path => {
  return path.replace(/^.*[\\\/]/, '');
};
export const getDiffTimeBetweenTwoDate = (startDate, endDate) => {
  var difference = endDate.getTime() - startDate.getTime();
  if (difference < 60000) {
    return 'Vừa xong';
  } else if (difference < 60000 * 60) {
    return Math.floor(difference / 60000) + ' phút trước';
  } else if (difference < 60000 * 60 * 24) {
    return Math.floor(difference / (60000 * 60)) + ' giờ trước';
  } else if (difference < 60000 * 60 * 24 * 30) {
    return Math.floor(difference / (60000 * 60 * 24)) + ' ngày trước';
  } else if (difference < 60000 * 60 * 24 * 365) {
    return Math.floor(difference / (60000 * 60 * 24 * 30)) + ' tháng trước';
  } else {
    return Math.floor(difference / (60000 * 60 * 24 * 365)) + ' năm trước';
  }
};
export const RequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  CANCELLED: 'CANCELLED',
  DONE: 'DONE',
  FIXING: 'FIXING',
  PAYMENT_WAITING: 'PAYMENT_WAITING',
};
