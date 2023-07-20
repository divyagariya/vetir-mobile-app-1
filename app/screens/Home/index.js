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

const Home = props => {
  const [videoList] = [1, 2, 3, 4, 5, 6, 7, 8];
  const dispatch = useDispatch();
  const [videoPlayer, setVideoPlayer] = useState(false);
  const isStylistUser = useSelector(state => state.AuthReducer.isStylistUser);
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
        if (link.url.split('/')[2]) {
          getProductDetails(link.url.split('/')[2]);
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
        <VView style={{flexDirection: 'row'}}>
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
              source={require('../../assets/search.webp')}
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
    paddingTop: 16,
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  headingText: {
    fontSize: FONTS_SIZES.s1,
    fontWeight: '700',
    color: '#212427',
  },
  menuIcons: {
    height: 32,
    width: 32,
  },
  search: {
    height: 24,
    width: 24,
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
