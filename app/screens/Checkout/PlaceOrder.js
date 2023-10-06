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

const PlaceOrder = props => {
  const productDetails = props?.route?.params?.productDetails;
  const productCount = props?.route?.params?.productCount;
  const itemTotal = props?.route?.params?.itemTotal;
  const [loader, setLoader] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(-1);
  return (
    <VView
      style={{
        backgroundColor: Colors.grey1,
        flex: 1,
        paddingTop: 16,
      }}>
      <Header showBack title="Checkout" {...props} />
      <ScrollView bounces={false}>
        <View
          testID="cartTotal"
          style={{
            padding: 16,
            backgroundColor: Colors.white,
            marginTop: 4,
          }}>
          <View style={styles.justifyBetween}>
            <Text style={styles.text}>Item Total</Text>
            <Text style={styles.text}>
              ${itemTotal}
            </Text>
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
            <Text style={styles.text}>
              ${itemTotal - 130 - 5 - 35}
            </Text>
          </View>
        </View>

        <View>
          <View testID="paymentMethod" style={styles.paymentMethodContainer}>
            <View style={styles.flexRow}>
              <Image source={CityCreditCard} style={styles.paymentIcon} />
              <View>
                <Text style={styles.text}>CITI Credit Card</Text>
                <Text style={styles.textLightBlack}>**** 2030</Text>
              </View>
              <View style={{marginLeft: 'auto', marginRight: 16}}>
                <CheckBox
                  onCheckColor={Colors.black}
                  value={selectedPaymentMethod === 0}
                  onValueChange={() => setSelectedPaymentMethod(0)}
                />
              </View>
            </View>
          </View>
          <View testID="paymentMethod" style={styles.paymentMethodContainer}>
            <View style={styles.flexRow}>
              <Image source={GooglePay} style={styles.paymentIcon} />
              <View>
                <Text style={styles.text}>Google pay</Text>
                <Text style={styles.textLightBlack}>**** 2030</Text>
              </View>
              <View style={{marginLeft: 'auto', marginRight: 16}}>
                <CheckBox
                  value={selectedPaymentMethod === 1}
                  onValueChange={() => setSelectedPaymentMethod(1)}
                />
              </View>
            </View>
          </View>
          <View testID="paymentMethod" style={styles.paymentMethodContainer}>
            <View style={styles.flexRow}>
              <Image source={ApplePay} style={styles.paymentIcon} />
              <View>
                <Text style={styles.text}>Apple pay</Text>
                <Text style={styles.textLightBlack}>**** 2030</Text>
              </View>
              <View style={{marginLeft: 'auto', marginRight: 16}}>
                <CheckBox
                  value={selectedPaymentMethod === 2}
                  onValueChange={() => setSelectedPaymentMethod(2)}
                />
              </View>
            </View>
          </View>
        </View>
        {selectedPaymentMethod !== -1 && (
          <View
            style={{
              margin: 16,
            }}>
            <Buttons
              onPress={() => {
                props.navigation.navigate('OrderSuccess', {
                  productDetails,
                });
              }}
              text={`Pay \$${
                itemTotal - 130 - 5 - 35
              }`}
            />
          </View>
        )}
      </ScrollView>
      {loader && <Loader />}
    </VView>
  );
};

export default PlaceOrder;

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 4,
    padding: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  paymentIcon: {height: 26, width: 40, alignSelf: 'center', marginRight: 16},
});
