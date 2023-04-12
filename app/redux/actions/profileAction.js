import {NoAuthAPI} from '../../services';

export function getUserProfile() {
  return async (dispatch, getState) => {
    let apiPath = '';
    if (getState().AuthReducer.isStylistUser) {
      apiPath = `getUserDetails?personalStylistId=${
        getState().AuthReducer.userId
      }`;
    } else {
      apiPath = `getUserDetails?userId=${getState().AuthReducer.userId}`;
    }
    const apiResponse = await NoAuthAPI(apiPath, 'GET');
    console.log('profile', apiResponse);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'PROFILE_DATA', value: apiResponse});
      dispatch({
        type: 'IS_PROFILE_CREATED',
        value: apiResponse.isProfileCreated,
      });
    }
  };
}

export function updateUserProfile(data) {
  return async (dispatch, getState) => {
    const apiResponse = await NoAuthAPI('userProfile', 'POST', data);
    console.log('update', apiResponse);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'PROFILE_DATA_UPDATED', value: apiResponse});
      dispatch({
        type: 'IS_PROFILE_CREATED',
        value: apiResponse.isProfileCreated,
      });
    }
  };
}

export function deleteAccount(data) {
  return async (dispatch, getState) => {
    const apiResponse = await NoAuthAPI('deleteAccount', 'POST', data);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'ACOOUNT_DELETE', value: apiResponse});
    }
  };
}

export function getPreferencesQs() {
  return async (dispatch, getState) => {
    const apiResponse = await NoAuthAPI('get/preferences', 'GET');
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'PREFERENCES_QS', value: apiResponse});
    }
  };
}

export function submitPrefernces(data) {
  return async (dispatch, getState) => {
    const apiResponse = await NoAuthAPI('savePreferences', 'POST', data);
    console.log('@@ action', JSON.stringify(apiResponse, undefined, 2));
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'SUBMIT_PREFERENCES', value: apiResponse});
    }
  };
}

export function getPreferencesAnswers() {
  return async (dispatch, getState) => {
    const apiResponse = await NoAuthAPI(
      `userPrefrences?userId=${getState().AuthReducer.userId}`,
      'GET',
    );

    if (Object.keys(apiResponse).length) {
      dispatch({type: 'PREFERENCES_ANSWERS', value: apiResponse.prefrences});
    }
  };
}
