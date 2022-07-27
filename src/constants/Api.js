const ApiConstants = {
  LOGIN_API: 'https://flix-lj7prqscta-as.a.run.app/api/v1/login',
  SEND_OTP_API: 'https://flix-lj7prqscta-as.a.run.app/api/v1/register/sendOTP',
  CONFIRM_OTP_API:
    'https://flix-lj7prqscta-as.a.run.app/api/v1/register/repairer/confirm',
  REFRESH_TOKEN_API:
    'https://flix-lj7prqscta-as.a.run.app/api/v1/token/refresh',
  GET_ALL_CITY_API: 'https://flix-lj7prqscta-as.a.run.app/api/v1/address/city',
  GET_DISTRICT_BY_CITY_API:
    'https://flix-lj7prqscta-as.a.run.app/api/v1/address/district',
  GET_COMMUNE_BY_DISTRICT_API:
    'https://flix-lj7prqscta-as.a.run.app/api/v1/address/commune',
  GET_SERVICES_BY_CATEGORY_API: '/category/services',
  GET_SERVICE_DETAIL_API: '/service/detail',
  PROFILE_INFO_API: '/commonRepairer/profile',
  UPDATE_PROFILE_AVATAR_API: '/user/avatar',
  CHANGE_PASSWORD_API: '/user/changePassword',
  GET_ADDRESS_LIST_API: '/repairer/address/list',
  GET_MAIN_ADDRESS_API: '/repairer/address/main',
  POST_REQUEST_API: '/repairer/request/repair',
  GET_REQUEST_HISTORY_LIST_API: '/repairer/request/histories',
  GET_REQUEST_DETAIL_API: '/repairer/request/detail',
  CANCEL_REQUEST_API: '/repairer/request/cancel',
  CONFIRM_FIXING_REQUEST_API: '/repairer/request/confirmFixing',
  APPROVE_REQUEST_API: '/repairer/request/approve',
  GET_FIXING_REQUEST_API: '/repairer/invoice/fixedService',
  GET_SUGGEST_REQUEST_API: '/commonRepairer/request/list/suggestion',
  GET_FILTERED_REQUEST_API: '/commonRepairer/request/list/filter',
  SEARCH_SERVICE_API: '/category/services/search',
  SEARCH_ACCESSORY_BY_SERVICE_API: '/commonRepairer/accessories',
  SEARCH_SUB_SERVICE_BY_SERVICE_API: '/commonRepairer/subServices',
  GET_FIXED_SERVICE_OF_REQUEST_API: '/confirmedUser/request/fixedService',
  PUT_FIXED_SUB_SERVICE_OF_REQUEST_API: '/repairer/request/fixedSubService',
  PUT_FIXED_EXTRA_SERVICE_OF_REQUEST_API: '/repairer/request/fixedExtraService',
  PUT_FIXED_ACCESSORY_OF_REQUEST_API: '/repairer/request/fixedAccessory',
  POST_INVOICE_API: '/repairer/invoice',
  GET_INVOICE_API: '/confirmedUser/request/invoice',
  GET_USER_INFORMATION: '/user/information',
  CONFIRM_PAYMENT_API: '/repairer/invoice/confirm/paid',
};

export default ApiConstants;
