const initialState = {
  allClientDataRespo: [],
  addStylistResp: {},
  deleteStylistResp: {},
  recommendedToClientsRes: {},
  recommendedProductsClientsRes: [],
  dislikeResp: {},
  refreshClients: false,
};

const StylistReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ALL_CLIENT_DATA': {
      return {
        ...state,
        allClientDataRespo: action.value,
      };
    }

    case 'ADD_STYLIST': {
      return {
        ...state,
        addStylistResp: action.value,
      };
    }

    case 'DELETE_STYLIST': {
      return {
        ...state,
        deleteStylistResp: action.value,
      };
    }
    case 'RECOMMENDED_TO_CLIENTS': {
      return {
        ...state,
        recommendedToClientsRes: action.value,
      };
    }

    case 'RECOMMENDED_PRODUCTS_CLIENTS': {
      return {
        ...state,
        recommendedProductsClientsRes: action.value,
      };
    }

    case 'DISLIKE_PRODUCTS': {
      return {
        ...state,
        dislikeResp: action.value,
      };
    }

    case 'REFRESH_CLIENTS': {
      return {
        ...state,
        refreshClients: action.value,
      };
    }

    default:
      return state;
  }
};

export default StylistReducer;
