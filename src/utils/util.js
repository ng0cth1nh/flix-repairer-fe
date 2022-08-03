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
export const removeAscent = str => {
  if (str === null || str === undefined) {
    return str;
  }
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  return str;
};
export const RequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  CANCELLED: 'CANCELLED',
  DONE: 'DONE',
  FIXING: 'FIXING',
  PAYMENT_WAITING: 'PAYMENT_WAITING',
};

export const FeedbackType = [
  {label: 'Vấn đề về yêu cầu sửa chữa', value: 'REQUEST'},
  {label: 'Vấn đề về voucher', value: 'VOUCHER'},
  {label: 'Vấn đề về bảo hành', value: 'INSURANCE'},
  {label: 'Vấn đề về hóa đơn', value: 'INVOICE'},
  {label: 'Vấn đề về đánh giá thợ', value: 'COMMENT'},
  {label: 'Vấn đề về tài khoản', value: 'ACCOUNT'},
];
