import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ActivityIndicator, Image, TouchableOpacity, View} from 'react-native';

import WebView from 'react-native-webview';

const AddProducts = () => {
  const navigation = useNavigation();
  const [isLoader, setIsLoader] = useState(false);

  const showLoader = () => {
    setIsLoader(true);
  };
  const hideLoader = () => {
    setIsLoader(false);
  };

  return (
    <>
      <View style={{padding: 16, backgroundColor: 'white'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            resizeMode="contain"
            source={require('../../assets/iBack.webp')}
            style={{width: 32, height: 32}}
          />
        </TouchableOpacity>
      </View>
      {isLoader && <ActivityIndicator size={'large'} />}
      <WebView
        onLoadStart={() => showLoader()}
        onLoad={() => hideLoader()}
        source={{
          uri: 'https://vetir-admin.netlify.app/#/add-product-by-stylist',
        }}
        style={{flex: 1}}
      />
    </>
  );
};

export default AddProducts;
