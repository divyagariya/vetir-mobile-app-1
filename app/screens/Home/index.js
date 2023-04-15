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
} from '../../redux/actions/homeActions';
import dynamicLinks, {firebase} from '@react-native-firebase/dynamic-links';

const Home = props => {
  const dispatch = useDispatch();
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
  const refreshHome = useSelector(state => state.HomeReducer.refreshHome);

  const isPreferences =
    useSelector(
      state => state.ProfileReducer.userProfileResponse.isPreferences,
    ) || false;

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
  };

  return (
    <VView style={styles.conatiner}>
      <VView style={styles.headingContainer}>
        <VText style={styles.headingText} text="Shop" />
        <VView style={{flexDirection: 'row'}}>
          {searchIcon && (
            <TouchableOpacity
              style={{paddingRight: 20}}
              onPress={() => props.navigation.navigate('Search')}>
              <Image
                source={require('../../assets/search.webp')}
                style={styles.menuIcon}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => props.navigation.navigate('Menu')}>
            <Image
              source={require('../../assets/menu.webp')}
              style={styles.menuIcon}
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
        {!isStylistUser && (
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
            }}>
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
          </Lottie>
        )}

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => props.navigation.navigate('Search')}>
          <View style={{paddingHorizontal: 18}}>
            <Image
              source={require('../../assets/search.webp')}
              style={styles.menuIcon}
            />
          </View>
          <Text style={{color: Colors.black60}}>
            Search jeans, top, hats...
          </Text>
        </TouchableOpacity>
        {homeResponse.length > 0 &&
          homeResponse.map(item => {
            return renderItem(item);
          })}
        {!isPreferences && !isStylistUser && (
          <View
            style={{padding: 16, backgroundColor: Colors.grey1, margin: 16}}>
            <Text style={{fontSize: FONTS_SIZES.s1, fontWeight: 'bold'}}>
              For You
            </Text>
            <Text
              style={{color: Colors.black60, marginTop: 8, marginBottom: 16}}>
              Products will be shown based on your preferences.
            </Text>
            <Buttons
              onPress={() => props.navigation.navigate('YourPreferences')}
              text="Set your preferences"
            />
          </View>
        )}
      </ScrollView>

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
    padding: 16,
  },
  headingText: {
    fontSize: FONTS_SIZES.s1,
    fontWeight: '700',
  },
  menuIcon: {
    height: 22,
    width: 22,
  },
  inputContainer: {
    backgroundColor: Colors.grey1,
    marginBottom: 32,
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    padding: 16,
  },
});
