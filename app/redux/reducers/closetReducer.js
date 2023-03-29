const initialState = {
  brandData: {},
  categoryData: {},
  addClosetResponse: {},
  getcloset: [],
  singleClosetReponse: {},
  deleteClosetResponse: {},
  editClosetResponse: {},
  removeBgResponse: {},
  getFilterClosetResponse: [],
  getColorsResponse: [],
  getSizeResponse: [],
  brandData2: [],
};

const ClosetReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_BRANDS': {
      return {
        ...state,
        brandData: action.value,
      };
    }
    case 'GET_ADMIN_BRANDS': {
      return {
        ...state,
        brandData2: action.value,
      };
    }
    case 'GET_CATEGORY': {
      return {
        ...state,
        categoryData: action.value,
      };
    }
    case 'CLOSET_DATA': {
      return {
        ...state,
        getcloset: action.value,
      };
    }
    case 'ADD_TO_CLOSET': {
      return {
        ...state,
        addClosetResponse: action.value,
      };
    }
    case 'SINGLE_CLOSET': {
      return {
        ...state,
        singleClosetReponse: action.value,
      };
    }
    case 'DELETE_CLOSET': {
      return {
        ...state,
        deleteClosetResponse: action.value,
      };
    }
    case 'EDIT_CLOSET': {
      return {
        ...state,
        editClosetResponse: action.value,
      };
    }
    case 'REMOVE_BG_IMAGE': {
      return {
        ...state,
        removeBgResponse: action.value,
      };
    }
    case 'FILTER_CLOSET': {
      return {
        ...state,
        getFilterClosetResponse: action.value,
      };
    }
    case 'GET_COLORS': {
      return {
        ...state,
        getColorsResponse: action.value,
      };
    }
    case 'GET_SIZES': {
      return {
        ...state,
        getSizeResponse: action.value,
      };
    }
    default:
      return state;
  }
};

export default ClosetReducer;
