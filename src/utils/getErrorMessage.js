import Error from '../constants/Error';
export default err => {
  return Error[err.response.data.message]
    ? Error[err.response.data.message]
    : err.response.status >= 500
    ? 'Hệ thống đang gặp sự cố! Vui lòng thử lại sau'
    : 'Yêu cầu không hợp lệ! Vui lòng thử lại sau';
};
