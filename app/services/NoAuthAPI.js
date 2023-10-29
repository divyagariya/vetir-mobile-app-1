import Toast from 'react-native-simple-toast';

const baseUrl =
  'https://se53mwfvog.execute-api.ap-south-1.amazonaws.com/dev/api/';

let NoAuthAPI2 = (apiName, apiMethod, data, fullPath = false) => {
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
    JSON.stringify(
      {url: fullPath ? apiName : baseUrl + apiName, data},
      undefined,
      2,
    ),
  );
  return fetch(fullPath ? apiName : baseUrl + apiName, init)
    .then(response => {
      if ([200, 201].includes(response.status)) {
        return response.json();
      } else {
        return false;
      }
    })
    .catch(err => {
      console.warn('err', err);
      // Toast.show('Server encounter an error, please try after some time');
      return false;
    });
};

export {NoAuthAPI2};
