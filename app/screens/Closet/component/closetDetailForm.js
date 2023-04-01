/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
} from 'react-native';
import {
  VView,
  VText,
  Buttons,
  Header,
  BigImage,
  OverlayModal,
} from '../../../components';
import {Colors} from '../../../colors';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {useDispatch, useSelector} from 'react-redux';
import {
  addDataInCloset,
  editDataInCloset,
  getClosetData,
} from '../../../redux/actions/closetAction';
import Toast from 'react-native-simple-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ColorPicker from 'react-native-wheel-color-picker';
import ImageCropPicker from 'react-native-image-crop-picker';

const ClosetDetailsFrom = props => {
  const dispatch = useDispatch();
  const [bgImageUrl, setBgImag] = useState(
    props?.route?.params?.imgSource?.path,
  );
  const [currentColor, setCurrentColor] = useState('');
  const [swatchesOnly, setSwatchesOnly] = useState('');

  const [swatchesLast, setSwatchesLast] = useState(true);
  const [swatchesEnabled, setSwatchesEnabled] = useState('');
  const [disc, setDisc] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [getColor, setGetColor] = useState('#fff');
  const [showModal, setShowModal] = useState(false);
  const [selectedSeason, setSeason] = useState([]);
  const brandData = useSelector(state => state.ClosetReducer.brandData);
  const categoryData = useSelector(state => state.ClosetReducer.categoryData);
  const userId = useSelector(state => state.AuthReducer.userId);
  const [isImageEdit, setImageEdit] = useState(false);
  const [newImage, setImage] = useState(null);
  const getColorsResponse = useSelector(
    state => state.ClosetReducer.getColorsResponse,
  );
  const [colorsFilter, setColors] = useState([]);

  const addClosetResponse = useSelector(
    state => state.ClosetReducer.addClosetResponse,
  );
  const editClosetResponse = useSelector(
    state => state.ClosetReducer.editClosetResponse,
  );

  const [state, setState] = useState({
    brandDataUpdated: [],
    brandSelected: '',
    categoryDataUpdated: [],
  });

  useEffect(() => {
    if (props?.route?.params?.editClosetData) {
      console.log(
        '@@ props?.route?.params?.editClosetData',
        props?.route?.params?.editClosetData,
      );
      setColors(props.route?.params?.editClosetData?.colorCode);
      setSeason(props?.route?.params?.editClosetData?.season);
      let brandSelected1 = {
        name: props?.route?.params?.editClosetData?.brandName,
        id: props?.route?.params?.editClosetData?.brandId,
      };
      let categorySelected1 = {
        name:
          props?.route?.params?.editClosetData?.categoryName +
          ' --> ' +
          props?.route?.params?.editClosetData?.subCategoryName,
        id: `${props?.route?.params?.editClosetData?.categoryId} ${props?.route?.params?.editClosetData?.subCategoryId}`,
      };
      setBgImag(props?.route?.params?.editClosetData?.itemImageUrl);
      setState({
        ...state,
        brandSelected: brandSelected1,
        categorySelected: categorySelected1,
      });
    }
  }, []);

  useEffect(() => {
    if (Object.keys(addClosetResponse).length) {
      if (addClosetResponse.statusCode == 200) {
        dispatch({type: 'ADD_TO_CLOSET', value: {}});
        Toast.show('Cloth successfully added in closet');
        dispatch(getClosetData());
        props.navigation.navigate('ClosetScreen');
      }
    }
  }, [addClosetResponse, dispatch, props.navigation]);

  useEffect(() => {
    if (Object.keys(editClosetResponse).length) {
      if (editClosetResponse.statusCode === 200) {
        dispatch({type: 'EDIT_CLOSET', value: {}});
        Toast.show('Closet Information edit successfully');
        props.navigation.navigate('ClosetInfo', {
          apiData: editClosetResponse,
        });
      }
    }
  }, [editClosetResponse, dispatch]);

  useEffect(() => {
    let brandSelected1 = {};
    let categorySelected1;
    if (props?.route?.params?.editClosetData) {
      setColors(props.route?.params?.editClosetData?.colorCode);
      setSeason(props?.route?.params?.editClosetData?.season);
      brandSelected1 = {
        name: props?.route?.params?.editClosetData?.brandName,
        id: props?.route?.params?.editClosetData?.brandId,
      };
      categorySelected1 = {
        name:
          props?.route?.params?.editClosetData?.categoryName +
          ' --> ' +
          props?.route?.params?.editClosetData?.subCategoryName,
        id: `${props?.route?.params?.editClosetData?.categoryId} ${props?.route?.params?.editClosetData?.subCategoryId}`,
      };
      setBgImag(props?.route?.params?.editClosetData?.itemImageUrl);
    }
    let items = brandData.map(item => {
      return {
        name: item.brandName,
        id: item.brandId,
      };
    });
    let groupedData = categoryData.flatMap(el =>
      el.subCategory.map(proj => ({
        name: el.categoryName + ' --> ' + proj.subCategoryName,
        id: el.categoryId + ' ' + proj.subCategoryId,
      })),
    );
    setState({
      ...state,
      brandDataUpdated: items,
      categoryDataUpdated: groupedData,
      brandSelected: brandSelected1,
      categorySelected: categorySelected1,
    });
  }, []);

  const addCloset = () => {
    let {brandSelected, categorySelected} = state;
    if (!brandSelected) {
      Toast.show('Please select Brand from given options');
      return;
    }
    if (!categorySelected) {
      Toast.show('Please select Category from given options');
      return;
    }
    if (!selectedSeason.length) {
      Toast.show('Please select seasons');
      return;
    }
    if (categorySelected && !categorySelected?.id) {
      Toast.show('Please select Category from given options');
      return;
    }
    if (brandSelected && !brandSelected?.id) {
      Toast.show('Please select Category from given options');
      return;
    }
    if (!colorsFilter.length) {
      Toast.show('Please select one color');
      return;
    }
    categorySelected = categorySelected.id.split(' ');

    let data = {
      userId: userId,
      categoryId: categorySelected[0],
      subCategoryId: categorySelected[1],
      brandId: state.brandSelected?.id,
      season: selectedSeason,
      colorCode: colorsFilter,
      isImageBase64: isImageEdit,
      itemImageUrl: isImageEdit
        ? `data:image/jpeg;base64,${newImage?.data}`
        : props?.route?.params?.editCloset
        ? bgImageUrl
        : `data:image/jpeg;base64,${props?.route?.params?.imgSource?.data}`,
    };
    if (props?.route?.params?.editCloset) {
      data.closetItemId = props.route?.params.editClosetData?.closetItemId;
      console.log('@@ edit data', JSON.stringify(data, undefined, 2));
      dispatch(editDataInCloset(data));
      return;
    }
    console.log('@@ update data', data);
    dispatch(addDataInCloset(data));
  };

  const onColorSelect = clr => {
    setGetColor(clr);
  };

  const editImage = () => {
    ImageCropPicker.openCropper({
      path: props?.route?.params?.editCloset
        ? bgImageUrl
        : `data:image/png;base64,${props?.route?.params?.imgSource?.data}`,
      width: 300,
      height: 400,
      cropping: false,
      includeBase64: true,
    }).then(image => {
      setImageEdit(true);
      setImage(image);
      setBgImag(image.path);
    });
  };

  const setSeasonData = item => {
    let selectedSeason1 = [...selectedSeason];
    if (!selectedSeason.includes(item)) {
      selectedSeason1.push(item);
    } else {
      selectedSeason1 = selectedSeason1.filter(i => i !== item);
    }

    setSeason(selectedSeason1);
  };

  const setColorsFilter = colorCode => {
    let colorsFilter1 = [...colorsFilter];
    if (!colorsFilter1.includes(colorCode)) {
      colorsFilter1.push(colorCode);
    } else {
      colorsFilter1 = colorsFilter1.filter(i => i !== colorCode);
    }
    setColors(colorsFilter1);
  };

  return (
    <VView style={{backgroundColor: 'white', flex: 1}}>
      <VView>
        <Header {...props} showBack />
      </VView>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <BigImage imgSource={bgImageUrl} showEdit editImage={editImage} />
        <VView style={{padding: 16}}>
          <VView>
            <VText text="Category" />
            <SearchableDropdown
              onTextChange={text =>
                setState({...state, categorySelected: text})
              }
              onItemSelect={item =>
                setState({...state, categorySelected: item})
              }
              containerStyle={styles.dropDownContainer}
              textInputStyle={styles.inputContainer}
              textInputProps={{value: state.categorySelected?.name}}
              itemStyle={styles.searchItemContainer}
              itemTextStyle={{
                color: '#222',
              }}
              itemsContainerStyle={{
                maxHeight: '60%',
              }}
              items={state.categoryDataUpdated}
              defaultIndex={2}
              placeholder="Tops, Pants, Shorts..."
              resPtValue={false}
              underlineColorAndroid="transparent"
            />
            <VText text="Brand" />
            <SearchableDropdown
              onTextChange={text =>
                setState({...state, brandSelected: text.name})
              }
              onItemSelect={item => setState({...state, brandSelected: item})}
              containerStyle={styles.dropDownContainer}
              textInputStyle={styles.inputContainer}
              textInputProps={{value: state.brandSelected?.name}}
              itemStyle={styles.searchItemContainer}
              itemTextStyle={{
                color: '#222',
              }}
              itemsContainerStyle={{
                maxHeight: '60%',
              }}
              items={state.brandDataUpdated}
              defaultIndex={2}
              placeholder="H&M, Zara, Nike..."
              resPtValue={false}
              underlineColorAndroid="transparent"
            />

            <VText text="Season" />
            <VView style={{flexDirection: 'row'}}>
              {['spring', 'summer', 'Autumn', 'winter'].map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => setSeasonData(item)}
                    style={[
                      styles.seasonContainer,
                      {
                        borderColor: selectedSeason.includes(item)
                          ? Colors.black60
                          : 'rgba(0,0,0,0.16)',
                      },
                    ]}>
                    <VText style={{textTransform: 'capitalize'}} text={item} />
                  </TouchableOpacity>
                );
              })}
            </VView>
            <VView style={{marginVertical: 16}}>
              <VText
                text="Color"
                style={{
                  marginBottom: 8,
                }}
              />
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {getColorsResponse?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => setColorsFilter(item.colorCode)}
                      style={{
                        borderWidth: 1,
                        padding: 8,
                        marginRight: 8,
                        borderColor: Colors.greyBorder,
                        marginBottom: 8,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: colorsFilter.includes(item.colorCode)
                          ? Colors.grey2
                          : 'transparent',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          backgroundColor: item.colorCode,
                          borderWidth: 1,
                          borderColor: Colors.greyBorder,
                          marginRight: 8,
                        }}
                      />
                      <Text>{item.colorName}</Text>
                      {colorsFilter.includes(item.colorCode) ? (
                        <Image
                          source={require('../../../assets/crossIcon.png')}
                          style={{width: 12, height: 12, marginLeft: 8}}
                        />
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </VView>
            <Buttons text="Add" onPress={addCloset} />
          </VView>
        </VView>
      </KeyboardAwareScrollView>
    </VView>
  );
};

export default ClosetDetailsFrom;

const styles = StyleSheet.create({
  seasonContainer: {
    borderWidth: 1,
    marginRight: 8,
    padding: 8,
    borderColor: 'rgba(0,0,0,0.16)',
    marginTop: 8,
  },
  dropDownContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    backgroundColor: Colors.grey1,
    height: 350,
  },
  inputContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#FFFFFF',
  },
  searchItemContainer: {
    padding: 10,
    marginTop: 2,
    backgroundColor: '#FFFFFF',
    borderColor: '#bbb',
    borderWidth: 1,
  },
});
