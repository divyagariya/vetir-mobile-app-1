import React from 'react';
import {Dimensions, Image, View, TouchableOpacity} from 'react-native';
import {Colors} from '../../colors';

const BigImage = ({
  showEdit = false,
  imgSource = '',
  editImage = () => {},
  showWaterMark = false,
}) => {
  return (
    <View
      style={{
        backgroundColor: Colors.grey1,
        width: Dimensions.get('window').width,
        alignItems: 'center',
      }}>
      <Image
        source={
          imgSource ? {uri: imgSource} : require('../../assets/sweatshirt.webp')
        }
        style={{width: '100%', height: 375}}
        resizeMode="contain"
      />
      {showEdit && (
        <TouchableOpacity
          onPress={editImage}
          style={{
            position: 'absolute',
            bottom: 8,
            right: 16,
            padding: 8,
          }}>
          <Image
            source={require('../../assets/pencil.webp')}
            style={{width: 32, height: 32}}
          />
        </TouchableOpacity>
      )}
      <View style={{position: 'absolute', bottom: 10, right: 10}}>
        <Image
          source={require('../../assets/logo.png')}
          style={{width: 55, height: 23}}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default BigImage;
