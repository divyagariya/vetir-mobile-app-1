import Home from '../screens/Home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, AppState, Text} from 'react-native';
import React, {useEffect} from 'react';
import {VView} from '../components';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ViewProduct from '../screens/ViewProduct';
import CategoryScreen from '../screens/CategoryScreen';
import LandingPage from '../screens/LandingPage';
import VerifyEmail from '../screens/VerifyEmail';
import ProfileSetup from '../screens/ProfileSetup';
import {useDispatch, useSelector} from 'react-redux';
import TermConditions from '../screens/TermCondition';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import ClosetScreen from '../screens/Closet';
import ClosetDetailsFrom from '../screens/Closet/component/closetDetailForm';
import Menu from '../screens/Menu';
import Outfits from '../screens/Outfits';
import Checkout from '../screens/Checkout';
import {
  getPreferencesAnswers,
  getPreferencesQs,
  getUserProfile,
} from '../redux/actions/profileAction';
import {
  getBrandData,
  getBrandData2,
  getCategoryData,
  getClosetData,
  getColorData,
  getSizesData,
} from '../redux/actions/closetAction';
import ClosetCategory from '../screens/ClosetCategory';
import ClosetInfo from '../screens/ClosetInfo';
import EditCloset from '../screens/EditCloset';
import AddOutfit from '../screens/AddOutfit';
import SubmitOutfit from '../screens/SubmitOutfit';
import OutfitDetail from '../screens/OutfitDetail';
import {getOutfitsList} from '../redux/actions/outfitActions';
import ClosetFilter from '../screens/ClosetFilter';
import {getHomePageData, getVideoList} from '../redux/actions/homeActions';
import {NoAuthAPI} from '../services';
import YourPreferences from '../screens/YourPreferences';
import AddProducts from '../screens/AddProducts';
import Search from '../screens/Search';
import Clients from '../screens/Clients';
import {getAllClients} from '../redux/actions/stylistAction';
import ClientDetails from '../screens/ClinetDetails';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileDetails from '../screens/ProfileDetails';
import ItemsByCategory from '../screens/ItemsByCategory';
import OrderHistory from '../screens/OrderHistory';
import OrderHistoryDetails from '../screens/OrderHistoryDetails';
import ChatScreen from '../screens/ChatScreen';
import ImagePreview from '../screens/ImagePreview';

import VideoList from '../screens/Videos';
import {Colors} from '../colors';
import {normalize} from '../utils/normalise';
import {NavigationContainer} from '@react-navigation/native';
import AiChatScreen from '../screens/AiChatScreen';
import StoriesView from '../screens/StoriesView';
import PlaceOrder from '../screens/Checkout/PlaceOrder';
import OrderSuccess from '../screens/Checkout/OrderSuccess';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const renderTab = (route, imgSource, focused) => {
  return (
    <VView>
      <Image
        source={imgSource}
        style={{width: 24, height: 24}}
        resizeMode="contain"
      />
    </VView>
  );
};

function ShopStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ViewProduct" component={ViewProduct} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="PlaceOrder" component={PlaceOrder} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
      <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
      <Stack.Screen name="VideoList" component={VideoList} />
    </Stack.Navigator>
  );
}

const ClosetStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ClosetScreen" component={ClosetScreen} />
      <Stack.Screen name="ClosetDetailsFrom" component={ClosetDetailsFrom} />
      <Stack.Screen name="ClosetCategory" component={ClosetCategory} />
      <Stack.Screen name="ClosetInfo" component={ClosetInfo} />
      <Stack.Screen name="EditCloset" component={EditCloset} />
      <Stack.Screen name="ClosetFilter" component={ClosetFilter} />

      <Stack.Screen name="AddOutfit" component={AddOutfit} />
      <Stack.Screen name="SubmitOutfit" component={SubmitOutfit} />
      <Stack.Screen name="OutfitDetail" component={OutfitDetail} />
    </Stack.Navigator>
  );
};
const OutfitStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Outfit" component={Outfits} />
      <Stack.Screen name="AddOutfit" component={AddOutfit} />
      <Stack.Screen name="SubmitOutfit" component={SubmitOutfit} />
      <Stack.Screen name="OutfitDetail" component={OutfitDetail} />

      <Stack.Screen name="ClosetCategory" component={ClosetCategory} />
      <Stack.Screen name="ClosetInfo" component={ClosetInfo} />
      <Stack.Screen name="EditCloset" component={EditCloset} />
      <Stack.Screen name="ClosetFilter" component={ClosetFilter} />
    </Stack.Navigator>
  );
};

const AiChatStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AiChat" component={AiChatScreen} />
    </Stack.Navigator>
  );
};

