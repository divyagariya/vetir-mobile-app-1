import React, {useEffect, useRef, useState} from 'react';
import {Buttons, VText, VView} from '../../components';
import {FONTS_SIZES} from '../../fonts';
import {
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  View,
  Text,
  RefreshControl,
} from 'react-native';
import {Colors} from '../../colors';
import Categories from './components/Categories';
import {useDispatch, useSelector} from 'react-redux';
import {WebView} from 'react-native-webview';
import Lottie from 'lottie-react-native';
import {
  getHomePageData,
  getProductDetailsApi,
  getVideoList,
  viewVideo,
} from '../../redux/actions/homeActions';
import dynamicLinks, {firebase} from '@react-native-firebase/dynamic-links';
import Videos from '../Videos/components/Videos';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {auth} from '../../firebase';
import {Images} from '../../assets';

const storiesData = [
  {
    imageUrl: Images.story4,
    description: 'Lela Rose Spring 2023',
    webViewURL:
      'https://because.world/event/6321014b4f70a785078e18b6?sid=fahzqe&cid=i5ELrsRAMOc2XT',
  },
  {
    imageUrl: Images.story2,
    description: '45 New Arrivals to Shop Now -Fresh De...',
    webViewURL: 'https://www.vogue.com/shopping/new-arrivals',
  },
  {
    imageUrl: Images.story3,
    description: '60+ minimalist fashion and accessories to ge...',
    webViewURL: 'https://www.vogue.com/the-minimalist-edit',
  },
  {
    imageUrl: Images.story1,
    description: 'The Best of Womens Workwear, All in On...',
    webViewURL: 'https://www.vogue.com/shopping/the-workwear-edit',
  },
];

