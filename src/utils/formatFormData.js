export const formatFormEncoded = params => {
  var formBody = [];
  for (let key in params) {
    var encodedKey = encodeURIComponent(key);
    var encodedValue = encodeURIComponent(params[key]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');
  return formBody;
};
/* Method just add key text not media file. */
export const formatFormData = params => {
  let formData = new FormData();
  for (let key in params) {
    formData.append(key, params[key]);
  }
  return formData;
};
