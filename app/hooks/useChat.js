import React from "react";
import Toast from 'react-native-simple-toast';

export const useChat = () => {
  let baseUrl = 'http://13.232.232.32:9090/v1/'
  const sendMessage = async (message) => {
    if (!message) return
    return await fetch(baseUrl + 'chat', {
      method: 'POST',
      body: JSON.stringify([
        {
          "by": "user",
          "message": message
        }
      ]),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        return responseData
      })
      .catch(err => {
        Toast.show('Server encounter an error, please try after some time');
        return {
          by: 'sdf',
          message: 'ula la la'
        }
      });
  }

  return {
    sendMessage
  }
}