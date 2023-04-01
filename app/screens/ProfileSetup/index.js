import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Colors} from '../../colors';
import {Buttons, Input} from '../../components';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  getUserProfile,
  updateUserProfile,
} from '../../redux/actions/profileAction';
import Toast from 'react-native-simple-toast';

const ProfileSetup = props => {
  const [isImageRemove, setImage] = useState(false);
  const userProfileResponse =
    useSelector(state => state.ProfileReducer.userProfileResponse) || {};
  const udpateProfileRepose = useSelector(
    state => state.ProfileReducer.udpateProfileRepose,
  );
  const [state, setState] = useState({
    page1: true,
    page2: false,
    page3: false,
    currentActiveTab: 0,
    genderData: [{type: 'male'}, {type: 'female'}, {type: 'other'}],
    genderSelected: userProfileResponse?.gender,
    userImage: userProfileResponse?.profilePicUrl,
    name: userProfileResponse?.name,
    fromLocal: false,
  });

  useEffect(() => {
    return () => {
      setState({
        ...state,
        page1: true,
        page2: false,
        page3: false,
        currentActiveTab: 0,
      });
    };
  }, []);

  useEffect(() => {
    if (Object.keys(userProfileResponse).length) {
      setState({
        ...state,
        genderSelected: userProfileResponse?.gender,
        userImage: userProfileResponse?.profilePicUrl,
        name: userProfileResponse?.name,
      });
    }
  }, [userProfileResponse]);

  const dispatch = useDispatch();

  const userId = useSelector(state => state.AuthReducer.userId);

  const isProfileCreated = useSelector(
    state => state.AuthReducer.isProfileCreated,
  );

  useEffect(() => {
    if (Object.keys(udpateProfileRepose).length) {
      if (udpateProfileRepose.statusCode == 200 && isProfileCreated) {
        Toast.show('Profile Update successfully');
        props.navigation.navigate('TabData');
        dispatch({type: 'PROFILE_DATA_UPDATED', value: ''});
        dispatch(getUserProfile());
      }
    }
  }, [dispatch, props.navigation, udpateProfileRepose, isProfileCreated]);

  const selectGeneder = (item, index) => {
    setState({...state, genderSelected: item.type, genderErr: ''});
  };

  const pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      setState({...state, userImage: image, fromLocal: true});
    });
  };

  const handleName = () => {
    let {name, nameError} = state;
    if (!name) {
      nameError = 'Please enter your name';
      setState({...state, nameError});
    } else {
      setState({...state, currentActiveTab: 1, page2: true});
    }
  };

  const handleGender = () => {
    let {genderSelected, genderErr} = state;
    if (!genderSelected) {
      setState({...state, genderErr: '*Please Select your gender'});
    } else {
      setState({...state, currentActiveTab: 2, page3: true});
    }
  };

  const getname = () => {
    return (
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              marginTop: 40,
              marginBottom: 8,
            }}>
            What’s your name?
          </Text>
          <Input
            placeholder="Name"
            errorText={state.nameError}
            onChangeText={e => setState({...state, name: e, nameError: ''})}
            value={state.name}
          />
          <Text style={{fontSize: 13}}>
            You can change this later in your profile settings
          </Text>
        </View>
        <View>
          <Buttons text="Next" onPress={handleName} />
        </View>
      </View>
    );
  };

  const getGender = () => {
    return (
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              marginTop: 40,
              marginBottom: 8,
            }}>
            What’s your gender?
          </Text>
          <View style={{flexDirection: 'row', marginVertical: 16}}>
            {state.genderData.map((item, index) => {
              return (
                <TouchableOpacity
                  style={{
                    paddingVertical: 24,
                    paddingHorizontal: 20,
                    borderWidth: 1,
                    borderColor:
                      item.type === state.genderSelected
                        ? Colors.black
                        : Colors.greyBorder,
                    marginHorizontal: index == 1 && 8,
                  }}
                  onPress={() => selectGeneder(item, index)}>
                  <Text style={{textTransform: 'capitalize'}}>{item.type}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {state.genderErr && (
            <Text style={{color: 'red'}}>{state.genderErr}</Text>
          )}
          <Text style={{fontSize: 13, lineHeight: 20}}>
            Feeds will be prioritised based on your selected gender. You can
            change this later in your profile settings
          </Text>
        </View>
        <View>
          <Buttons text="Next" onPress={handleGender} />
          <Buttons
            text="go back"
            isInverse
            noBorder
            onPress={() =>
              setState({...state, currentActiveTab: 0, page2: false})
            }
          />
        </View>
      </View>
    );
  };

  const updateProfile = () => {
    let data = {
      emailId: userProfileResponse?.emailId,
      name: state.name,
      gender: state.genderSelected.toLowerCase(),
      userId: userId,
    };
    if (!state.fromLocal) {
      data.base64ImgString = null;
    }
    if (state.fromLocal) {
      data.base64ImgString = `data:image/png;base64,${state.userImage?.data}`;
    }
    if (isProfileCreated && isImageRemove) {
      data.base64ImgString = null;
    }
    if (
      state.name === userProfileResponse?.name &&
      state.genderSelected === userProfileResponse?.gender &&
      state.userImage === userProfileResponse?.profilePicUrl
    ) {
      props.navigation.navigate('TabData');
      return;
    }
    dispatch(updateUserProfile(data));
  };

  const getProfilePic = () => {
    return (
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              marginTop: 40,
              marginBottom: 8,
            }}>
            Wanna upload your cool picture?
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          {state.userImage ? (
            <View style={{alignItems: 'center'}}>
              <Image
                source={{
                  uri: state.fromLocal ? state.userImage.path : state.userImage,
                }}
                style={{width: 128, height: 128, borderRadius: 64}}
              />
              <TouchableOpacity
                style={{padding: 5, margin: 10}}
                onPress={pickImage}>
                <Text style={{color: '#217AFF'}}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{padding: 5}}
                onPress={() => {
                  setImage(false);
                  setState({...state, userImage: null});
                }}>
                <Text style={{color: '#217AFF'}}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Image
                source={require('../../assets/iProfile.png')}
                style={{width: 128, height: 128}}
              />
              <TouchableOpacity
                style={{padding: 5, margin: 10}}
                onPress={pickImage}>
                <Text style={{color: '#217AFF'}}>Upload</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View>
          <Buttons text={'Done'} onPress={updateProfile} />
          <Buttons
            text="go back"
            isInverse
            noBorder
            onPress={() =>
              setState({...state, currentActiveTab: 1, page3: false})
            }
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{padding: 16, flex: 1, backgroundColor: 'white'}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <View
          style={{
            width: 100,
            borderWidth: 1,
            borderColor: state.page1 ? Colors.black : Colors.greyBorder,
          }}
        />
        <View
          style={{
            width: 100,
            borderWidth: 1,
            marginHorizontal: 16,
            borderColor: state.page2 ? Colors.black : Colors.greyBorder,
          }}
        />
        <View
          style={{
            width: 100,
            borderWidth: 1,
            borderColor: state.page3 ? Colors.black : Colors.greyBorder,
          }}
        />
      </View>
      {state.currentActiveTab === 0
        ? getname()
        : state.currentActiveTab == 1
        ? getGender()
        : getProfilePic()}
    </View>
  );
};

export default ProfileSetup;
