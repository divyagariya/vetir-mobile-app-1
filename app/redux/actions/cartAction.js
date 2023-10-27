import {NoAuthAPI} from '../../services/servicesNew';

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

export function addNewAddress(data) {
  return async dispatch => {
    let url = 'user-profile/address';
    const apiResponse = await NoAuthAPI(
      url,
      'POST',
      data,
      'http://65.0.99.221:9090/user/v1/',
    );
    console.log('addNewAddress', apiResponse);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'ADD_ADDRESS', value: apiResponse});
    }
  };
}

export function getAddressList() {
  return async (dispatch, getState) => {
    let url = `user-profile/address?userId=${getState().AuthReducer.userId}`;
    const apiResponse = await NoAuthAPI(
      url,
      'GET',
      undefined,
      'http://65.0.99.221:9090/user/v1/',
    );
    console.log('getAddressList', apiResponse);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'GET_ADDRESS', value: apiResponse});
    }
  };
}

export function resetCart() {
  return dispatch => {
    dispatch({
      type: 'CART_RESET',
    });
  };
}
