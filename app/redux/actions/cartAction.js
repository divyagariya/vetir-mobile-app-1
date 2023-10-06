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
  console.log('in action increment ', product, productId);
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
  console.log('in action decrement ', product, productId);
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
  console.log('in action reset')
  return dispatch => {
     dispatch({
      type: 'CART_RESET',
    });
  }; 
}
