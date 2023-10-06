/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useRef, useState} from 'react';
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
  LayoutAnimation,
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
import {cartUtil} from '../../hooks/cart';
import {useCart} from '../../hooks/useCart';
import {addToCart, decrement, increment, resetCart} from '../../redux/actions/cartAction';
import {Images} from '../../assets';
import {normalize, spV} from '../../utils/normalise';

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = SLIDER_WIDTH;

const sizeArray = [
  {id: 1, value: 'US 37'},
  {id: 2, value: 'US 37.5'},
  {id: 3, value: 'US 38'},
  {id: 4, value: 'US 38.5'},
  {id: 5, value: 'US 39'},
  {id: 6, value: 'US 39.5'},
  {id: 7, value: 'US 40'},
  {id: 8, value: 'US 40.5'},
  {id: 9, value: 'US 41'},
  {id: 10, value: 'US 41.5'},
  {id: 11, value: 'US 42'},
];

const ViewProduct = props => {
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  let _slider1Ref = useRef(null);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(0);
  const [productData, setProductData] = useState({});
  const [showCheckoutButton, setShowCheckoutButton] = useState(false);
  const [itemCount, setItemCount] = useState(1);
  const [showCartModal, setShowCartModal] = useState(false);
  const addClosetResponse = useSelector(
    state => state.ClosetReducer.addClosetResponse,
  );
  const cartData = useSelector(state => state.CartReducer);
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
  const [showSizeModal, setshowSizeModal] = useState(false);
  const [currentSize, setcurrentSize] = useState('');

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
        dispatch({type: 'RECOMMENDED_TO_CLIENTS', value: {}});
        Toast.show('Recommended to client');
      }
    }
  }, [recommendedToClientsRes, dispatch]);

  useEffect(() => {
    if (Object.keys(dislikeResp).length) {
      if (dislikeResp.statusCode === 200) {
        dispatch({type: 'DISLIKE_PRODUCTS', value: {}});
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
        dispatch({type: 'DELETE_CLOSET', value: {}});
        Toast.show('Removed from closet');
        dispatch(getProductDetailsApi(productData.productId));
        dispatch(getClosetData());
      }
    }
  }, [deleteClosetResponse, dispatch]);

  useEffect(() => {
    if (Object.keys(addClosetResponse).length) {
      if (addClosetResponse.statusCode == 200) {
        dispatch({type: 'ADD_TO_CLOSET', value: {}});
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

  const _renderItem = ({item, index}) => {
    return (
      <View style={styles.container} key={index}>
        <Image source={{uri: item}} style={styles.image} resizeMode="contain" />
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
          onBack={() => props.navigation.goBack()}
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
        <VView style={{padding: 16}}>
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
              style={{fontSize: FONTS_SIZES.s4, fontWeight: '400'}}
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
            <TouchableOpacity
              onPress={() => {
                setshowSizeModal(true);
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              }}
              style={{
                width: '100%',
                height: spV(50),
                borderRadius: 4,
                paddingHorizontal: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderColor: Colors.greyBorder,
                borderWidth: 1,
                marginBottom: spV(10),
              }}>
              <Text
                style={{
                  color: currentSize ? Colors.black : Colors.greyText,
                  fontSize: 15,
                }}>
                {currentSize ? currentSize : 'Select Size'}
              </Text>
              <Image
                style={{height: 10, width: 10}}
                source={require('../../assets/drop.webp')}
              />
            </TouchableOpacity>
            <Text style={styles.titleStyle}>Color</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <Text style={[styles.subitleStyle, {marginRight: 8}]}>
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
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {productData.seasons.map(item => {
                    return (
                      <Text style={[styles.subitleStyle, {marginRight: 4}]}>
                        {item}
                      </Text>
                    );
                  })}
                </View>
              </>
            )}

            <Text style={styles.titleStyle}>Size</Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {productData.productSizes.map((item, index) => {
                return (
                  <Text
                    key={index}
                    style={[styles.subitleStyle, {marginRight: 4}]}>
                    {item}
                  </Text>
                );
              })}
            </View>
            <Text>Description</Text>
            <VText
              style={{color: Colors.black60, marginBottom: 16, marginTop: 8}}
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
              gap: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                padding: 8,
                borderRadius: 8,
                gap: 16,
                borderWidth: 1,
                borderColor: Colors.black,
                backgroundColor: Colors.white,
                width: '49%',
                justifyContent: 'center',
                alignItems: 'center',
                height: 56,
              }}>
              <Pressable
                style={{
                  paddingHorizontal: 8,
                  minWidth: 24,
                }}
                onPress={() => {
                  if (itemCount <= 1) {
                    setShowCheckoutButton(false);
                    setItemCount(0);
                    dispatch(decrement({productId: productData.productId}));
                    return;
                  }
                  setItemCount(current => current - 1);
                  dispatch(decrement({productId: productData.productId}));
                }}>
                <Text
                  style={{color: Colors.black, fontSize: 24, lineHeight: 24}}>
                  -
                </Text>
              </Pressable>
              <View
                style={{
                  paddingHorizontal: 8,
                }}>
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: 18,
                    fontWeight: '700',
                    lineHeight: 18,
                  }}>
                  {itemCount}
                </Text>
              </View>
              <Pressable
                style={{
                  paddingHorizontal: 8,
                  minWidth: 24,
                }}
                onPress={() => {
                  dispatch(increment({productId: productData.productId}));
                  setItemCount(current => current + 1);
                }}>
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: 24,
                    lineHeight: 24,
                  }}>
                  +
                </Text>
              </Pressable>
            </View>
            <Pressable
              style={{
                flexDirection: 'row',
                padding: 8,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: Colors.black,
                backgroundColor: Colors.black,
                width: '49%',
                justifyContent: 'center',
                alignItems: 'center',
                height: 56,
              }}
              onPress={() => {
                props.navigation.navigate('Checkout', {
                  productDetails: productData,
                  productCount: itemCount,
                  currentSize: currentSize,
                });
              }}>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Checkout
              </Text>
            </Pressable>
          </View>
        ) : (
          <Buttons
            text="Buy Now"
            onPress={() => {
              if (currentSize == '') {
                Toast.show('Please select size');
              } else {
                dispatch(
                  addToCart({
                    product: productData,
                    productId: productData.productId,
                    size: currentSize
                  }),
                );
                setTimeout(() => {
                  setShowCartModal(true);
                }, 800);
                setItemCount(1);
                setShowCheckoutButton(true);
              }

              // dispatch({
              //   type: 'ADD_TO_CART',
              //   value: {
              //     product: productData,
              //     productId: productData.productId
              //   }
              // });
            }}
          />
        )}
        {/* <Buttons text="Buy Now" onPress={openLink} /> */}
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

      {/* Suggestion Modal */}
      {/* {!showCartModal && ( */}
      <OverlayModal
        isScrollEnabled={false}
        showModal={showCartModal}
        component={
          <>
            {/* main product view */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  alignItems: 'center',
                }}>
                <Image
                  source={{uri: productData.imageUrls[0]}}
                  style={{
                    height: 50,
                    width: 50,
                    marginRight: 20,
                  }}
                  resizeMode="contain"
                />
                <Text style={{fontSize: 18}}>Item added to bag </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowCartModal(false)}
                style={{flex: 0.2}}>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/cross.webp')}
                  style={{width: 32, height: 32}}
                />
              </TouchableOpacity>
            </View>
            {/* suggested product */}
            <View
              style={{
                marginTop: 16,
                borderTopWidth: 1,
                paddingTop: 16,
                borderColor: 'rgba(0,0,0,0.1)',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                }}>
                Complete the Look
              </Text>
              {[
                {
                  name: 'Alessandra Rich',
                  description: 'Printed Silk Twill Mini Dress',
                  price: '$1860',
                  imageUrl: Images.dress,
                },
                {
                  name: 'Gucci',
                  description: 'Gucci 10mm Tao Leather Sandals',
                  price: '$850',
                  imageUrl: Images.footware,
                },
              ].map((item, index) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 16,
                    }}>
                    <View
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 20,
                        paddingHorizontal: 10,
                      }}>
                      <Image
                        source={item?.imageUrl}
                        style={{
                          height: 50,
                          width: 50,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '600',
                          marginBottom: 2,
                        }}>
                        {item?.name}
                      </Text>
                      <Text style={{fontSize: 14, marginBottom: 2}}>
                        {item?.description}
                      </Text>
                      <Text style={{fontSize: 14}}>{item?.price}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        }
      />
      {/* )} */}
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
      {showSizeModal && (
        <ScrollView
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            height: '40%',
            padding: 16,
            width: '95%',
            borderRadius: 4,
            marginLeft: normalize(10),
            position: 'absolute',
            bottom: normalize(250),
          }}>
          <View
            style={{
              flexDirection: 'row', // Arrange items horizontally
              flexWrap: 'wrap', // Allow items to wrap to the next row
            }}>
            {sizeArray.map(item => {
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    setshowSizeModal(false);
                    setcurrentSize(item.value);
                  }}
                  style={{
                    height: spV(40),
                    marginLeft: 2,
                    width: '23%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: Colors.greyBorder,
                  }}>
                  <Text style={{fontSize: 15, fontWeight: '400'}}>
                    {item.value}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* {showSizeModal && (
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
      )} */}
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
