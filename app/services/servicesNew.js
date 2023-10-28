import Toast from 'react-native-simple-toast';

const baseUrl =
  'http://65.0.99.221:9090/user/v1/';

let NoAuthAPI = (apiName, apiMethod, data, baseUrlParam = baseUrl) => {
  let init =
    apiMethod === 'GET'
      ? {
          method: 'GET',
        }
      : apiMethod === 'POST'
      ? {
          method: apiMethod,
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      : {
          method: apiMethod,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        };
  console.log(
    '@@ url',
    JSON.stringify({url: baseUrl + apiName, data}, undefined, 2),
  );
  return fetch(baseUrlParam + apiName, init)
    .then(response => response.json())
    .then(responseData => {
      if (responseData) {
        return responseData;
      }
      // if (responseData.data.statusCode === 200) {
      //   return responseData.data;
      // } else {
      //   Toast.show(responseData?.data?.statusMessage);
      //   return responseData.data;
      // }
    })
    .catch(err => {
      console.warn('err', err);
      Toast.show('Server encounter an error, please try after some time');
      return false;
    });
};

export {NoAuthAPI};
