import Toast from 'react-native-simple-toast';

export const uploadMediaOnS3 = (dataToSend, imageURL, ref) => {
  fetch(
    'https://se53mwfvog.execute-api.ap-south-1.amazonaws.com/dev/api/uploadChatMedia',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    },
  )
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(responseData => {
      imageURL = responseData?.data?.imageUrl;
      if (ref) {
        ref.onSend(
          {
            image: imageURL,
          },
          true,
        );
      }
    })
    .catch(error => {
      Toast.show('There is some error in image upload');
      console.error('API error:', error);
    });
};

export const getPreSignedUrl = ({ id, type }) => {
  fetch(
    `https://se53mwfvog.execute-api.ap-south-1.amazonaws.com/dev/api/uploadChatVideo?${type}=${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(responseData => {
      console.log('responseData?.data?.presignedUrl', responseData?.data?.presignedUrl)
      return responseData?.data?.presignedUrl;
    })
    .catch(error => {
      Toast.show('There is some error in image upload');
      console.error('API error:', error);
    });
};

