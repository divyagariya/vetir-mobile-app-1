import React, {useState} from 'react';
import {View, Text, FlatList, Image, TouchableHighlight} from 'react-native';
import {Header} from '../../components';
import {FONTS_SIZES} from '../../fonts';

const cartData = [
  {
    product: {
      brandId: 'string',
      brandName: 'AQUAZZURA',
      categoryId: 0,
      categoryName: 'string',
      createdOn: '2023-10-28T15:48:46.381Z',
      id: {
        date: '2023-10-28T15:48:46.381Z',
        timestamp: 0,
      },
      imageUrls: [
        'https://m.media-amazon.com/images/I/61p9DafTG-L._SL1001_.jpg',
      ],
      productButtonLink: 'string',
      productColor: 'string',
      productDescription: 'Whisper 50 metallic leather sandals',
      productName: 'string',
      productPrice: 1300,
      productSizes: ['Small'],
      productStatus: 'string',
      seasons: ['string'],
      subCategoryId: 0,
      subCategoryName: 'string',
      updatedOn: '2023-10-28T15:48:46.382Z',
      vendorId: 'string',
      vendorName: 'string',
    },
    quantity: 0,
  },
  {
    product: {
      brandId: 'string',
      brandName: 'AQUAZZURA',
      categoryId: 0,
      categoryName: 'string',
      createdOn: '2023-10-28T15:48:46.381Z',
      id: {
        date: '2023-10-28T15:48:46.381Z',
        timestamp: 0,
      },
      imageUrls: [
        'https://m.media-amazon.com/images/I/61p9DafTG-L._SL1001_.jpg',
      ],
      productButtonLink: 'string',
      productColor: 'string',
      productDescription: 'Whisper 50 metallic leather sandals',
      productName: 'string',
      productPrice: 1230,
      productSizes: ['small'],
      productStatus: 'string',
      seasons: ['string'],
      subCategoryId: 0,
      subCategoryName: 'string',
      updatedOn: '2023-10-28T15:48:46.382Z',
      vendorId: 'string',
      vendorName: 'string',
    },
    quantity: 0,
  },
];

const CartScreen = props => {
  const [quantity, setQuantity] = useState(1);

  const showCartList = ({item, index}) => {
    let {product} = item;
    return (
      <>
        <View
          style={{
            backgroundColor: 'white',
            padding: 16,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Image
              source={{uri: product?.imageUrls[0]}}
              style={{
                height: 80,
                width: 80,
              }}
            />
            <View
              style={{
                flex: 1,
                padding: 8,
              }}>
              <Text
                style={{
                  fontSize: FONTS_SIZES.s2,
                  fontWeight: '700',
                }}>
                {product?.brandName}
              </Text>
              <Text
                style={{
                  fontSize: FONTS_SIZES.s2,
                }}>
                {product?.productDescription}
              </Text>

              <View
                style={{
                  borderWidth: 1,
                  width: '20%',
                  alignItems: 'center',
                  paddingVertical: 5,
                  marginTop: 10,
                  borderRadius: 8,
                  borderColor: 'rgba(0,0,0,0.1)',
                }}>
                <Text
                  style={{
                    color: 'rgba(0,0,0,0.6)',
                    textTransform: 'capitalize',
                  }}>
                  {product?.productSizes[0]}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            borderColor: 'rgba(0,0,0,0.1)',
            marginTop: 10,
            padding: 16,
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            alignItems: 'center',
          }}>
          <View
            style={{
              borderWidth: 1,
              flexDirection: 'row',
              padding: 10,
              borderRadius: 100,
              alignItems: 'center',
            }}>
            <TouchableHighlight
              style={{
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  fontSize: FONTS_SIZES.s1,
                }}>
                -
              </Text>
            </TouchableHighlight>
            <TouchableHighlight>
              <Text
                style={{
                  fontSize: FONTS_SIZES.s2,
                  textAlignVertical: 'center',
                  paddingHorizontal: 10,
                }}>
                {quantity}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  fontSize: FONTS_SIZES.s1,
                }}>
                +
              </Text>
            </TouchableHighlight>
          </View>
          <Text
            style={{
              fontSize: FONTS_SIZES.s2,
              fontWeight: '700',
            }}>
            ${product?.productPrice}
          </Text>
        </View>
      </>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.01)',
      }}>
      <Header showBack title="Cart" {...props} />
      <FlatList
        data={cartData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={showCartList}
        style={{
          marginTop: 20,
        }}
      />
    </View>
  );
};

export default CartScreen;
