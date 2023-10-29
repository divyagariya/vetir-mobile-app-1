import {FlatList, Image, Text, TouchableHighlight, View} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import CartComponent from './components/CartComponent';
import {FONTS_SIZES} from '../../fonts';
import {Header} from '../../components';
import {getCartData} from '../../redux/actions/cartAction';
import {useEffect} from 'react';

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
  const userId = useSelector(state => state.AuthReducer.userId);
  const cart = useSelector(state => state.CartReducer.cartItems);
  const dispatch = useDispatch();

  console.log('cart', cart);

  useEffect(() => {
    dispatch(getCartData());
  }, []);

  const showCartList = ({item, index}) => {
    return <CartComponent item={item} />;
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.01)',
      }}>
      <Header showBack title="Cart" {...props} />
      <FlatList
        data={cart}
        keyExtractor={(item, index) => index.toString()}
        renderItem={showCartList}
        style={{
          marginTop: 20,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: '5%',
          left: 0,
          right: 0,
          paddingVertical: 12,
          paddingHorizontal: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text
            style={{
              fontSize: FONTS_SIZES.s3,
              color: 'rgba(0,0,0,0.4)',
            }}>
            Total Amount
          </Text>
          <Text
            style={{
              fontSize: FONTS_SIZES.s3,
              fontWeight: '700',
            }}>
            $1230
          </Text>
        </View>
        <TouchableHighlight
          style={{
            paddingHorizontal: 16,
            justifyContent: 'center',
            backgroundColor: 'black',
            borderRadius: 8,
            paddingVertical: 10,
          }}>
          <Text style={{color: 'white', fontSize: FONTS_SIZES.s2}}>
            Select Address
          </Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default CartScreen;
