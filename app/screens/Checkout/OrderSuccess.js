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

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = SLIDER_WIDTH;

const OrderSuccess = props => {
  const [loader, setLoader] = useState(false);
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
});
