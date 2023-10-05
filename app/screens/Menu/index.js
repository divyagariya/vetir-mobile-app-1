import React, {useEffect, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import {Colors} from '../../colors';
import {Buttons, Header, Input, OverlayModal} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {deleteAccount, getUserProfile} from '../../redux/actions/profileAction';
import Toast from 'react-native-simple-toast';
import {FONTS_SIZES} from '../../fonts';
import {NoAuthAPI} from '../../services';
import {
  addStylistAction,
  deleteStylistAction,
} from '../../redux/actions/stylistAction';
import WebView from 'react-native-webview';

const Menu = props => {
  const [stylistEmail, setStylistEmail] = useState('');
  const [stylistEmailErrorText, setStylistEmailErr] = useState('');
  const [stylistName, setStylistName] = useState('');
  const [stylistNameErrorText, setStylistNameErr] = useState('');
  const isStylistUser = useSelector(state => state.AuthReducer.isStylistUser);
  const userProfileResponse = useSelector(
    state => state.ProfileReducer.userProfileResponse,
  );
  const deleteAccountResponse = useSelector(
    state => state.ProfileReducer.deleteAccountResponse,
  );
  const addStylistResp = useSelector(
    state => state.StylistReducer.addStylistResp,
  );
  const deleteStylistResp = useSelector(
    state => state.StylistReducer.deleteStylistResp,
  );
  const userId = useSelector(state => state.AuthReducer.userId);
  const dispatch = useDispatch();
  const [showModal, setModal] = useState(false);
  const menuData = [
    {
      icon: require('../../assets/addproducts.webp'),
      manuName: 'Add Products',
      route: 'AddProducts',
    },
    {
      icon: require('../../assets/myprofile.png'),
      manuName: 'My Profile',
      route: 'ProfileSetup',
    },

    {
      icon: require('../../assets/preferences.png'),
      manuName: 'Your Preferences',
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
    if (Object.keys(addStylistResp).length) {
      dispatch({type: 'ADD_STYLIST', value: {}});
      Toast.show('Stylist added successfuly');
      setStylistEmail('');
      setStylistName('');
      dispatch(getUserProfile());
    }
  }, [addStylistResp]);

  useEffect(() => {
    if (Object.keys(deleteStylistResp).length) {
      dispatch({type: 'DELETE_STYLIST', value: {}});
      Toast.show('Stylist deleted successfuly');
      dispatch(getUserProfile());
    }
  }, [deleteStylistResp]);

  useEffect(() => {
    if (Object.keys(deleteAccountResponse).length) {
      if (deleteAccountResponse.statusCode === 200) {
        dispatch({type: 'ACOOUNT_DELETE', value: {}});
        Toast.show('Your Account Delete Successfuly');
        dispatch({type: 'LOGOUT'});
        dispatch({type: 'PROFILE_DATA', value: ''});
        dispatch({type: 'PREFERENCES_ANSWERS', value: []});
        dispatch({
          type: 'IS_STYLIST',
          value: false,
        });
        dispatch({type: 'GET_VIDEO_LIST', value: []});
      }
    }
  }, [deleteAccountResponse, dispatch]);

  const getLastActiveSession = async () => {
    const data = {
      userId: userId,
    };
    if (!isStylistUser) {
      const response = await NoAuthAPI('user/track/lastActive', 'POST', data);
    }

    dispatch({type: 'LOGOUT'});
    dispatch({type: 'PROFILE_DATA', value: ''});
    dispatch({
      type: 'IS_STYLIST',
      value: false,
    });
    dispatch({type: 'GET_VIDEO_LIST', value: []});
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

  const addStylist = () => {
    let pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!stylistEmail) {
      setStylistEmailErr('Please enter email id');
      return;
    }
    if (stylistEmail && !pattern.test(stylistEmail)) {
      setStylistEmailErr('Please enter valid email id');
      return;
    }
    if (!stylistName) {
      setStylistNameErr('Please enter stylist name');
      return;
    }
    let data = {
      userId,
      emailId: stylistEmail,
      name: stylistName,
    };
    setModal(false);
    dispatch(addStylistAction(data));
  };

  const deleteStylist = () => {
    const data = {
      userId,
    };
    dispatch(deleteStylistAction(data));
  };

  const RenderAddStylist = () => {
    return (
      <View style={{marginBottom: 16}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text
              style={{
                fontSize: FONTS_SIZES.s3,
                fontWeight: 'bold',
                marginBottom: 4,
              }}>
              Add Personal Stylist
            </Text>
            <Text style={{color: Colors.black60, marginTop: 4}}>
              Personal stylist can recommend you products
            </Text>
          </View>
          <TouchableOpacity onPress={() => setModal(false)}>
            <Image
              source={require('../../assets/cross.webp')}
              style={{width: 32, height: 32}}
            />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 24}}>
          <Input
            placeholder="Enter stylist’s name"
            onChangeText={e => {
              setStylistName(e);
              setStylistNameErr('');
            }}
            errorText={stylistNameErrorText}
            value={stylistName}
            showIcon
            iconName
          />
        </View>
        <View style={{}}>
          <Input
            placeholder="Enter stylist’s email Id"
            onChangeText={e => {
              setStylistEmail(e);
              setStylistEmailErr('');
            }}
            errorText={stylistEmailErrorText}
            value={stylistEmail}
            showIcon
          />
        </View>
        <Buttons text="Add" onPress={addStylist} />
      </View>
    );
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1, paddingTop: 16}}>
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
              style={{width: 64, height: 64, borderRadius: 40}}
            />
          </View>
          <View style={styles.profileDataContainer}>
            <Text
              style={{
                color: '#212427',
                fontWeight: 'bold',
                fontSize: FONTS_SIZES.s4,
                textTransform: 'capitalize',
                paddingBottom: 4,
              }}
              numberOfLines={1}>
              {userProfileResponse?.name}
            </Text>
            <Text
              style={{
                color: Colors.black60,
                textTransform: 'capitalize',
                fontSize: FONTS_SIZES.s4,
                paddingBottom: 4,
              }}>
              {userProfileResponse?.gender}
            </Text>
            <Text
              style={{
                color: Colors.black60,
                fontSize: FONTS_SIZES.s4,
                paddingBottom: 4,
              }}>
              {userProfileResponse?.emailId}
            </Text>
            {isStylistUser ? null : userProfileResponse?.hasPersonalStylist ? (
              <View style={{marginTop: 8}}>
                <Text
                  style={{
                    color: '#212427',
                    fontSize: FONTS_SIZES.s4,
                    fontWeight: '700',
                    paddingBottom: 4,
                  }}>
                  Personal Stylist:
                </Text>
                <Text
                  style={{
                    fontSize: FONTS_SIZES.s4,
                    paddingBottom: 4,
                    color: Colors.black60,
                  }}>
                  {userProfileResponse?.personalStylistDetails[0].name}
                </Text>
                <Text
                  style={{
                    fontSize: FONTS_SIZES.s4,
                    paddingBottom: 4,
                    color: Colors.black60,
                  }}>
                  {userProfileResponse?.personalStylistDetails[0].emailId}
                </Text>
                <TouchableOpacity onPress={deleteStylist}>
                  <Text style={{color: Colors.red, fontSize: FONTS_SIZES.s4}}>
                    Remove stylist
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setModal(true)}>
                <Text style={{color: Colors.blue, marginTop: 16}}>
                  Add Personal Stylist
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View>
          {menuData.map(item => {
            if (isStylistUser && item.route === 'YourPreferences') {
              return null;
            }
            if (!isStylistUser && item.route === 'AddProducts') {
              return null;
            }
            return (
              <TouchableOpacity
                key={item.manuName}
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
                <View style={{paddingRight: 16}}>
                  <Image
                    source={require('../../assets/rightArrow.png')}
                    style={{width: 16, height: 16}}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      {showModal && (
        <OverlayModal
          isScrollEnabled={false}
          showModal={showModal}
          component={RenderAddStylist()}
        />
      )}
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container1: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginVertical: 8,
  },
  profileDataContainer: {
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
