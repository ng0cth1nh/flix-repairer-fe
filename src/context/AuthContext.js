import createDataContext from './createDataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../RootNavigation';
import {useCallback} from 'react';
import constants from '../constants/Api';
import axios from 'axios';
import qs from 'qs';
import getErrorMessage from '../utils/getErrorMessage';
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
    dispatch({
      type: 'add_error',
      payload: getErrorMessage(err),
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
    dispatch({
      type: 'add_error',
      payload: getErrorMessage(err),
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
    dispatch({
      type: 'add_error',
      payload: getErrorMessage(err),
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
