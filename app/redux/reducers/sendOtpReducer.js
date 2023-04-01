const initialState = {
  otpResponse: {},
  verifyOtpResponse: {},
};

const OtpReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SEND_OTP': {
      return {
        ...state,
        otpResponse: action.value,
      };
    }
    case 'VERIFY_OTP': {
      return {
        ...state,
        verifyOtpResponse: action.value,
      };
    }
    default:
      return state;
  }
};

export default OtpReducer;
