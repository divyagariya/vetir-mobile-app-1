/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
  TextInput,
} from 'react-native';
import {VView, VText, Buttons, Header, BigImage} from '../../../components';
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
import {hp} from '../../../utils/normalise';

const ClosetDetailsFrom = props => {
  const dispatch = useDispatch();
  const [bgImageUrl, setBgImag] = useState(
    props?.route?.params?.imgSource?.path,
  );

  const [priceText, setPriceText] = useState('');
  const [notesText, setNotesText] = useState('');
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
  const [loading, setLoading] = useState(false);

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
        setLoading(false);
        dispatch({type: 'ADD_TO_CLOSET', value: {}});
        Toast.show('Item successfully added to closet');
        dispatch(getClosetData());
        props.navigation.navigate('ClosetScreen');
      } else {
        setLoading(false);
      }
    }
  }, [addClosetResponse, dispatch, props.navigation]);

  useEffect(() => {
    if (Object.keys(editClosetResponse).length) {
      if (editClosetResponse.statusCode === 200) {
        dispatch(getClosetData());
        setLoading(false);
        dispatch({type: 'EDIT_CLOSET', value: {}});
        Toast.show('Information edited successfully');
        props.navigation.navigate('ClosetInfo', {
          apiData: editClosetResponse,
        });
      } else {
        setLoading(false);
      }
    }
  }, [editClosetResponse, dispatch, props.navigation]);

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
    if (!priceText) {
      Toast.show('Please add price');
      return;
    }
    // if (!selectedSeason.length) {
    //   Toast.show('Please select seasons');
    //   return;
    // }
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
    const price = priceText.replace(/\$/g, '');
    categorySelected = categorySelected.id.split(' ');

    let data = {
      userId: userId,
      categoryId: categorySelected[0],
      subCategoryId: categorySelected[1],
      brandId: state.brandSelected?.id,
      season: selectedSeason,
      colorCode: colorsFilter,
      price: price,
      notes: notesText,
      isImageBase64: isImageEdit,
      itemImageUrl: isImageEdit
        ? `data:image/jpeg;base64,${newImage?.data}`
        : props?.route?.params?.editCloset
        ? bgImageUrl
        : `data:image/jpeg;base64,${props?.route?.params?.imgSource?.data}`,
    };
    setLoading(true);
    if (props?.route?.params?.editCloset) {
      data.closetItemId = props.route?.params.editClosetData?.closetItemId;
      console.log('@@ edit data', JSON.stringify(data, undefined, 2));
      dispatch(editDataInCloset(data));
      return;
    }
    console.log('@@ update data', data);
    dispatch(addDataInCloset(data));
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

  const onChangePriceText = value => {
    if (priceText.length === 0) {
      setPriceText(`$${value}`);
    } else if (value.length === 1 && value[0] === '$') {
      setPriceText('');
    } else {
      setPriceText(value);
    }
  };

  const onChangeNotesText = value => {
    setNotesText(value);
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
                color: '#000',
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
                color: '#000',
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
            <VText text="Price" />
            <TextInput
              placeholder={'Price in which item was bought'}
              style={styles.priceInput}
              value={priceText || ''}
              maxLength={8}
              keyboardType="decimal-pad"
              onChangeText={onChangePriceText}
              autoCorrect={false}
            />
            <VText text="Notes" />
            <TextInput
              placeholder={'Add a note'}
              style={[styles.priceInput, {height: hp(60), padding: hp(10)}]}
              value={notesText || ''}
              multiline
              onChangeText={onChangeNotesText}
              autoCorrect={true}
            />
            <VText text="Season" />
            <VView style={{flexDirection: 'row'}}>
              {['spring', 'summer', 'autumn', 'winter'].map((item, index) => {
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
                      {item.colorName === 'multi' ? (
                        <Image
                          source={require('../../../assets/multi.png')}
                          style={{width: 24, height: 24, marginRight: 8}}
                        />
                      ) : (
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
                      )}
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
            <Buttons text="Add" onPress={addCloset} loading={loading} />
          </VView>
        </VView>
      </KeyboardAwareScrollView>
    </VView>
  );
};

export default React.memo(ClosetDetailsFrom);

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
  priceInput: {
    padding: 16,
    borderWidth: 1,
    marginVertical: hp(5),
    borderColor: '#ccc',
    backgroundColor: '#FFFFFF',
  },
});
