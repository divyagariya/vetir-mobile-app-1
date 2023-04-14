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
} from 'react-native';
import {Colors} from '../../colors';
import {VText, VView, Buttons, Header, OverlayModal} from '../../components';
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

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = SLIDER_WIDTH;

const ViewProduct = props => {
  const dispatch = useDispatch();
  let _slider1Ref = useRef(null);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(0);
  const [productData, setProductData] = useState({});
  const addClosetResponse = useSelector(
    state => state.ClosetReducer.addClosetResponse,
  );
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
        dispatch({type: 'RECOMMENDED_TO_CLIENTS', value: {}});
        Toast.show('Recommended to clients successfuly');
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
        Toast.show('Cloth successfully removed from closet');
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
        Toast.show('Cloth successfully added in closet');
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
      } else Linking.openURL(url);
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
    console.log('data', JSON.stringify(data, undefined, 2));
    dispatch(addDataInCloset(data));
  };

  const onShare = () => {
    const url = 'https://awesome.contents.com/';
    const message = 'Please check this out.';
    Share.open({
      message: `${message} ${url}`,
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
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

  const ClientList = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 8,
        }}
        onPress={() => selectClient(item)}>
        <View style={{flexDirection: 'row'}}>
          {item.profilePicUrl ? (
            <Image
              source={{uri: item.profilePicUrl}}
              style={{width: 40, height: 40}}
            />
          ) : (
            <Image
              source={require('../../assets/iProfile.png')}
              style={{width: 40, height: 40}}
            />
          )}
          <View style={{marginLeft: 8}}>
            <Text>{item.name}</Text>
            <Text style={{color: Colors.black30}}>{item.emailId}</Text>
          </View>
        </View>

        <View>
          <Image
            source={
              selectedClients.includes(item.userId)
                ? require('../../assets/iSelectedCheck.png')
                : require('../../assets/iCheck.png')
            }
            style={{width: 16, height: 16}}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    );
  };

  const recommendToClients = () => {
    if (!selectedClients.length) {
      Toast.show('Please select atleast one client');
      return;
    }
    const data = {
      personalStylistId: userId,
      userIds: selectedClients,
      productId: recommendedProductId,
    };
    console.log('data', data);
    setShowClientModal(false);
    dispatch(recommendedAction(data));
  };

  const RenderClients = () => {
    return (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text style={{fontSize: FONTS_SIZES.s3, fontWeight: 'bold'}}>
              Recommend to your clients
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowClientModal(false)}>
            <Image
              source={require('../../assets/cross.webp')}
              style={{width: 32, height: 32}}
            />
          </TouchableOpacity>
        </View>
        <View style={{marginVertical: 16}}>
          {allClientDataRespo.map((item, index) => {
            return <ClientList item={item} index={index} />;
          })}
        </View>
        <Buttons text="recommend" onPress={recommendToClients} />
      </View>
    );
  };

  if (Object.keys(productData).length === 0) {
    return null;
  }
  return (
    <VView style={{backgroundColor: 'white', flex: 1, paddingBottom: 80}}>
      <VView>
        <Header
          showAdd={!isStylistUser}
          recommendClients={recommentToClient}
          showRecommend={isStylistUser}
          showLike={!isStylistUser}
          // showshare
          onShare={onShare}
          {...props}
          likeImageSrc={
            productData.isDisliked
              ? require('../../assets/iLike.png')
              : require('../../assets/iDisLike.png')
          }
          showBack
          addToCloset={addToCloset}
          likeProduct={dislikeProducts}
          imageSrc={
            productData.addedToCloset
              ? require('../../assets/addedCloset.png')
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
            <VText
              style={{fontSize: FONTS_SIZES.s3, fontWeight: '700'}}
              text={productData?.productName}
            />
            <VText
              text={'$' + productData?.productPrice}
              style={{
                fontSize: FONTS_SIZES.s3,
                fontWeight: '700',
                paddingVertical: 8,
              }}
            />
            <Text style={styles.titleStyle}>Color</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
                marginTop: 8,
              }}>
              <View
                style={{
                  backgroundColor: productData.productColorCode,
                  width: 40,
                  height: 40,
                  marginRight: 8,
                }}
              />
              <Text>{productData.productColor}</Text>
            </View>
            <Text style={styles.titleStyle}>Category</Text>
            <Text style={styles.subitleStyle}>{productData.categoryName}</Text>
            <Text style={styles.titleStyle}>Sub Category</Text>
            <Text style={styles.subitleStyle}>
              {productData.subCategoryName}
            </Text>
            <Text style={styles.titleStyle}>Brand</Text>
            <Text style={styles.subitleStyle}>{productData.brandName}</Text>
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
            <Text style={styles.titleStyle}>Size</Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {productData.productSizes.map(item => {
                return (
                  <Text style={[styles.subitleStyle, {marginRight: 4}]}>
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
          </VView>
        </VView>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 16,
          width: '100%',
          paddingHorizontal: 16,
        }}>
        <Buttons text="buy from the store" onPress={openLink} />
      </View>
      {showClientModal && (
        <OverlayModal
          isScrollEnabled={false}
          showModal={showClientModal}
          component={RenderClients()}
        />
      )}
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
    marginTop: 8,
    marginBottom: 16,
  },
  titleStyle: {
    marginTop: 8,
  },
});
