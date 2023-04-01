import React, {useEffect} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import {Colors} from '../../colors';
import {Header} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {deleteAccount} from '../../redux/actions/profileAction';
import Toast from 'react-native-simple-toast';
import {FONTS_SIZES} from '../../fonts';
import {NoAuthAPI} from '../../services';

const Menu = props => {
  const userProfileResponse = useSelector(
    state => state.ProfileReducer.userProfileResponse,
  );
  const deleteAccountResponse = useSelector(
    state => state.ProfileReducer.deleteAccountResponse,
  );
  const userId = useSelector(state => state.AuthReducer.userId);
  const dispatch = useDispatch();
  const menuData = [
    {
      icon: require('../../assets/myprofile.png'),
      manuName: 'My Profile',
      route: 'ProfileSetup',
    },
    {
      icon: require('../../assets/preferences.png'),
      manuName: 'YourPreferences',
      route: 'YourPreferences',
    },
    {
      icon: require('../../assets/t&c.png'),
      manuName: 'Terms & Conditions',
      route: 'TermConditions',
    },
    {
      icon: require('../../assets/privacypolicy.png'),
      manuName: 'Privacy Policy',
      route: 'PrivacyPolicy',
    },
    {
      icon: require('../../assets/logout.png'),
      manuName: 'Logout',
    },
    {
      icon: require('../../assets/delete.png'),
      manuName: 'Delete Account',
    },
  ];

  useEffect(() => {
    if (Object.keys(deleteAccountResponse).length) {
      if (deleteAccountResponse.statusCode === 200) {
        dispatch({type: 'ACOOUNT_DELETE', value: {}});
        Toast.show('Your Account Delete Successfuly');
        dispatch({type: 'LOGOUT'});
        dispatch({type: 'PROFILE_DATA', value: ''});
        dispatch({type: 'PREFERENCES_ANSWERS', value: []});
      }
    }
  }, [deleteAccountResponse, dispatch]);

  const getLastActiveSession = async () => {
    const data = {
      userId: userId,
    };
    const response = await NoAuthAPI('user/track/lastActive', 'POST', data);
    dispatch({type: 'LOGOUT'});
    dispatch({type: 'PROFILE_DATA', value: ''});
  };

  const menuClick = item => {
    if (item.manuName === 'Logout') {
      Alert.alert('Vetir', 'Are you sure want to logout', [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            getLastActiveSession();
          },
        },
      ]);
    }
    if (item.manuName === 'Delete Account') {
      Alert.alert('Vetir', 'Are you sure want to delete your account', [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            dispatch(
              deleteAccount({
                userId: userId,
              }),
            );
          },
        },
      ]);
    }
    if (item.route) {
      props.navigation.navigate(item.route);
    }
  };
  return (
    <View style={{flex: 1}}>
      <Header showBack title="Menu" {...props} />
      <View style={{flex: 1}}>
        <View style={styles.container1}>
          <View style={{marginHorizontal: 16}}>
            <Image
              source={
                userProfileResponse?.profilePicUrl
                  ? {uri: userProfileResponse.profilePicUrl}
                  : require('../../assets/iProfile.png')
              }
              style={{width: 80, height: 80, borderRadius: 40}}
            />
          </View>
          <View style={styles.profileDataContainer}>
            <Text
              style={{fontWeight: 'bold', fontSize: FONTS_SIZES.s3}}
              numberOfLines={1}>
              {userProfileResponse?.name}
            </Text>
            <Text style={{textTransform: 'capitalize'}}>
              {userProfileResponse?.gender}
            </Text>
            <Text>{userProfileResponse?.emailId}</Text>
          </View>
        </View>
        <View>
          {menuData.map(item => {
            return (
              <TouchableOpacity
                onPress={() => menuClick(item)}
                style={styles.menuContainer}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{paddingHorizontal: 16}}>
                    <Image source={item.icon} style={{width: 24, height: 24}} />
                  </View>
                  <Text
                    style={{
                      color:
                        item.manuName === 'Delete Account'
                          ? '#CE1A1A'
                          : 'black',
                    }}>
                    {item.manuName}
                  </Text>
                </View>
                <View style={{paddingRight: 20}}>
                  <Image
                    source={require('../../assets/rightArrow.png')}
                    style={{width: 10, height: 14}}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container1: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 24,
    marginVertical: 8,
  },
  profileDataContainer: {
    height: 80,
    justifyContent: 'space-between',
    flex: 1,
    paddingRight: 16,
  },
  menuContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderColor: Colors.grey1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
