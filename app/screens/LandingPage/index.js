import React, {Component} from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {FONTS_SIZES} from '../../fonts';
import {Buttons, Input, OverlayModal} from '../../components';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  emptyLoginResponse,
  loginAction,
  googleLoginAction,
  storeUserId,
  appleLoginAction,
  emptyAppleResponse,
  emptyGoogleResponse,
} from '../../redux/actions/authActions';
import {Colors} from '../../colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
let user = null;
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import InstagramLogin from 'react-native-instagram-login';

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = SLIDER_WIDTH;

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [
        {
          imgSrc: require('../../assets/banner1.webp'),
        },
        {
          imgSrc: require('../../assets/banner2.webp'),
        },
      ],
      activeIndex: 0,
      showModal: false,
      modalData: null,
      type: '',
    };
  }

  componentDidMount() {
    GoogleSignin.configure({
      //It is mandatory to call this method before attempting to call signIn()
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      // Repleace with your webClientId generated from Firebase console
      webClientId:
        '185367964920-kda1aa1ddf0b43c6bvg1fqqo8eflrb5f.apps.googleusercontent.com',
    });
  }
  _renderItem = ({item, index}) => {
    return (
      <View style={styles.container} key={index}>
        <Image source={item.imgSrc} style={styles.image} resizeMode="contain" />
        {/* <Text style={styles.header}>{item.title}</Text>
        <Text style={styles.body}>{item.subtitle}</Text> */}
      </View>
    );
  };

  componentDidUpdate(prevProps) {
    if (prevProps.loginResponse !== this.props.loginResponse) {
      this.props.emptyLoginResponse();
      if (this.props.loginResponse.statusCode === 200) {
        this.props.navigation.navigate('VerifyEmail', {
          email: this.props.loginResponse.emailId,
          type: this.state.type,
        });
      }
    }
    if (prevProps.googleLoginResponse !== this.props.googleLoginResponse) {
      this.props.emptyGoogleResponse();
      this.props.storeUserId({
        userId: this.props.googleLoginResponse?.userId,
        isProfileCreated: this.props.googleLoginResponse?.isProfileCreated,
      });
    }
    if (prevProps.appleLoginResponse !== this.props.appleLoginResponse) {
      this.props.emptyAppleResponse();
      this.props.storeUserId({
        userId: this.props.appleLoginResponse?.userId,
        isProfileCreated: this.props.appleLoginResponse?.isProfileCreated,
      });
    }
  }

  openStaticPage = type => {
    if (type === 'tt') {
      this.props.navigation.navigate('TermConditions');
    } else {
      this.props.navigation.navigate('PrivacyPolicy');
    }
  };

  googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        //Check if device has Google Play Services installed.
        //Always resolves to true on iOS.
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      this.props.googleLoginAction({
        idToken: userInfo?.idToken,
      });
      console.log('user info -0--------->', userInfo);
    } catch (error) {
      console.warn('Message', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.warn('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.warn('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.warn('Play Services Not Available or Outdated');
      } else {
        console.warn('Some Other Error Happened');
      }
    }
  };

  fetchAndUpdateCredentialState = async updateCredentialStateForUser => {
    if (user === null) {
      updateCredentialStateForUser('N/A');
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(user);
      if (credentialState === appleAuth.State.AUTHORIZED) {
        updateCredentialStateForUser('AUTHORIZED');
      } else {
        updateCredentialStateForUser(credentialState);
      }
    }
  };

  appleLogin = async updateCredentialStateForUser => {
    console.warn('Beginning Apple Authentication');

    // start a login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      const {
        user: newUser,
        email,
        nonce,
        identityToken,
        realUserStatus /* etc */,
      } = appleAuthRequestResponse;

      user = newUser;

      this.fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(
        error => updateCredentialStateForUser(`Error: ${error.code}`),
      );

      if (identityToken) {
        // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
        this.props.appleLoginAction({identityToken: identityToken});
      } else {
        // no token - failed sign-in?
      }

      if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
        console.log("I'm a real person!");
      }

      console.log(`Apple Authentication Completed, ${user}, ${email}`);
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.log('User canceled Apple Sign in.');
      } else {
        console.log(error);
      }
    }
  };

  login = () => {
    this.setState({type: ''});
    let {email} = this.state;
    let pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email) {
      this.setState({errorText: 'Please enter email id'});
      return;
    }
    if (email && !pattern.test(email)) {
      this.setState({errorText: 'Please enter valid email id'});
      return;
    }

    this.props.loginAction({
      emailId: email.toLowerCase(),
      status: 1,
    });
  };

  stylistLogin = () => {
    let {stylistEmail} = this.state;
    let pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!stylistEmail) {
      this.setState({stylistEmailErrorText: 'Please enter email id'});
      return;
    }
    if (stylistEmail && !pattern.test(stylistEmail)) {
      this.setState({stylistEmailErrorText: 'Please enter valid email id'});
      return;
    }
    this.setState({type: 'stylist', showModal: false});
    this.props.loginAction({
      emailId: stylistEmail.toLowerCase(),
      status: 1,
      type: 'stylist',
    });
  };

  renderStylistLogin = () => {
    return (
      <View style={{marginBottom: 16, marginTop: 12}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
          <Text style={{fontSize: FONTS_SIZES.s3, fontWeight: 'bold'}}>
            Login as a Stylist
          </Text>
          <TouchableOpacity onPress={() => this.setState({showModal: false})}>
            <Image
              source={require('../../assets/cross.webp')}
              style={{width: 32, height: 32}}
            />
          </TouchableOpacity>
        </View>
        <Input
          placeholder="Email Id"
          onChangeText={e =>
            this.setState({stylistEmail: e, stylistEmailErrorText: ''})
          }
          errorText={this.state.stylistEmailErrorText}
          value={this.state.stylistEmail}
          showIcon
        />
        <Buttons text="login" onPress={this.stylistLogin} />
      </View>
    );
  };

  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View
            style={{
              paddingTop: 16,
            }}>
            <Carousel
              loop={true}
              autoplay={true}
              layout="default"
              layoutCardOffset={9}
              ref={c => (this._slider1Ref = c)}
              data={this.state.entries}
              renderItem={this._renderItem}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={ITEM_WIDTH}
              inactiveSlideShift={0}
              useScrollView={true}
              onSnapToItem={index => this.setState({activeIndex: index})}
            />
            <View style={styles.dotsContainer}>
              <Pagination
                dotsLength={this.state.entries.length}
                activeDotIndex={this.state.activeIndex}
                carouselRef={c => (this._slider1Ref = c)}
                dotStyle={styles.dotStyle}
                dotColor="#000"
                inactiveDotColor="rgba(0, 0, 0, 0.3)"
                inactiveDotScale={1}
                tappableDots={true}
              />
            </View>
          </View>
          <View style={{paddingHorizontal: 16}}>
            <Text style={styles.headingStyle}>Log in or Sign up</Text>
            <Input
              placeholder="Email Id"
              onChangeText={e => this.setState({email: e, errorText: ''})}
              errorText={this.state.errorText}
              value={this.state.email}
              showIcon
            />
            <View
              style={{
                marginTop: 4,
              }}>
              <Buttons text="Continue" onPress={this.login} />
            </View>
            {/* <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text>or</Text>
              <View style={styles.line} />
            </View> */}
            <View style={styles.socialIconContainer}>
              <TestInsta />
              <TouchableOpacity onPress={this.googleLogin}>
                <Image
                  source={require('../../assets/google.webp')}
                  style={[styles.socialIcon, {marginHorizontal: 16}]}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.appleLogin}>
                <Image
                  source={require('../../assets/apple.webp')}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
            </View>
            <Buttons
              text="Login as a stylist"
              onPress={() => this.setState({showModal: true})}
              isInverse
            />
            <View style={styles.tncContainer}>
              <Text>By logging in you agree to our </Text>
              <TouchableOpacity onPress={() => this.openStaticPage('tt')}>
                <Text style={styles.tncText}>Terms and Conditions</Text>
              </TouchableOpacity>
              <Text> & </Text>
              <TouchableOpacity onPress={() => this.openStaticPage('pp')}>
                <Text style={styles.tncText}>Privacy policy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {this.state.showModal && (
          <OverlayModal
            isScrollEnabled={false}
            showModal={this.state.showModal}
            component={this.renderStylistLogin()}
          />
        )}
      </View>
    );
  }
}

