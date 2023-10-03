import React from 'react';
import {TouchableOpacity, Image, Text, View} from 'react-native';
import {Colors} from '../../../colors';
import {VView, VText} from '../../../components';
import {FONTS_SIZES} from '../../../fonts';
import {Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width / 2;

const cardHeight = (4 / 3) * screenWidth;

export default ({
  item,
  index,
  getProductDetails,
  addToCloset,
  deletFromClost,
  isStylistUser,
  recommentToClient,
  dislikeProducts,
  onPressChat,
}) => {
  return (
    <>
      <VView style={{flex: 0.5, alignSelf: 'center'}}>
        <View
          style={{
            borderWidth: 1,
            borderColor: Colors.grey1,
          }}>
          <TouchableOpacity
            onPress={getProductDetails}
            activeOpacity={0.7}
            style={{
              width: '100%',
              height: cardHeight,
              alignSelf: 'center',
            }}>
            <Image
              source={{uri: item?.imageUrls[0]}}
              resizeMode="contain" // Use "cover" to fill the container while maintaining the aspect ratio
              style={{
                flex: 1,
              }}
            />
          </TouchableOpacity>
          <VView style={{padding: 8}}>
            {isStylistUser ? (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={item.addedToCloset ? deletFromClost : addToCloset}
                  style={{
                    padding: 8,
                  }}>
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
                <TouchableOpacity
                  onPress={recommentToClient}
                  style={{padding: 8}}>
                  <Image
                    source={require('../../../assets/iRecommend.webp')}
                    style={{
                      height: 24,
                      width: 24,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{padding: 8}}
                  onPress={() => onPressChat(item)}>
                  <Image
                    source={require('../../../assets/chat.webp')}
                    style={{width: 24, height: 24}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={item.addedToCloset ? deletFromClost : addToCloset}
                  style={{padding: 8}}>
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
                <TouchableOpacity
                  style={{padding: 8}}
                  onPress={() => onPressChat(item)}>
                  <Image
                    source={require('../../../assets/chat.webp')}
                    style={{width: 24, height: 24}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{padding: 8}}
                  onPress={dislikeProducts}>
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
            <View style={{padding: 8, paddingTop: 4}}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: FONTS_SIZES.s4,
                  fontWeight: '700',
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
            </View>
          </VView>
        </View>
      </VView>
    </>
  );
};
