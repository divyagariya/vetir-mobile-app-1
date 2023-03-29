import React, {useEffect, useState} from 'react';
import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../colors';
import {BigImage, Buttons, Header, Loader} from '../../components';
import {removeBackgroundFromImage} from '../../redux/actions/closetAction';

const EditCloset = props => {
  const dispatch = useDispatch();
  const [isImageEdit, setImageEdit] = useState(false);
  const [newImage, setImage] = useState(null);
  const [bgImageData, setBgRemoval] = useState(false);
  const [removedBg, setRemovedImg] = useState(null);
  const editTools = [
    {
      type: 'crop',
      icon: require('../../assets/crop.png'),
    },
    {
      type: 'rotate',
      icon: require('../../assets/rotate.png'),
    },
  ];
  const removeBgResponse = useSelector(
    state => state.ClosetReducer.removeBgResponse,
  );

  useEffect(() => {
    if (Object.keys(removeBgResponse).length) {
      if (removeBgResponse.statusCode == 200) {
        dispatch({type: 'REMOVE_BG_IMAGE', value: {}});
        setRemovedImg(removeBgResponse?.imageData);
        setBgRemoval(true);
      }
    }
  }, [removeBgResponse]);

  const isLoading = useSelector(state => state.CommonLoaderReducer.isLoading);

  const editImage = type => {
    if (type === 'crop') {
      ImageCropPicker.openCropper({
        path: bgImageData
          ? `data:image/jpeg;base64,${removedBg}`
          : isImageEdit
          ? newImage.path
          : props?.route?.params?.imgSource?.path,
        width: 300,
        height: 400,
        includeBase64: true,
      }).then(image => {
        setImageEdit(true);
        setImage(image);
        setBgRemoval(false);
      });
    }
    if (type === 'rotate') {
      ImageCropPicker.openCropper({
        path: bgImageData
          ? `data:image/jpeg;base64,${removedBg}`
          : isImageEdit
          ? newImage.path
          : props?.route?.params?.imgSource?.path,
        width: 300,
        height: 400,
        cropping: false,
        includeBase64: true,
      }).then(image => {
        setImageEdit(true);
        setImage(image);
        setBgRemoval(false);
      });
    }
  };

  const removeBg = () => {
    dispatch(
      removeBackgroundFromImage({
        imageData: isImageEdit
          ? `data:image/jpeg;base64,${newImage.data}`
          : `data:image/jpeg;base64,${props?.route?.params?.imgSource.data}`,
      }),
    );
    dispatch({type: 'COMMON_LOADER', value: true});
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header showBack {...props} />
      <ScrollView style={{flex: 1}}>
        <BigImage
          imgSource={
            bgImageData
              ? `data:image/jpeg;base64,${removedBg}`
              : isImageEdit
              ? newImage?.path
              : props?.route?.params?.imgSource?.path
          }
        />
        <View style={{paddingHorizontal: 16}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginVertical: 16,
            }}>
            {editTools.map(item => {
              return (
                <TouchableOpacity
                  onPress={() => editImage(item.type)}
                  style={{
                    flex: 1,
                    paddingVertical: 28,
                    backgroundColor: Colors.grey1,
                    alignItems: 'center',
                    marginHorizontal: 8,
                  }}>
                  <Image source={item.icon} style={{width: 24, height: 24}} />
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{marginBottom: 12}}>
            <Buttons text="remove background" isInverse onPress={removeBg} />
          </View>
          <Buttons
            text="next"
            onPress={() =>
              props.navigation.navigate('ClosetDetailsFrom', {
                imgSource: bgImageData
                  ? {
                      path: `data:image/jpeg;base64,${removedBg}`,
                      data: removedBg,
                    }
                  : isImageEdit
                  ? newImage
                  : props?.route?.params?.imgSource,
              })
            }
          />
        </View>
      </ScrollView>
      {isLoading ? <Loader /> : null}
    </View>
  );
};

export default EditCloset;
