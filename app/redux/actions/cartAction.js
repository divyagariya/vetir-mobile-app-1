import {NoAuthAPI} from '../../services';

export function addToCart({product, productId, size}) {
  return async dispatch => {
    dispatch({
      type: 'ADD_TO_CART',
      value: {
        product,
        productId,
        size,
      },
    });
  };
}

export function increment({product, productId}) {
  return dispatch => {
    dispatch({
      type: 'CART_INCREMENT',
      value: {
        product,
        productId,
      },
    });
  };
}

export function decrement({product, productId}) {
  return dispatch => {
    dispatch({
      type: 'CART_DECREMENT',
      value: {
        product,
        productId,
      },
    });
  };
}

export function resetCart() {
  return dispatch => {
    dispatch({
      type: 'CART_RESET',
    });
  };
}

export function getCartData(id) {
  return async (dispatch, getState) => {
    let apiPath = '';
    if (id) {
      apiPath = `getOutfitDetails?userId=${id}`;
    } else {
      apiPath = `getOutfitDetails?userId=${getState().AuthReducer.userId}`;
    }
    const apiResponse = await NoAuthAPI(apiPath, 'GET');
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'GET_OUTFIT', value: apiResponse?.outfitList});
    }
  };
}
