import React from 'react';
import {FlatList, View} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Styles} from './styles';

const ImagePreview = props => {
  const {messages = [], index = 1} = props.route.params;

  //   const images = messages
  //     .filter(message => message.image) // Filter out messages without images
  //     .map(message => ({
  //       url: message.image,
  //     }));
  //   console.warn('images', images);
  //   console.log('images', images);

  return (
    <View style={Styles.container}>
      {/* <ImageViewer
        enableImageZoom
        useNativeDriver
        saveToLocalByLongPress
        // menuContext={{saveToLocal: '保存到本地相册', cancel: '取消'}}
        style={{flex: 1, width: '100%', borderRadius: 10}}
        imageUrls={images}
        index={index}
        backgroundColor={'transparent'}
        enableSwipeDown={true}
        // onSwipeDown={() => setModalVisible(false)}
        renderIndicator={() => null} // Hide the indicator (optional)
      /> */}
    </View>
  );
};
export default ImagePreview;
