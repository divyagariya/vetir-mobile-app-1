
export function addToCart({ product, productId }) {
  console.log('in action, ', product, productId)
  return async dispatch => {
    dispatch({
      type: 'ADD_TO_CART', value: {
        product,
        productId
      }
    });
  };
}

export function increment({ product, productId }) {
  console.log('in action increment ', product, productId)
  return dispatch => {
    dispatch({
      type: 'CART_INCREMENT', value: {
        product,
        productId
      }
    });
  };
}

export function decrement({ product, productId }) {
  console.log('in action decrement ', product, productId)
  return dispatch => {
    dispatch({
      type: 'CART_DECREMENT', value: {
        product,
        productId
      }
    });
  };
}
