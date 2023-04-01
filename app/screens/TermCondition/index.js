import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {WebView} from 'react-native-webview';

const TermConditions = props => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        style={{position: 'absolute', top: 16, right: 16, zIndex: 999}}
        onPress={() => props.navigation.goBack()}>
        <Image
          source={require('../../assets/cross.webp')}
          style={{width: 44, height: 44}}
        />
      </TouchableOpacity>
      <View style={{width: '100%', height: '100%'}}>
        <WebView
          source={{
            uri: 'https://se53mwfvog.execute-api.ap-south-1.amazonaws.com/dev/api/terms_and_conditions',
          }}
        />
      </View>
    </View>
  );
};

export default TermConditions;
