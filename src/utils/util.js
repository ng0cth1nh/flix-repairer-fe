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

export const RequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  CANCELLED: 'CANCELLED',
  DONE: 'DONE',
  FIXING: 'FIXING',
  PAYMENT_WAITING: 'PAYMENT_WAITING',
};
