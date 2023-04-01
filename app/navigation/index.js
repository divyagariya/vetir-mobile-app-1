import Home from '../screens/Home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, AppState} from 'react-native';
import React, {useEffect} from 'react';
import {VText, VView} from '../components';
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
import {getHomePageData} from '../redux/actions/homeActions';
import {NoAuthAPI} from '../services';
import YourPreferences from '../screens/YourPreferences';
import Search from '../screens/Search';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const renderTab = (route, imgSource) => {
  return (
    <VView
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Image
        source={imgSource}
        style={{width: 24, height: 24}}
        resizeMode="contain"
      />
      <VText text={route.name} style={{paddingLeft: 8}} />
    </VView>
  );
};

function ShopStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ViewProduct" component={ViewProduct} />
      <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
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

function TabData() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let imgSource = '';
          if (route.name === 'Shop') {
            imgSource = focused
              ? require('../assets/iLockSelected.webp')
              : require('../assets/iLock.webp');
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

          return renderTab(route, imgSource);
        },
        tabBarShowLabel: false,
        headerShown: false,
      })}
      backBehavior="order">
      <Tab.Screen name="Shop" component={ShopStack} />
      <Tab.Screen name="Closet" component={ClosetStack} />
      <Tab.Screen name="Outfits" component={OutfitStack} />
    </Tab.Navigator>
  );
}

function AppNavigation() {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.AuthReducer.userId);
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
      dispatch(getClosetData());
      dispatch(getOutfitsList());
      dispatch(getColorData());
      dispatch(getSizesData());
      dispatch(getPreferencesAnswers());
      if (!isPreferences) {
        dispatch(getPreferencesQs());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userId]);
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
          <Stack.Screen name="ClosetCategory" component={ClosetCategory} />
          <Stack.Screen name="ClosetInfo" component={ClosetInfo} />
          <Stack.Screen name="EditCloset" component={EditCloset} />
          <Stack.Screen name="Outfit" component={Outfits} />
          <Stack.Screen name="AddOutfit" component={AddOutfit} />
          <Stack.Screen name="SubmitOutfit" component={SubmitOutfit} />
          <Stack.Screen name="OutfitDetail" component={OutfitDetail} />
          <Stack.Screen name="YourPreferences" component={YourPreferences} />
          <Stack.Screen name="Search" component={Search} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AppNavigation;
