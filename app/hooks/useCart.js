import React, { useContext, useState } from "react";
import Toast from 'react-native-simple-toast';
import CartContext from "./cart";

export const useCart = (initialCartData) => {

  const cartData = useContext(CartContext)

  const addToCart = async ({ product, productId }) => {
    // if (!message) return
    // return await fetch(baseUrl + 'chat', {
    //   method: 'POST',
    //   body: JSON.stringify([
    //     {
    //       "by": "user",
    //       "message": message
    //     }
    //   ]),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then(response => response.json())
    //   .then(responseData => {
    //     return responseData
    //   })
    //   .catch(err => {
    //     Toast.show('Server encounter an error, please try after some time');
    //     return {
    //       by: 'sdf',
    //       message: 'ula la la'
    //     }
    //   });
    setCartData(cartItems => {
      return {
        ...cartItems,
        [productId]: {
          data: product,
          count: 1
        }
      }
    })
  }

  const onIncrement = ({ productId }) => {
    console.log('onIncrement cartData', cartData)
    setCartData(cartItems => {
      return {
        ...cartItems,
        [productId]: {
          ...cartItems[productId],
          count: cartItems[productId].count + 1
        }
      }
    })
  }

  const onDecrement = ({ productId }) => {
    console.log('onDecrement cartData', cartData)
    if (cartData[productId].count === 1) {
      let copyCartData = { ...cartData }
      Reflect.deleteProperty(copyCartData, productId)
      setCartData(copyCartData)
      return
    }
    setCartData(cartItems => {
      return {
        ...cartItems,
        [productId]: {
          ...cartItems[productId],
          count: cartItems[productId].count - 1
        }
      }
    })
  }

  const resetCartData = () => {
    setCartData({})
  }

  return {
    addToCart,
    onIncrement,
    onDecrement,
    resetCartData,
  }
}