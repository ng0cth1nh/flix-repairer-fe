import createDataContext from './createDataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../RootNavigation';
import {useCallback} from 'react';
import constants from '../constants/Api';
import axios from 'axios';
import qs from 'qs';
const authReducer = (state, action) => {
  switch (action.type) {
    case 'add_error':
      return {...state, errorMessage: action.payload};
    case 'login':
      return {errorMessage: '', token: action.payload};
    case 'clear_error_message':
      return {...state, errorMessage: ''};
    case 'logout':
      return {token: null, errorMessage: ''};
    default:
      return state;
  }
};
const clearErrorMessage = dispatch => {
  return () => dispatch({type: 'clear_error_message'});
};

const TryLocalLogin = dispatch =>
  useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      dispatch({type: 'login', payload: token});
    }
  }, [dispatch]);

const register = dispatch => async params => {
  try {
    await axios.post(constants.SEND_OTP_API, {phone: params.phone});
    RootNavigation.push('ConfirmOTPScreen', params);
  } catch (err) {
    let errMess;
    switch (err.response.data.message) {
      case 'ACCOUNT_EXISTED':
        errMess = 'Tài khoản đăng kí đã tồn tại!';
        break;
      default:
        errMess = 'Đăng kí không hợp lệ. Vui lòng thử lại sau!';
    }
    dispatch({
      type: 'add_error',
      payload: errMess,
    });
  }
};
const confirmOTP = dispatch => async params => {
  console.log(params);
  const formData = new FormData();
  formData.append('phone', params.phone);
  formData.append('otp', params.otp);
  formData.append(
    'avatar',
    params.avatar
      ? {
          uri: params.avatar.path,
          type: params.avatar.mime,
          name: params.avatar.path.split('\\').pop().split('/').pop(),
        }
      : params.avatar,
  );
  formData.append('fullName', params.fullName);
  formData.append('password', params.password);
  formData.append('cityId', params.cityId);
  formData.append('districtId', params.districtId);
  formData.append('communeId', params.communeId);
  formData.append('streetAddress', params.streetAddress);
  formData.append('roleType', 'ROLE_CUSTOMER');
  try {
    const res = await axios.post(constants.CONFIRM_OTP_API, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    await AsyncStorage.setItem('token', res.data.accessToken);
    await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
    dispatch({type: 'login', payload: res.data.accessToken});
  } catch (err) {
    let errMess;
    switch (err.response.data.message) {
      case 'INVALID_OTP':
        errMess = 'Mã OTP không hợp lệ!';
        break;
      case 'INVALID_PHONE_NUMBER':
        errMess = 'Số điện thoại đăng kí không hợp lệ!';
        break;
      case 'INVALID_PASSWORD':
        errMess = 'Mật khẩu đăng kí không hợp lệ!';
        break;
      case 'INVALID_CITY':
        errMess = 'Địa chỉ thành phố không tồn tại!';
        break;
      case 'INVALID_DISTRICT':
        errMess = 'Địa chỉ Quận/Huyện không tồn tại!';
        break;
      case 'INVALID_COMMUNE':
        errMess = 'Địa chỉ Phường/Xã không tồn tại!';
        break;
      default:
        errMess = 'Đăng kí không hợp lệ. Vui lòng thử lại sau!';
    }
    dispatch({
      type: 'add_error',
      payload: errMess,
    });
  }
};

const refreshToken = dispatch => async () => {
  try {
    const refresh_token = await AsyncStorage.get('refreshToken');
    if (!refresh_token) {
      throw new Error();
    }
    const response = await axios.get(constants.REFRESH_TOKEN_API, {
      headers: {
        Authorization: `Bearer ${refresh_token}`,
      },
    });
    await AsyncStorage.setItem('token', response.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    dispatch({type: 'login', payload: response.data.accessToken});
  } catch (err) {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('kerefreshToken');
    dispatch({type: 'logout'});
  }
};
const login = dispatch => async params => {
  try {
    const response = await axios.post(
      constants.LOGIN_API,
      qs.stringify(params),
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    await AsyncStorage.setItem('token', response.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    dispatch({type: 'login', payload: response.data.accessToken});
  } catch (err) {
    let errMess;
    if (err.response.data.message === 'LOGIN_FAILED') {
      errMess = 'Đăng nhập thất bại.Tài khoản hoặc mật khẩu không đúng!';
    } else {
      errMess = 'Không thể đăng nhập. Vui lòng thử lại sau!';
    }
    dispatch({
      type: 'add_error',
      payload: errMess,
    });
  }
};
const logout = dispatch => async () => {
  await AsyncStorage.removeItem('token');
  dispatch({type: 'logout'});
};
export const {Provider, Context} = createDataContext(
  authReducer,
  {
    login,
    register,
    logout,
    clearErrorMessage,
    TryLocalLogin,
    refreshToken,
    confirmOTP,
  },
  {token: null, errorMessage: ''},
);
