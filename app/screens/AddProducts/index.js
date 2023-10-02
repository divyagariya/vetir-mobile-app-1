import React from 'react';
import {View} from 'react-native';

import WebView from 'react-native-webview';

const AddProducts = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'white', paddingTop: 32}}>
      <WebView
        source={{
          uri: 'https://vetir-admin.netlify.app/#/add-product-by-stylist',
        }}
        style={{flex: 1}}
      />
    </View>
  );
};

export default AddProducts;
