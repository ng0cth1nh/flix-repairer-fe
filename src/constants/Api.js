const ApiConstants = {
  LOGIN_API: 'http://10.0.2.2:8080/api/v1/login',
  REGISTER_API: 'http://10.0.2.2:8080/api/v1/register/customer',
  CONFIRM_OTP_API: 'http://10.0.2.2:8080/api/v1/register/customer/confirm',
  REFRESH_TOKEN_API: 'http://10.0.2.2:8080/api/v1/token/refresh',
  GET_ALL_CITY_API: 'http://10.0.2.2:8080/api/v1/address/city',
  GET_DISTRICT_BY_CITY_API: 'http://10.0.2.2:8080/api/v1/address/district',
  GET_COMMUNE_BY_DISTRICT_API: 'http://10.0.2.2:8080/api/v1/address/commune',
};
export default ApiConstants;
