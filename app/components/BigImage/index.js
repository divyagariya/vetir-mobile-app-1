import React from 'react';
import {Dimensions, Image, View, TouchableOpacity} from 'react-native';
import {Colors} from '../../colors';

const BigImage = ({showEdit = false, imgSource = '', editImage = () => {}}) => {
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
    </View>
  );
};

export default BigImage;