function TabData() {
  const isStylistUser = useSelector(state => state.AuthReducer.isStylistUser);
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let imgSource = '';
          if (route.name === 'Shop') {
            imgSource = focused
              ? require('../assets/iLockSelected.webp')
              : require('../assets/iLock.webp');
          }
          if (route.name === 'AiChat') {
            imgSource = focused
              ? require('../assets/aiBotSelected.png')
              : require('../assets/aiBot.png');
          } else if (route.name === 'Closet') {
            imgSource = focused
              ? require('../assets/iClosetSelected.webp')
              : require('../assets/iCloset.webp');
          }
          if (route.name === 'Outfits') {
            imgSource = focused
              ? require('../assets/iOutfitSelected.png')
              : require('../assets/outfitIcon.png');
          }
          if (route.name === 'Clients') {
            imgSource = focused
              ? require('../assets/clientIcon.png')
              : require('../assets/selectedClientIcon.png');
          }

          return renderTab(route, imgSource, focused);
        },
        tabBarLabel: ({focused, children}) => {
          return (
            <Text
              style={{
                fontSize: 9,
                fontWeight: '400',
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: children === 'AiChat' ? Colors.purple : Colors.black,
              }}>
              {children === 'AiChat' ? 'AI Stylist' : route.name}
            </Text>
          );
        },

        headerShown: false,
      })}
      backBehavior="order">
      <Tab.Screen name="Shop" component={ShopStack} />
      {isStylistUser ? (
        <>
          <Tab.Screen name="Clients" component={Clients} />
          <Tab.Screen name="Closet" component={ClosetStack} />
          <Tab.Screen name="Outfits" component={OutfitStack} />
        </>
      ) : (
        <>
          <Tab.Screen name="AiChat" component={AiChatStack} />
          <Tab.Screen name="Closet" component={ClosetStack} />
          <Tab.Screen name="Outfits" component={OutfitStack} />
        </>
      )}
    </Tab.Navigator>
  );
}

function AppNavigation() {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.AuthReducer.userId);
  const isStylistUser = useSelector(state => state.AuthReducer.isStylistUser);
  const stylistUserId = useSelector(state => state.AuthReducer.stylistUserId);
  const isProfileCreated = useSelector(
    state => state.AuthReducer.isProfileCreated,
  );
  const isPreferences =
    useSelector(
      state => state.ProfileReducer.userProfileResponse.isPreferences,
    ) || false;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'inactive') {
        if (userId) {
          getLastActiveSession();
        }
      }
    });

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLastActiveSession = async () => {
    const data = {
      userId: userId,
    };
    const response = await NoAuthAPI('user/track/lastActive', 'POST', data);
  };

  useEffect(() => {
    if (userId) {
      dispatch(getHomePageData());
      dispatch(getUserProfile());
      dispatch(getBrandData());
      dispatch(getBrandData2());
      dispatch(getCategoryData());
      dispatch(getColorData());
      dispatch(getSizesData());
      if (!isStylistUser) {
        dispatch(getVideoList(1, 3));
        dispatch(getClosetData());
        dispatch(getOutfitsList());
        dispatch(getPreferencesAnswers());
        if (!isPreferences) {
          dispatch(getPreferencesQs());
        }
      } else {
        dispatch(getAllClients());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userId]);

  // function ModalStackScreen() {
  //   return (
  //     <ModalStack.Navigator mode="modal" screenOptions={{headerShown: false}}>
  //       {/* Define your modal screens here */}
  //       {/* For example, if you have a modal called "ModalScreen", you can add it like this: */}
  //       {/* <ModalStack.Screen name="ModalScreen" component={ModalScreen} /> */}
  //     </ModalStack.Navigator>
  //   );
  // }

  return !userId ? (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LandingPage" component={LandingPage} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
      <Stack.Screen name="TermConditions" component={TermConditions} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!isProfileCreated ? (
        <Stack.Screen name="ProfileSetup" component={ProfileSetup} />
      ) : (
        <>
          <Stack.Screen name="CartScreen" component={CartScreen} />
          <Stack.Screen name="TabData" component={TabData} />
          <Stack.Screen name="Menu" component={Menu} />
          <Stack.Screen name="TermConditions" component={TermConditions} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          <Stack.Screen name="ProfileSetup" component={ProfileSetup} />

          <Stack.Screen name="ClosetScreen" component={ClosetScreen} />
          <Stack.Screen
            name="ClosetDetailsFrom"
            component={ClosetDetailsFrom}
          />
          <Stack.Screen name="ViewProduct" component={ViewProduct} />
          <Stack.Screen name="Checkout" component={Checkout} />
          <Stack.Screen name="ClosetCategory" component={ClosetCategory} />
          <Stack.Screen name="ClosetInfo" component={ClosetInfo} />
          <Stack.Screen name="EditCloset" component={EditCloset} />
          <Stack.Screen name="Outfit" component={Outfits} />
          <Stack.Screen name="AddOutfit" component={AddOutfit} />
          <Stack.Screen name="SubmitOutfit" component={SubmitOutfit} />
          <Stack.Screen name="OutfitDetail" component={OutfitDetail} />
          <Stack.Screen name="YourPreferences" component={YourPreferences} />
          <Stack.Screen name="AddProducts" component={AddProducts} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="ClientDetails" component={ClientDetails} />
          <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
          <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
          <Stack.Screen name="ItemsByCategory" component={ItemsByCategory} />
          <Stack.Screen name="OrderHistory" component={OrderHistory} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="StoriesView" component={StoriesView} />

          <Stack.Screen
            name="OrderHistoryDetails"
            component={OrderHistoryDetails}
          />
          <Stack.Screen
            name="ImagePreview"
            component={ImagePreview}
            options={{presentation: 'modal'}}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AppNavigation;
