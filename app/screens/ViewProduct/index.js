import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { cartUtil } from '../../hooks/cart';
import { useCart } from '../../hooks/useCart';
import { addToCart, decrement, increment } from '../../redux/actions/cartAction';

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = SLIDER_WIDTH;

const ViewProduct = props => {
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  let _slider1Ref = useRef(null);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(0);
  const [productData, setProductData] = useState({});
  const [showCheckoutButton, setShowCheckoutButton] = useState(false)
  const [itemCount, setItemCount] = useState(1)
  const addClosetResponse = useSelector(
    state => state.ClosetReducer.addClosetResponse,
  );
  const cartData = useSelector(state => state.CartReducer);
  console.log('cartData', cartData)
  const isStylistUser = useSelector(state => state.AuthReducer.isStylistUser);
  const userId = useSelector(state => state.AuthReducer.userId);
  const deleteClosetResponse = useSelector(
    state => state.ClosetReducer.deleteClosetResponse,
  );
  const dislikeResp =
    useSelector(state => state.StylistReducer.dislikeResp) || {};

  const productDetailResponse = useSelector(
    state => state.HomeReducer.productDetailResponse,
  );
  const [selectedProductImg, setSelectedProductImg] = useState('');
  const [recommendedProductId, setRecommendedProductId] = useState('');
  const [showModal, setModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const recommendedToClientsRes = useSelector(
    state => state.StylistReducer.recommendedToClientsRes,
  );
  const allClientDataRespo = useSelector(
    state => state.StylistReducer.allClientDataRespo,
  );
  const [selectedClients, setSelectedClients] = useState([]);

  useEffect(() => {
    if (Object.keys(recommendedToClientsRes).length) {
      if (recommendedToClientsRes.statusCode === 200) {
        setSelectedClients([]);
        dispatch({ type: 'RECOMMENDED_TO_CLIENTS', value: {} });
        Toast.show('Recommended to client');
      }
    }
  }, [recommendedToClientsRes, dispatch]);

  useEffect(() => {
    if (Object.keys(dislikeResp).length) {
      if (dislikeResp.statusCode === 200) {
        dispatch({ type: 'DISLIKE_PRODUCTS', value: {} });
        dispatch(getProductDetailsApi(productData.productId));
        Toast.show('Not liked');
      }
    }
  }, [dislikeResp, dispatch]);

  useEffect(() => {
    if (Object.keys(productDetailResponse).length) {
      setProductData(productDetailResponse.productDetails);
    }
  }, [productDetailResponse]);

  useEffect(() => {
    if (Object.keys(deleteClosetResponse).length) {
      if (deleteClosetResponse.statusCode === 200) {
        dispatch({ type: 'DELETE_CLOSET', value: {} });
        Toast.show('Removed from closet');
        dispatch(getProductDetailsApi(productData.productId));
        dispatch(getClosetData());
      }
    }
  }, [deleteClosetResponse, dispatch]);

  useEffect(() => {
    if (Object.keys(addClosetResponse).length) {
      if (addClosetResponse.statusCode == 200) {
        dispatch({ type: 'ADD_TO_CLOSET', value: {} });
        dispatch(getProductDetailsApi(productData.productId));
        dispatch(getClosetData());
        Toast.show('Added to closet');
      }
    }
  }, [addClosetResponse, dispatch]);

  useEffect(() => {
    if (props?.route?.params?.data) {
      setProductData(props?.route?.params?.data);
    }
  }, []);

  const _renderItem = ({ item, index }) => {
    return (
      <View style={styles.container} key={index}>
        <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
      </View>
    );
  };

  const sleep = async timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const openLink = async () => {
    const data = {
      name: 'product-referral',
      metaData: {
        productId: productData.productId,
      },
    };
    const response = await NoAuthAPI('event', 'POST', data);
    try {
      const url = productData?.productButtonLink;
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#fff',
          preferredControlTintColor: 'black',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#6200EE',
          secondaryToolbarColor: 'black',
          navigationBarColor: 'black',
          navigationBarDividerColor: 'white',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right',
          },
          headers: {
            'my-custom-header': 'my custom header value',
          },
        });
        await this.sleep(800);
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      // Alert.alert(error.message);
    }
  };

  const addToCloset = () => {
    if (productData.addedToCloset) {
      const data = {
        userId: userId,
        closetItemId: productData?.closetItemId,
      };
      dispatch(deleteClosetData(data));
      return;
    }
    let data = {
      userId: userId,
      categoryId: productData.categoryId,
      subCategoryId: productData.subCategoryId,
      brandId: productData.brandId,
      season: productData.seasons,
      colorCode: [productData.productColorCode],
      itemImageUrl: productData.imageUrls[0],
      isImageBase64: false,
      productId: productData.productId,
    };
    dispatch(addDataInCloset(data));
  };

  const onShare = async () => {
    setLoader(true);
    const link = await dynamicLinks().buildShortLink({
      link: `https://${productData.productId}`,
      ios: {
        bundleId: 'com.app.closet.stylist',
        appStoreId: '1345656565',
      },
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: 'https://vetirstylist1.page.link',
      // optional setup which updates Firebase analytics campaign
      // "banner". This also needs setting up before hand
      analytics: {
        campaign: 'banner',
      },
    });

    const message = 'Please check this out.';

    Share.open({
      message: `${message} ${link}`,
    })
      .then(res => {
        setLoader(false);
        console.log(res);
      })
      .catch(err => {
        setLoader(false);
        err && console.log(err);
      });
  };

  const dislikeProducts = () => {
    const data = {
      productId: productData.productId,
      userId: userId,
      dislike: !productData.isDisliked,
    };
    dispatch(dislikeProductAction(data));
  };

  const recommentToClient = () => {
    setShowClientModal(true);
    setRecommendedProductId(productData.productId);
    setSelectedProductImg(productData.imageUrls[0]);
  };

  const selectClient = item => {
    let selectedClients1 = [...selectedClients];
    if (!selectedClients1.includes(item.userId)) {
      selectedClients1.push(item.userId);
    } else {
      selectedClients1 = selectedClients1.filter(id => id !== item.userId);
    }
    setSelectedClients(selectedClients1);
  };

  const recommendToClients = (note = '') => {
    if (!selectedClients.length) {
      Toast.show('Please select atleast one client');
      return;
    }
    const data = {
      personalStylistId: userId,
      userIds: selectedClients,
      productId: recommendedProductId,
    };
    if (note) {
      data.note = note;
    }

    setShowClientModal(false);
    dispatch(recommendedAction(data));
  };

  const onWhatsappClick = () => {
    Linking.openURL(
      `whatsapp://send?phone=${productData.vendorWhatsappNumber}`,
    ).catch(err => {
      console.log(err.message);
      Toast.show('Something went wrong');
    });
  };

  if (Object.keys(productData).length === 0) {
    return null;
  }
  return (
    <VView
      style={{
        backgroundColor: 'white',
        flex: 1,
        paddingBottom: 140,
        paddingTop: 16,
      }}>
      <VView>
        <Header
          showWhatsapp={productData.vendorWhatsappNumber}
          onWhatsappClick={onWhatsappClick}
          // showAdd={!isStylistUser}
          recommendClients={recommentToClient}
          showRecommend={isStylistUser}
          showLike={!isStylistUser}
          showshare={!isStylistUser}
          onShare={onShare}
          {...props}
          likeImageSrc={
            productData.isDisliked
              ? require('../../assets/iDisliked.webp')
              : productData.isDisliked != undefined
                ? require('../../assets/iDislike.webp')
                : null
          }
          showBack
          addToCloset={addToCloset}
          likeProduct={dislikeProducts}
          imageSrc={
            productData.addedToCloset
              ? require('../../assets/addedCloset.webp')
              : require('../../assets/iAdd.webp')
          }
        />
      </VView>
      <ScrollView>
        <VView
          style={{
            backgroundColor: Colors.grey1,
            height: 350,
            width: '100%',
          }}>
          <Carousel
            loop={true}
            autoplay={true}
            layout="stack"
            layoutCardOffset={9}
            ref={_slider1Ref}
            data={productData.imageUrls}
            renderItem={_renderItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            inactiveSlideShift={0}
            useScrollView={true}
            onSnapToItem={index => setCurrentActiveIndex(index)}
          />
          <Pagination
            dotsLength={productData.imageUrls.length}
            activeDotIndex={currentActiveIndex}
            carouselRef={_slider1Ref}
            dotStyle={styles.dotStyle}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            tappableDots={true}
          />
        </VView>
        <VView style={{ padding: 16 }}>
          <VView>
            <Text
              numberOfLines={1}
              style={{
                fontSize: FONTS_SIZES.s4,
                fontWeight: '700',
                marginBottom: 8,
              }}>
              {productData.brandName}
            </Text>
            <VText
              style={{ fontSize: FONTS_SIZES.s4, fontWeight: '400' }}
              text={productData?.productName}
            />
            <VText
              text={'$' + productData?.productPrice}
              style={{
                fontSize: FONTS_SIZES.s4,
                fontWeight: '400',
                paddingVertical: 8,
                marginBottom: 8,
              }}
            />
            <Text style={styles.titleStyle}>Color</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <Text style={[styles.subitleStyle, { marginRight: 8 }]}>
                {productData.productColor}
              </Text>
              <View
                style={{
                  backgroundColor: productData.productColorCode,
                  width: 12,
                  height: 12,
                }}
              />
            </View>
            <Text style={styles.titleStyle}>Category</Text>
            <Text style={styles.subitleStyle}>{productData.categoryName}</Text>
            <Text style={styles.titleStyle}>Sub Category</Text>
            <Text style={styles.subitleStyle}>
              {productData.subCategoryName}
            </Text>
            <Text style={styles.titleStyle}>Brand</Text>
            <Text style={styles.subitleStyle}>{productData.brandName}</Text>
            {productData.seasons && productData.seasons.length > 0 && (
              <>
                <Text style={styles.titleStyle}>Season</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {productData.seasons.map(item => {
                    return (
                      <Text style={[styles.subitleStyle, { marginRight: 4 }]}>
                        {item}
                      </Text>
                    );
                  })}
                </View>
              </>
            )}

            <Text style={styles.titleStyle}>Size</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {productData.productSizes.map(item => {
                return (
                  <Text style={[styles.subitleStyle, { marginRight: 4 }]}>
                    {item}
                  </Text>
                );
              })}
            </View>
            <Text>Description</Text>
            <VText
              style={{ color: Colors.black60, marginBottom: 16, marginTop: 8 }}
              text={productData.productDescription}
            />
            {productData.note ? (
              <>
                <Text>Note from the Stylist</Text>
                <VText
                  style={{
                    color: Colors.black60,
                    marginBottom: 16,
                    marginTop: 8,
                  }}
                  text={productData.note}
                />
              </>
            ) : null}
          </VView>
        </VView>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 12,
          width: '100%',
          backgroundColor: '#fff',
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowRadius: 4,
          shadowOpacity: 0.16,
        }}>
        {showCheckoutButton ? (
          <View style={{
            flexDirection: "row",
            justifyContent: 'space-between',
            marginBottom: 8,
            gap: 8,
          }}>
            <View style={{
              flexDirection: "row",
              padding: 8,
              borderRadius: 8,
              gap: 16,
              borderWidth: 1,
              borderColor: Colors.tertiary,
              backgroundColor: Colors.tertiaryLight,
              width: '49%',
              justifyContent: 'center',
              alignItems: 'center',
              height: 56,
            }}>
              <Pressable style={{
                paddingHorizontal: 8,
                minWidth: 24,
              }} onPress={() => {
                if (itemCount <= 1) {
                  setShowCheckoutButton(false)
                  setItemCount(0)
                  return
                }
                setItemCount(current => current - 1)
                dispatch(decrement({ productId: productData.productId }))
              }}>
                <Text style={{ color: Colors.tertiary, fontSize: 20 }}>-</Text>
              </Pressable>
              <View style={{
                paddingHorizontal: 8,
              }}>
                <Text style={{ color: Colors.tertiary, fontSize: 20 }}>{itemCount}</Text>
              </View>
              <Pressable style={{
                paddingHorizontal: 8,
                minWidth: 24,
              }} onPress={() => {
                dispatch(increment({ productId: productData.productId }))
                setItemCount(current => current + 1)
              }}>
                <Text style={{ color: Colors.tertiary, fontSize: 20 }}>+</Text>
              </Pressable>
            </View>
            <Pressable style={{
              flexDirection: "row",
              padding: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: Colors.tertiary,
              backgroundColor: Colors.tertiary,
              width: '49%',
              justifyContent: 'center',
              alignItems: 'center',
              height: 56,
            }} onPress={() => {
              props.navigation.navigate('Checkout', {
                productDetails: productData,
                productCount: itemCount,
              })
            }}>
              <Text style={{
                color: Colors.white,
                fontSize: 14,
                fontWeight: '700',
              }}>Checkout</Text>
            </Pressable>
          </View>
        ) : (
          <Buttons text="Buy Now" onPress={() => {
            dispatch(addToCart({
              product: productData,
              productId: productData.productId
            }))
            // dispatch({ 
            //   type: 'ADD_TO_CART', 
            //   value: {
            //     product: productData,
            //     productId: productData.productId
            //   }
            // });
            setItemCount(1)
            setShowCheckoutButton(true)
          }} />
        )}
        <Buttons
          isInverse
          imageIcon={
            productData.addedToCloset
              ? require('../../assets/addedCloset.webp')
              : require('../../assets/iAdd.webp')
          }
          onPress={addToCloset}
          text={productData.addedToCloset ? 'Added to closet' : 'Add to closet'}
        />
      </View>
      {showClientModal && (
        <OverlayModal
          isScrollEnabled={false}
          showModal={showClientModal}
          component={
            <RenderClients
              setShowClientModal={setShowClientModal}
              selectClient={selectClient}
              selectedClients={selectedClients}
              recommendToClients={recommendToClients}
              selectedProductImg={selectedProductImg}
            />
          }
        />
      )}
      {loader && <Loader />}
    </VView>
  );
};

export default ViewProduct;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.grey1,
    borderRadius: 8,
    width: '100%',
    paddingBottom: 16,
  },
  image: {
    width: ITEM_WIDTH,
    height: 300,
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
});
