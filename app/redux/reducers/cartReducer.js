const cartItems = []

const initialState = {
  cartItems
};

const CartReducer = (state = initialState, action) => {
  console.log('in reducer', action)
  switch (action.type) {
    case 'ADD_TO_CART': {
      console.log('ADD_TO_CART', action.value)
      let { product, productId } = action.value
      let cartItemsCopy = [...cartItems]
      if(cartItemsCopy.find(prod => prod.product.id === productId)) {

      } else {
        cartItemsCopy.push({
          product,
          count: 1
        })
      }
      return {
        ...state,
        cartItems: cartItemsCopy
      }
    }
    case 'CART_INCREMENT': {
      console.log('CART_INCREMENT', action.value)
      let { product, productId } = action.value
      return {
        ...state,
        [productId]: {
          ...state[productId],
          count: state[productId].count + 1
        }
      };
    }
    case 'CART_DECREMENT': {
      console.log('CART_DECREMENT', action.value)
      let { product, productId } = action.value
      if (state[productId].count === 1) {
        let copyCartData = { ...state }
        Reflect.deleteProperty(copyCartData, productId)
        return copyCartData
      }
      return {
        ...state,
        [productId]: {
          ...state[productId],
          count: state[productId].count - 1
        }
      };
    }
    default:
      return state;
  }
};

export default CartReducer;
