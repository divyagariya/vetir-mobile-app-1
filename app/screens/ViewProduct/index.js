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
} from 'react-native';
import {Colors} from '../../colors';
import {VText, VView, Buttons, Header} from '../../components';
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
  const userId = useSelector(state => state.AuthReducer.userId);
  const deleteClosetResponse = useSelector(
    state => state.ClosetReducer.deleteClosetResponse,
  );

  const productDetailResponse = useSelector(
    state => state.HomeReducer.productDetailResponse,
  );

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

  if (Object.keys(productData).length === 0) {
    return null;
  }
  return (
    <VView style={{backgroundColor: 'white', flex: 1, paddingBottom: 80}}>
      <VView>
        <Header
          showAdd
          // showshare
          onShare={onShare}
          {...props}
          showBack
          addToCloset={addToCloset}
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
