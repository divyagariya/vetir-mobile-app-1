import {NoAuthAPI} from '../../services';
import {NoAuthAPI2} from '../../services/NoAuthAPI';

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
    let apiPath = 'http://65.0.99.221:9090/v1/cart/';
    if (id) {
      apiPath += `${id}`;
    } else {
      apiPath += `${getState().AuthReducer.userId}`;
    }
    const apiResponse = await NoAuthAPI2(apiPath, 'GET', {}, true);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'GET_CART', value: apiResponse});
    }
  };
}

export function incrementCartProduct(productId, quantity) {
  return async (dispatch, getState) => {
    let apiPath = `http://65.0.99.221:9090/v1/cart/update?productId=${productId}&quantity=${quantity}&userId=${
      getState().AuthReducer.userId
    }`;
    const apiResponse = await NoAuthAPI2(apiPath, 'PUT', {}, true);
    if (apiResponse) {
      getCartData();
    } else {
      console.log('ERROR', apiResponse);
    }
  };
}
