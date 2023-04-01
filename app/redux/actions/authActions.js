import {NoAuthAPI} from '../../services';

export function loginAction(data) {
  return async dispatch => {
    const apiResponse = await NoAuthAPI('login', 'POST', data);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'LOGIN', value: apiResponse});
    }
  };
}

export function storeUserId(data) {
  return async dispatch => {
    dispatch({type: 'USERID', value: data.userId});
    dispatch({
      type: 'IS_PROFILE_CREATED',
      value: data.isProfileCreated,
    });
  };
}

export function googleLoginAction(data) {
  return async dispatch => {
    const response = await NoAuthAPI('googleLogin', 'POST', data);
    if (Object.keys(response).length && response?.statusCode == 200) {
      dispatch({type: 'GOOGLE_LOGIN', value: response});
    }
  };
}
export function appleLoginAction(data) {
  return async dispatch => {
    const response = await NoAuthAPI('appleLogin', 'POST', data);
    if (Object.keys(response).length && response?.statusCode == 200) {
      dispatch({type: 'APPLE_LOGIN', value: response});
    }
  };
}

export function signupAction(data) {
  return async dispatch => {
    const apiResponse = await NoAuthAPI('signUp', 'POST', data);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'SIGNUP', value: apiResponse});
    }
  };
}

export function emptyLoginResponse() {
  return dispatch => {
    dispatch({type: 'LOGIN', value: ''});
  };
}

export function emptyGoogleResponse() {
  return dispatch => {
    dispatch({type: 'GOOGLE_LOGIN', value: {}});
  };
}

export function emptyAppleResponse() {
  return dispatch => {
    dispatch({type: 'APPLE_LOGIN', value: {}});
  };
}
