import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ActivityIndicator, Image, TouchableOpacity, View} from 'react-native';

import WebView from 'react-native-webview';

const StoriesView = props => {
  let {webViewURL} = props?.route?.params;
  console.log('Props----------', webViewURL);

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
      {isLoader && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '10%',
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99,
          }}>
          <ActivityIndicator size={'large'} color={'black'} />
        </View>
      )}
      <WebView
        onLoadStart={() => showLoader()}
        onLoad={() => hideLoader()}
        onLoadProgress={() => hideLoader()}
        source={{
          uri: webViewURL,
        }}
        style={{flex: 1}}
      />
    </>
  );
};

export default StoriesView;
