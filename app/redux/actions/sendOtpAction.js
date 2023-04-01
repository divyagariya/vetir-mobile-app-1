import {NoAuthAPI} from '../../services';

export function sendOtp(data) {
  return async dispatch => {
    const apiResponse = await NoAuthAPI('sendOtp', 'POST', data);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'SEND_OTP', value: apiResponse});
    }
  };
}

export function verifyOtp(data) {
  return async dispatch => {
    const apiResponse = await NoAuthAPI('verifyOtp', 'POST', data);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'VERIFY_OTP', value: apiResponse});
    }
  };
}
