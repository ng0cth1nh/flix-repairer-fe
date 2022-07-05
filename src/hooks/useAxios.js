import axios from 'axios';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import {useContext} from 'react';
import {Context as AuthContext} from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAxios = () => {
  const {refreshToken} = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL: 'https://flix-lj7prqscta-as.a.run.app/api/v1',
  });

  axiosInstance.interceptors.request.use(async req => {
    let token = await AsyncStorage.getItem('token');
    if (token) {
      const user = jwt_decode(token);
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
      if (!isExpired) {
        return req;
      }
      console.log(refreshToken);
      await refreshToken();
    }

    return req;
  });

  axiosInstance.interceptors.request.use(
    async config => {
      let token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    err => {
      return Promise.reject(err);
    },
  );

  return axiosInstance;
};

export default useAxios;
