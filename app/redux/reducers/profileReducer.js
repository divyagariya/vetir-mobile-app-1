const initialState = {
  userProfileResponse: {},
  udpateProfileRepose: {},
  deleteAccountResponse: {},
  preferencesQsResponse: [],
  preferencesAnswersResp: [],
  submitPrefResp: [],
};

const ProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PROFILE_DATA': {
      return {
        ...state,
        userProfileResponse: action.value,
      };
    }
    case 'PROFILE_DATA_UPDATED': {
      return {
        ...state,
        udpateProfileRepose: action.value,
      };
    }
    case 'ACOOUNT_DELETE': {
      return {
        ...state,
        deleteAccountResponse: action.value,
      };
    }
    case 'PREFERENCES_QS': {
      return {
        ...state,
        preferencesQsResponse: action.value,
      };
    }
    case 'PREFERENCES_ANSWERS': {
      return {
        ...state,
        preferencesAnswersResp: action.value,
      };
    }
    case 'SUBMIT_PREFERENCES': {
      return {
        ...state,
        submitPrefResp: action.value,
      };
    }
    default:
      return state;
  }
};

export default ProfileReducer;
