const initialState = {
  loginResponse: {},
  signupResponse: {},
  userId: '',
  isProfileCreated: false,
  googleLoginResponse: {},
  appleLoginResponse: {},
  stylistUserId: '',
  isStylistUser: false,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN': {
      return {
        ...state,
        loginResponse: action.value,
      };
    }
    case 'USERID': {
      return {
        ...state,
        userId: action.value,
      };
    }
    case 'IS_STYLIST': {
      return {
        ...state,
        isStylistUser: action.value,
      };
    }
    case 'STYLIST_USERID': {
      return {
        ...state,
        stylistUserId: action.value,
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        loginResponse: {},
        userId: null,
        isProfileCreated: false,
        userProfileResponse: {},
        udpateProfileRepose: {},
      };
    }
    case 'SIGNUP': {
      return {
        ...state,
        signupResponse: action.value,
      };
    }
    case 'IS_PROFILE_CREATED': {
      return {
        ...state,
        isProfileCreated: action.value,
      };
    }
    case 'GOOGLE_LOGIN': {
      return {
        ...state,
        googleLoginResponse: action?.value,
      };
    }
    case 'APPLE_LOGIN': {
      return {
        ...state,
        appleLoginResponse: action?.value,
      };
    }
    default:
      return state;
  }
};

export default AuthReducer;
