import React from 'react';
import {TouchableOpacity, Image, Text, View} from 'react-native';
import {Colors} from '../../../colors';
import {VView, VText} from '../../../components';
import {FONTS_SIZES} from '../../../fonts';

export default ({
  item,
  index,
  getProductDetails,
  addToCloset,
  deletFromClost,
  isStylistUser,
  recommentToClient,
  dislikeProducts,
}) => {
  return (
    <>
      <VView
        style={{
          marginBottom: 32,
          alignSelf: 'center',
          flex: 0.5,
          marginHorizontal: 8,
        }}>
        <TouchableOpacity
          onPress={getProductDetails}
          activeOpacity={0.7}
          style={{
            width: '100%',
            height: 218.67,
            alignSelf: 'center',
            backgroundColor: Colors.grey1,
          }}>
          <Image
            source={{uri: item?.imageUrls[0]}}
            resizeMode="contain"
            style={{
              height: 192,
              flex: 1,
            }}
          />
        </TouchableOpacity>
        <VView
          style={{
            marginTop: 8,
          }}>
          {isStylistUser ? (
            <TouchableOpacity
              onPress={recommentToClient}
              style={{marginVertical: 8, marginRight: 8}}>
              <Image
                source={require('../../../assets/iRecommend.webp')}
                style={{
                  height: 24,
                  width: 24,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={item.addedToCloset ? deletFromClost : addToCloset}
                style={{marginVertical: 8, marginRight: 8}}>
                {item.addedToCloset ? (
                  <Image
                    source={require('../../../assets/addedCloset.webp')}
                    style={{
                      height: 24,
                      width: 24,
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require('../../../assets/iAdd.webp')}
                    style={{
                      height: 24,
                      width: 24,
                    }}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={{margin: 8}} onPress={dislikeProducts}>
                {item.isDisliked ? (
                  <Image
                    source={require('../../../assets/iDisliked.webp')}
                    style={{
                      height: 24,
                      width: 24,
                    }}
                    resizeMode="contain"
                  />
                ) : item.isDisliked != undefined ? (
                  <Image
                    source={require('../../../assets/iDislike.webp')}
                    style={{
                      height: 24,
                      width: 24,
                    }}
                    resizeMode="contain"
                  />
                ) : null}
              </TouchableOpacity>
            </View>
          )}
          <Text
            numberOfLines={1}
            style={{
              fontSize: FONTS_SIZES.s4,
              fontWeight: '600',
              marginBottom: 4,
            }}>
            {item.brandName}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: FONTS_SIZES.s4,
              fontWeight: '400',

              marginBottom: 4,
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