const Home = props => {
  const [videoList] = [1, 2, 3, 4, 5, 6, 7, 8];
  const dispatch = useDispatch();
  const [videoPlayer, setVideoPlayer] = useState(false);
  const isStylistUser = useSelector(state => state.AuthReducer.isStylistUser);
  const userEmail = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.emailId,
  );
  const personalStylistId = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.personalStylistId,
  );
  const personalStylistDetails = useSelector(
    state => state.ProfileReducer?.userProfileResponse.personalStylistDetails,
  );
  const {
    emailId = '',
    name = '',
    _id = '',
  } = (personalStylistDetails && personalStylistDetails[0]) || {};
  personalStylistDetails;
  const [refreshing, setRefreshing] = useState(false);
  const [showBambuser, setShowBambuser] = useState(false);
  const [searchIcon, showSearchIcon] = useState(false);
  const _scrollY = useRef(new Animated.Value(0)).current;
  const [showProducts, setShowProducts] = useState(false);
  const homeResponse =
    useSelector(state => state.HomeReducer.homeResponse) || [];
  const productDetailResponse = useSelector(
    state => state.HomeReducer.productDetailResponse,
  );
  const userId = useSelector(state => state.AuthReducer.userId);
  const videoListRes =
    useSelector(state => state.HomeReducer.videoListRes) || [];
  const refreshHome = useSelector(state => state.HomeReducer.refreshHome);

  const isPreferences =
    useSelector(
      state => state.ProfileReducer.userProfileResponse.isPreferences,
    ) || false;
  const [videoLink, setVideoLink] = useState('');

  const cartData = useSelector(state => state.cartReducer?.cartItems);

  // console.warn('homeResponse', homeResponse);

  useEffect(() => {
    if (Object.keys(productDetailResponse).length && showProducts) {
      setShowProducts(false);
      props.navigation.navigate('ViewProduct', {
        data: productDetailResponse.productDetails,
      });
      dispatch({type: 'GET_PRODUCT_DETAILS', value: {}});
    }
  }, [dispatch, productDetailResponse, props.navigation, showProducts]);

  const handleDynamicLink = link => {
    // Handle dynamic link inside your own application
    if (link.url.split('/')[2]) {
      getProductDetails(link.url.split('/')[2]);
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link?.url.split('/')[2]) {
          getProductDetails(link?.url.split('/')[2]);
        }
      });
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      dispatch(getHomePageData());
      dispatch(getVideoList(1, 5));
    });
    return unsubscribe;
  }, [props.navigation, dispatch]);

  const onScroll = ({
    nativeEvent: {
      contentOffset: {y},
    },
  }) => {
    if (y > 70) {
      showSearchIcon(true);
    } else {
      showSearchIcon(false);
    }
  };

  const renderItem = item => {
    if (item.products.length === 0) {
      return null;
    }
    return (
      <Categories
        key={item.optionName}
        data={item}
        {...props}
        isStylistUser={isStylistUser}
        getProductDetails={getProductDetails}
        viewAll={() =>
          props.navigation.navigate('CategoryScreen', {
            data: item,
            title: item.optionName,
          })
        }
      />
    );
  };

  const getProductDetails = productId => {
    setShowProducts(true);
    dispatch(getProductDetailsApi(productId));
  };

  const _onRefresh = () => {
    dispatch({type: 'REFRESH_HOME', value: true});
    dispatch(getHomePageData());
    dispatch(getVideoList(1, 5));
  };

  const runVideoVideos = item => {
    const data = {
      userId: userId,
      videoId: item._id,
    };
    dispatch(viewVideo(data));
    setVideoLink(item.videoLink);
    setVideoPlayer(true);
  };

  const navigateToVideos = () => {
    props.navigation.navigate('VideoList');
  };

  return (
    <VView style={styles.conatiner}>
      <VView style={styles.headingContainer}>
        <VText style={styles.headingText} text="Shop" />
        <VView style={{flexDirection: 'row', alignItems: 'center'}}>
          {searchIcon && (
            <TouchableOpacity
              style={{paddingRight: 16}}
              onPress={() => props.navigation.navigate('Search')}>
              <Image
                source={require('../../assets/search_top.webp')}
                style={styles.menuIcons}
              />
            </TouchableOpacity>
          )}
          {!isStylistUser && (
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('ChatScreen', {
                  receiverDetails: {
                    emailId: emailId,
                    name: name,
                    userId: _id,
                  },
                });
              }}>
              <Image
                source={Images.chaticon}
                style={styles.chatIcons}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => props.navigation.navigate('Menu')}>
            <Image
              source={require('../../assets/menu.webp')}
              style={styles.menuIcons}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </VView>
      </VView>
      <ScrollView
        contentContainerStyle={{paddingBottom: 50}}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        refreshControl={
          <RefreshControl refreshing={refreshHome} onRefresh={_onRefresh} />
        }>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => props.navigation.navigate('Search')}>
          <View style={{paddingHorizontal: 16}}>
            <Image
              source={require('../../assets/search_small.webp')}
              style={styles.search}
            />
          </View>
          <Text style={{color: Colors.black60, fontSize: FONTS_SIZES.s4}}>
            Search jeans, top, hats...
          </Text>
        </TouchableOpacity>
        {/* {!isStylistUser && (
          <Lottie
            source={require('../../assets/ripple.json')}
            autoPlay
            loop
            style={{
              height: 100,
              width: 100,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: -99,
              flexDirection: 'row',
            }}>
            <View>
              <TouchableOpacity
                style={{
                  height: 64,
                  width: 64,
                  borderRadius: 32,
                  backgroundColor: Colors.grey1,
                  margin: 20,
                  zIndex: 99,
                }}
                onPress={() => setShowBambuser(true)}>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/live.png')}
                  style={{width: '100%', height: '100%'}}
                />
                <View style={{position: 'absolute', bottom: -10, left: 13}}>
                  <Image
                    source={require('../../assets/livetext.png')}
                    style={{width: 40, height: 24}}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </Lottie>
        )} */}
        {videoListRes.length > 0 && (
          <View style={styles.videosContainer}>
            {videoListRes.map((item, index) => {
              if (index < 3) {
                return (
                  <Videos
                    key={index}
                    item={item}
                    runVideoVideos={() => runVideoVideos(item)}
                  />
                );
              }
              return null;
            })}
            <TouchableOpacity
              style={{
                marginLeft: 8,
                marginRight: 8,
                width: 74,
                alignItems: 'center',
                backgroundColor: Colors.grey1,
                height: 74,
                borderRadius: 36,
                justifyContent: 'center',
              }}
              onPress={navigateToVideos}>
              <Text style={{fontWeight: 'bold', fontSize: 10}}>View All</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Stories section */}

        <>
          <View
            style={{
              paddingHorizontal: 16,
              marginTop: 16,
            }}>
            <Text
              style={{
                fontSize: FONTS_SIZES.s3,
                fontWeight: '700',
                marginBottom: 4,
                color: '#212427',
              }}>
              The Stories
            </Text>
          </View>

          <ScrollView
            horizontal
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}>
            {storiesData.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('StoriesView', item)}
                  key={index}
                  style={{
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.08)',
                    marginRight: 8,
                    width: 165,
                  }}>
                  <Image
                    source={item?.imageUrl}
                    style={{
                      height: 123,
                      width: '100%',
                    }}
                    resizeMode="contain"
                  />
                  <View
                    style={{
                      padding: 8,
                    }}>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: FONTS_SIZES.s4,
                        lineHeight: 20,
                        color: Colors.black,
                      }}>
                      {item.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>

        {homeResponse.length > 0 &&
          homeResponse.map(item => {
            return renderItem(item);
          })}
        {!isPreferences && !isStylistUser && (
          <View
            style={{padding: 16, backgroundColor: Colors.grey1, margin: 16}}>
            <Text style={{fontSize: FONTS_SIZES.s3, fontWeight: 'bold'}}>
              For You
            </Text>
            <Text
              style={{
                color: Colors.black60,
                marginTop: 8,
                marginBottom: 16,
                lineHeight: 20,
              }}>
              Products will be shown based on your preferences.
            </Text>
            <Buttons
              onPress={() => props.navigation.navigate('YourPreferences')}
              text="Set your preferences"
            />
          </View>
        )}
      </ScrollView>
      {videoPlayer && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <TouchableOpacity
            style={{position: 'absolute', top: 16, right: 16, zIndex: 999}}
            onPress={() => setVideoPlayer(false)}>
            <Image
              source={require('../../assets/cross.webp')}
              style={{width: 44, height: 44}}
            />
          </TouchableOpacity>
          <WebView
            source={{
              uri: videoLink,
            }}
          />
        </View>
      )}
      {showBambuser && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <TouchableOpacity
            style={{position: 'absolute', top: 16, right: 16, zIndex: 999}}
            onPress={() => setShowBambuser(false)}>
            <Image
              source={require('../../assets/cross.webp')}
              style={{width: 44, height: 44}}
            />
          </TouchableOpacity>
          <WebView
            source={{
              uri: 'https://demo.bambuser.shop/content/webview-landing-v2.html',
            }}
          />
        </View>
      )}
    </VView>
  );
};

export default Home;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: 'white',
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    marginTop: 16,
    backgroundColor: 'white',
  },
  headingText: {
    fontSize: FONTS_SIZES.s3,
    fontWeight: '900',
    color: '#212427',
    textTransform: 'uppercase',
  },
  menuIcons: {
    height: 24,
    width: 24,
  },
  chatIcons: {
    marginRight: 16,
    height: 24,
    width: 24,
  },
  search: {
    height: 24,
    width: 24,
    color: Colors.black60,
  },
  inputContainer: {
    backgroundColor: Colors.grey1,
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  input: {
    padding: 16,
  },
  liveVideos: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    backgroundColor: 'red',
  },
  videosContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginLeft: 8,
    marginRight: 8,
  },
});
