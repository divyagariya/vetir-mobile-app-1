import React from 'react';
import {TouchableOpacity, Image, Text} from 'react-native';
import {Colors} from '../../../colors';
import {VView, VText} from '../../../components';
import {FONTS_SIZES} from '../../../fonts';

export default ({
  item,
  index,
  getProductDetails,
  addToCloset,
  deletFromClost,
}) => {
  return (
    <>
      <VView
        style={{
          marginBottom: 16,
          alignSelf: 'center',
          flex: 0.5,
          marginHorizontal: 8,
        }}>
        <TouchableOpacity
          onPress={getProductDetails}
          activeOpacity={0.7}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 13,
            width: '100%',
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={item.addedToCloset ? deletFromClost : addToCloset}>
            {item.addedToCloset ? (
              <Image
                source={require('../../../assets/addedCloset.png')}
                style={{
                  height: 24,
                  width: 24,
                  alignSelf: 'flex-end',
                }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('../../../assets/iAdd.webp')}
                style={{
                  height: 24,
                  width: 24,
                  alignSelf: 'flex-end',
                }}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
          <Image
            source={{uri: item?.imageUrls[0]}}
            resizeMode="contain"
            style={{
              height: 192,
              width: 144,
            }}
          />
        </TouchableOpacity>
        <VView
          style={{
            marginTop: 8,
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: FONTS_SIZES.s4,
              fontWeight: 'bold',
            }}>
            {item.productName}
          </Text>

          <VText
            text={`$${item.productPrice}`}
            style={{
              fontSize: FONTS_SIZES.s4,
            }}
          />
        </VView>
      </VView>
    </>
  );
};
