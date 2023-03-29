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
        style={{width: '80%', height: 375}}
        resizeMode="contain"
      />
      {showEdit && (
        <TouchableOpacity
          onPress={editImage}
          style={{
            position: 'absolute',
            bottom: 16,
            right: 40,
            padding: 5,
          }}>
          <Image
            source={require('../../assets/pencil.png')}
            style={{width: 32, height: 32}}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BigImage;