export default connect(
  state => ({
    loginResponse: state.AuthReducer.loginResponse,
    googleLoginResponse: state.AuthReducer.googleLoginResponse,
    userId: state.AuthReducer.userId,
    isProfileCreated: state.AuthReducer.isProfileCreated,
    appleLoginResponse: state.AuthReducer.appleLoginResponse,
  }),
  dispatch =>
    bindActionCreators(
      {
        emptyLoginResponse,
        loginAction,
        googleLoginAction,
        storeUserId,
        appleLoginAction,
        emptyAppleResponse,
        emptyGoogleResponse,
      },
      dispatch,
    ),
)(LandingPage);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.grey1,
    borderRadius: 8,
    width: ITEM_WIDTH,
    paddingBottom: 16,
  },
  image: {
    width: ITEM_WIDTH,
    height: 240,
  },
  header: {
    color: '#000',
    fontSize: FONTS_SIZES.s3,
    fontWeight: '700',
    paddingLeft: 20,
    paddingTop: 20,
    textAlign: 'center',
  },
  body: {
    color: '#000',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    textAlign: 'center',
  },
  socialIcon: {
    width: 44,
    height: 44,
  },
  dotStyle: {
    width: 6,
    height: 6,
    borderRadius: 5,
    marginHorizontal: 0,
    backgroundColor: 'rgba(33, 36, 39, 1)',
  },
  dotsContainer: {
    alignItems: 'center',
    padding: 8,
  },
  headingStyle: {
    fontSize: FONTS_SIZES.s3,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  tncContainer: {
    paddingBottom: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  line: {
    width: '40%',
    height: 0.5,
    backgroundColor: Colors.black60,
  },
  socialIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 16,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  tncText: {
    color: '#217AFF',
    lineHeight: 20,
  },
});

export class TestInsta extends Component {
  render() {
    return (
      <>
        <TouchableOpacity onPress={() => this.instagramLogin.show()}>
          <Image
            source={require('../../assets/insta.webp')}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <InstagramLogin
          ref={ref => (this.instagramLogin = ref)}
          appId="2136446439890907"
          appSecret="b18deef2dfada2f0dfca918c0ea4cb7e"
          redirectUrl="https://www.google.co.in/"
          incognito={false}
          scopes={['user_profile', 'user_media']}
          onLoginSuccess={e => console.log('ndjkd', e)}
          onLoginFailure={data => console.log(data)}
          language="en" //default is 'en' for english
        />
      </>
    );
  }
}
