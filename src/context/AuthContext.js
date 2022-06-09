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
    await axios.post(constants.REGISTER_API, params);
    RootNavigation.push('ConfirmOTPScreen', {
      phone: params.phone,
      avatar: params.avatar,
    });
  } catch (err) {
    dispatch({
      type: 'add_error',
      payload: 'something wrong with sign up : ' + err.message,
    });
  }
};
const confirmOTP =
  dispatch =>
  async ({phone, otp, avatar}) => {
    const formData = new FormData();
    formData.append('username', phone);
    formData.append('otp', otp);
    formData.append(
      'avatar',
      avatar
        ? {
            uri: avatar.path,
            type: avatar.mime,
            name: avatar.path.split('\\').pop().split('/').pop(),
          }
        : avatar,
    );
    try {
      const response = await axios.post(constants.CONFIRM_OTP_API, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await AsyncStorage.setItem('token', response.data.accessToken);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      dispatch({type: 'login', payload: response.data.accessToken});
    } catch (err) {
      dispatch({
        type: 'add_error',
        payload: 'something wrong OTP : ' + err.message,
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
    if (err.response.status === 403) {
      errMess = 'Đăng nhập thất bại.Tài khoản hoặc mật khẩu không đúng!';
    } else if (err.response.status > 400 && err.response.status < 500) {
      errMess = 'Yêu cầu không hợp lệ!';
    } else {
      errMess = 'Hệ thống đang xảy ra sự cố. Vui lòng thử lại sau!';
    }
    console.log(errMess);
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
