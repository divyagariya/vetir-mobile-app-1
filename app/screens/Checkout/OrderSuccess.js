import React, {useEffect, useRef, useState} from 'react';
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
import {Colors} from '../../colors';
import {
  VText,
  VView,
  Buttons,
  Header,
  OverlayModal,
  Loader,
} from '../../components';
import CheckBox from '@react-native-community/checkbox';
import {FONTS_SIZES} from '../../fonts';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {
  addDataInCloset,
  deleteClosetData,
  getClosetData,
} from '../../redux/actions/closetAction';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-simple-toast';
import Share from 'react-native-share';
import {getProductDetailsApi} from '../../redux/actions/homeActions';
import {
  dislikeProductAction,
  recommendedAction,
} from '../../redux/actions/stylistAction';
import dynamicLinks, {firebase} from '@react-native-firebase/dynamic-links';
import {NoAuthAPI} from '../../services';
import {RenderClients} from '../CategoryScreen';
import ProductCard from './Components/ProductCard';
import CityCreditCard from '../../assets/citiCreditCard.png';
import GooglePay from '../../assets/googlePay.png';
import ApplePay from '../../assets/applePay.png';
import {Styles} from './styles';

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = SLIDER_WIDTH;

const OrderSuccess = props => {
  const [loader, setLoader] = useState(false);
  const productDetails = props?.route?.params?.productDetails;
  const [productCount, setProductCount] = useState(
    props?.route?.params?.productCount,
  );

  return (
    <VView
      style={{
        backgroundColor: Colors.grey1,
        flex: 1,
        paddingBottom: 140,
        paddingTop: 16,
      }}>
      <Header showBack title="Checkout" {...props} />
      <ScrollView bounces={false}>
        <View style={styles.orderSuccess}>
          <View style={{flexDirection: 'row', marginBottom: 4}}>
            <Image
              resizeMode="contain"
              source={require('../../assets/confirmed.webp')}
              style={{width: 16, height: 16, marginRight: 8}}
            />
            <Text style={styles.orderSuccessText}>Order placed, thanks.</Text>
          </View>
          <Text style={Colors.black}>
            Confirmation will be sent by the email.
          </Text>
        </View>
        <View
          style={{marginTop: 4, padding: 16, backgroundColor: Colors.white}}>
          <View style={{marginBottom: 16}}>
            <Text style={{color: Colors.black60, marginBottom: 4}}>
              Order ID: 8476523{' '}
            </Text>
            <Text style={{color: Colors.black60}}>
              Placed on 10/4/23 at 10:21am
            </Text>
          </View>
          <View>
            <Text style={{color: Colors.black, marginBottom: 4}}>
              Delivery address{' '}
            </Text>
            <Text style={{color: Colors.black60}}>
              30 E 62nd St 9DE New York 100658 NY
            </Text>
          </View>
        </View>
        <View style={Styles.btncontainer}>
          <TouchableOpacity style={Styles.reOrderBtn}>
            <Image
              style={Styles.icon}
              source={require('../../assets/reorder.webp')}
            />
            <Text style={Styles.btnText}>{'Reorder'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={Styles.reOrderBtn}>
            <Image
              style={Styles.icon}
              source={require('../../assets/down.webp')}
            />
            <Text style={Styles.btnText}>{'Invoice'}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 4,
            padding: 16,
            backgroundColor: Colors.white,
            alignItems: 'center',
          }}>
          <Image
            source={{uri: productDetails?.imageUrls?.[0]}}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.flexRow}>
            <Text style={styles.text}>Estimated delivery by </Text>
            <Text style={styles.boldText}>Tomorrow</Text>
          </View>
        </View>
      </ScrollView>
      {loader && <Loader />}
    </VView>
  );
};

export default OrderSuccess;

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
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
    marginRight: 16,
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
  },
  paymentMethodContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  paymentIcon: {height: 20, width: 40, alignSelf: 'center', marginRight: 16},
  orderSuccess: {
    flexDirection: 'column',
    padding: 16,
    backgroundColor: Colors.white,
    marginTop: 4,
  },
  orderSuccessText: {
    color: Colors.tertiary,
    fontSize: FONTS_SIZES.s4,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'auto',
  },
  flexRow: {
    flexDirection: 'row',
  },
  text: {
    color: Colors.black,
    lineHeight: 24,
  },
  boldText: {
    color: Colors.black,
    fontWeight: '700',
    lineHeight: 24,
  },
});
