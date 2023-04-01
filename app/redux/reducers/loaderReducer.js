const initialState = {
  isLoading: false,
};

const CommonLoaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'COMMON_LOADER': {
      return {
        ...state,
        isLoading: action.value,
      };
    }
    default:
      return state;
  }
};

export default CommonLoaderReducer;
