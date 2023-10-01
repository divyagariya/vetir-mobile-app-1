import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
  Linking,
  Alert,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Colors } from '../../colors';
import {
  VText,
  VView,
  Buttons,
  Header,
  OverlayModal,
  Loader,
} from '../../components';
import { FONTS_SIZES } from '../../fonts';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import {
  addDataInCloset,
  deleteClosetData,
  getClosetData,
} from '../../redux/actions/closetAction';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';
import Share from 'react-native-share';
import { getProductDetailsApi } from '../../redux/actions/homeActions';
import {
  dislikeProductAction,
  recommendedAction,
} from '../../redux/actions/stylistAction';
import dynamicLinks, { firebase } from '@react-native-firebase/dynamic-links';
import { NoAuthAPI } from '../../services';
import { RenderClients } from '../CategoryScreen';
import ProductCard from './Components/ProductCard';

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = SLIDER_WIDTH;

const Checkout = props => {
  const [loader, setLoader] = useState(false);
  const productDetails = props?.route?.params?.productDetails
  const [productCount, setProductCount] = useState(props?.route?.params?.productCount)


  console.log('productDetails', productDetails)

  //   {
  //     "addedToCloset": true,
  //     "brandId": "113",
  //     "brandName": "Gucci",
  //     "categoryId": 3000,
  //     "categoryName": "Handbags",
  //     "closetItemId": "65195863cd600de7936eae5f",
  //     "createdOn": "2023-07-12T21:08:43.724Z",
  //     "imageUrls": [
  //         "https://stylistadminassets.s3-ap-south-1.amazonaws.com/219214945880997980-541549146797745600.png",
  //         "https://stylistadminassets.s3-ap-south-1.amazonaws.com/283589718000285540-469473925456800100.png",
  //         "https://stylistadminassets.s3-ap-south-1.amazonaws.com/342030692484385900-546296911536339200.png",
  //         "https://stylistadminassets.s3-ap-south-1.amazonaws.com/553135313936587300-68155537917823140.png",
  //         "https://stylistadminassets.s3-ap-south-1.amazonaws.com/919309433432204500-513958510811428160.png"
  //     ],
  //     "isDisliked": null,
  //     "note": "",
  //     "productButtonLink": "https://www.luisaviaroma.com/en-us/p/gucci/women/78I-XHU112?ColorId=OTAyMg2&lvrid=_p_d386_gw&__s=NjIxNzMwNQ",
  //     "productColor": "white",
  //     "productColorCode": "#ffffff",
  //     "productDescription": "The Interlocking G motif draws inspiration from the past and present. Featuring diagonal matelassé leather, the concentric heart-shaped design gives this mini shoulder bag a whimsical twist. White diagonal matelassé leather",
  //     "productId": "64af165b14d3490c1d71cbdd",
  //     "productName": "Gucci Heart Leather Shoulder Bag",
  //     "productPrice": 2250,
  //     "productSizes": [
  //         "One Size"
  //     ],
  //     "seasons": [
  //         "Spring",
  //         "Summer",
  //         "Winter"
  //     ],
  //     "subCategoryId": 3006,
  //     "subCategoryName": "Shoulder Bags",
  //     "vendorWhatsappNumber": "9179133131"
  // }
  return (
    <VView
      style={{
        backgroundColor: 'white',
        flex: 1,
        paddingBottom: 140,
        paddingTop: 16,
      }}>
      <Header
        showBack
        title="Checkout"
        {...props}
      />
      <ScrollView bounces={false}>
        <ProductCard 
          productDetails={productDetails} 
          productCount={productCount}
          onDecrement={() => {
            setProductCount(previous => previous - 1)
          }}
          onIncrement={() => {
            setProductCount(previous => previous + 1)
          }}
          removeItemFromCart={() => {}}
        />
        <View testID='deliveryAddress' style={{ padding: 16, marginBottom: 4 }}>
          <View style={styles.flexRow}>
            <Text style={styles.text}>Deliver To: </Text>
            <Text style={styles.boldText}>Kate Davidson Hudson</Text>
          </View>
          <Text style={styles.textLightBlack}>30 E 62nd St 9DE New York 100658 NY</Text>
        </View>
        <View testID='cartTotal' style={{ padding: 16, marginBottom: 4 }}>
          <View style={styles.justifyBetween}>
            <Text style={styles.text}>Item Total</Text>
            <Text style={styles.text}>${productDetails?.productPrice * productCount}</Text>
          </View>
          <View style={styles.justifyBetween}>
            <Text style={styles.text}>Discount</Text>
            <Text style={styles.greenText}>-$130</Text>
          </View>
          <View style={styles.justifyBetween}>
            <Text style={styles.text}>Handling Charge</Text>
            <Text style={styles.text}>$5</Text>
          </View>
          <View style={styles.justifyBetween}>
            <Text style={styles.text}>Delivery Fee</Text>
            <Text style={styles.text}>$35</Text>
          </View>
          <View style={styles.justifyBetween}>
            <Text style={styles.text}>Total</Text>
            <Text style={styles.text}>${(productDetails?.productPrice * productCount) - 130 - 5 - 35}</Text>
          </View>
        </View>
        <View style={{
          margin: 16
        }}>
          <Buttons
            onPress={() => { 
              props.navigation.navigate('PlaceOrder', {
                productDetails,
                productCount
              })
            }}
            text={'Place order'}
          />
        </View>
      </ScrollView>
      {loader && <Loader />}
    </VView>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row'
  },
  justifyBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: Colors.grey1,
    borderRadius: 8,
    marginRight: 16,
  },
  productCard: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 16,
  },
  productInfo: {
    lineHeight: 24,
  },
  image: {
    width: 48,
    height: 64,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
  },
  subitleStyle: {
    color: Colors.black60,
    marginTop: 4,
    marginBottom: 16,
  },
  titleStyle: {
    marginTop: 4,
  },
  text: {
    color: Colors.black,
    lineHeight: 24,
  },
  greenText: {
    color: Colors.green,
    lineHeight: 24,
  },
  textLightBlack: {
    color: Colors.black60,
    lineHeight: 24,
  },
  boldText: {
    color: Colors.black,
    fontWeight: '700',
    lineHeight: 24,
  }
});
