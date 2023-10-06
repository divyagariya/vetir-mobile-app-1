const cartItems = {};

const initialState = {};

const CartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      let { product, productId, size } = action.value;
      const copyState = {...state}
      copyState[productId] = {
        data: product,
        size: size,
        count: 1
      }
      return copyState
    }
    case 'CART_INCREMENT': {
      let {product, productId} = action.value;
      let copyState = {...state}
      copyState[productId].count = copyState[productId].count + 1
      return copyState
    }
    case 'CART_DECREMENT': {
      let {product, productId} = action.value;
      let copyState = {...state}
      copyState[productId].count = copyState[productId].count - 1
      if(copyState[productId].count < 1 ) {
        Reflect.deleteProperty(copyState, productId)
      }
      return copyState
    }
    case 'CART_RESET': {
      console.log('herer in cart reset')
      return {...initialState}
    }
    default:
      return state;
  }
};

export default CartReducer;
