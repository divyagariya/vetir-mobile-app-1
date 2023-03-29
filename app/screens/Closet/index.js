import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Image,
  TouchableHighlight,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {
  Buttons,
  Header,
  Input,
  OverlayModal,
  SortComponent,
  VText,
  VView,
} from '../../components';
import {Images} from '../../assets';
import {Colors} from '../../colors';
import {useDispatch, useSelector} from 'react-redux';
import {
  getFilterCloset,
  openClosetDetails,
} from '../../redux/actions/closetAction';
import WebView from 'react-native-webview';
import ViewShot, {captureRef} from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Modal from 'react-native-modal';
import {FONTS_SIZES} from '../../fonts';
import CheckBox from '@react-native-community/checkbox';
import moment from 'moment';

const {height} = Dimensions.get('screen');
export default props => {
  const sortingData = [
    {
      type: 'desc',
      title: 'Latest First',
      isSelected: false,
    },
    {
      type: 'asc',
      title: 'Last First',
      isSelected: true,
    },
  ];
  const dispatch = useDispatch();
  const captureViewRef = useRef();
  const [showModal, setModal] = useState(false);
  const [showWebView, setWebView] = useState(false);
  const [gridType, setGrid] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const getcloset = useSelector(state => state.ClosetReducer.getcloset);
  const [gridClosetData, setGridClosetData] = useState([]);
  const [showSortModal, setSortModal] = useState(false);
  const userId = useSelector(state => state.AuthReducer.userId);
  const [filterClosetData, setFilterClosetData] = useState(getcloset);
  const [selectedSort, setSelectedSort] = useState({
    type: 'asc',
    title: 'Price Low to High',
    isSelected: false,
  });
  const [selectedSortIndex, setSelectedSortIndex] = useState(null);
  const categoryData = useSelector(state => state.ClosetReducer.categoryData);

  const singleClosetReponse = useSelector(
    state => state.ClosetReducer.singleClosetReponse,
  );

  useEffect(() => {
    if (Object.keys(singleClosetReponse).length) {
      dispatch({type: 'SINGLE_CLOSET', value: {}});
      props.navigation.navigate('ClosetInfo', {
        apiData: singleClosetReponse,
      });
    }
  }, [dispatch, props.navigation, singleClosetReponse]);

  useEffect(() => {
    let categoryArray = [...new Set(getcloset.map(item => item.categoryName))];

    let finalArray = [];

    for (let i = 0; i < categoryArray.length; i++) {
      let tempArray = [];
      for (let j = 0; j < getcloset.length; j++) {
        if (getcloset[j].categoryName === categoryArray[i]) {
          tempArray.push(getcloset[j]);
        }
      }
      finalArray.push({
        total: tempArray.length,
        category: categoryArray[i],
        subCategory: tempArray,
      });
      setGridClosetData(finalArray);
    }
  }, [getcloset]);

  const handleCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(img => {
      props.navigation.navigate('EditCloset');
      props.navigation.navigate('EditCloset', {
        imgSource: img,
      });
    });
  };

  const handleGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(img => {
      props.navigation.navigate('EditCloset', {
        imgSource: img,
      });
    });
  };

  const emptyScreen = () => {
    return (
      <VView style={styles.bodyContainer}>
        <VView
          style={{
            flex: 0.8,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/empty_closet.png')}
            style={styles.whiteBoxStyle}
          />
          <VText
            text={'Your closet is empty. Add clothes to get...'}
            style={styles.emptyClosetText}
          />
          <VView style={{marginTop: 16}}>
            <Image
              source={Images.lineArrow}
              style={styles.lineArrowStyle}
              resizeMode="stretch"
            />
          </VView>
        </VView>
      </VView>
    );
  };

  const switchValue = value => {
    setGrid(value);
  };

  const listGrid = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: 16,
        }}>
        {gridClosetData.length
          ? gridClosetData.map(item => {
              return (
                <TouchableOpacity
                  style={{
                    width: '50%',
                    marginVertical: 8,
                  }}
                  onPress={() =>
                    props.navigation.navigate('ClosetCategory', {
                      categoryType: item,
                    })
                  }>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-evenly',
                    }}>
                    {item.subCategory.length !== 0 &&
                      [1, 2, 3, 4].map((i, index) => {
                        return (
                          <View
                            key={i.closetItemId}
                            style={{
                              width: '45%',
                              height: 80,
                              backgroundColor: Colors.grey1,
                              marginVertical: 3,
                              justifyContent: 'center',
                            }}>
                            {item.subCategory[index]?.itemImageUrl && (
                              <Image
                                source={{
                                  uri: item.subCategory[index]?.itemImageUrl,
                                }}
                                resizeMode="contain"
                                style={{width: '95%', height: '95%'}}
                              />
                            )}
                          </View>
                        );
                      })}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      margin: 8,
                    }}>
                    <Text>{item.category}</Text>
                    <Text>{item.total}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          : null}
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => setActiveTab(item.categoryName)}
        style={{
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor:
            activeTab === item.categoryName ? Colors.black60 : 'transparent',
        }}>
        <Text
          style={{
            fontSize: 15,
            color: activeTab === item.categoryName ? '#000' : Colors.black60,
          }}>
          {item.categoryName}
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (activeTab) {
      if (activeTab !== 'All') {
        let filterData = getcloset;
        filterData = getcloset.filter(item => {
          if (item.categoryName === activeTab) {
            return {...item};
          }
        });
        setFilterClosetData(filterData);
      } else {
        setFilterClosetData(getcloset);
      }
    }
  }, [activeTab, getcloset]);

  const lisSectionGrid = () => {
    return (
      <View>
        <FlatList
          data={[{categoryName: 'All'}, ...categoryData]}
          horizontal
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.categoryName}
        />
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: 8,
            marginTop: 16,
          }}>
          {filterClosetData.length > 0 ? (
            filterClosetData.map(item => {
              return (
                <TouchableOpacity
                  style={{
                    width: '45%',
                    alignItems: 'center',
                    backgroundColor: Colors.grey1,
                    margin: 8,
                  }}
                  onPress={() => openClosetInfo(item.closetItemId)}>
                  <Image
                    source={{uri: item.itemImageUrl}}
                    style={{width: 150, height: 140}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              );
            })
          ) : (
            <View
              style={{
                alignItems: 'center',
                flex: 1,
                height: height * 0.6,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: Colors.black60,
                  fontSize: 15,
                }}>
                Umm, nothing is here...
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const openClosetInfo = id => {
    let data = {
      userId: userId,
      closetItemId: id,
    };
    dispatch(openClosetDetails(data));
  };

  const onCapture = () => {
    captureRef(captureViewRef, {
      format: 'jpeg',
      quality: 0.9,
    }).then(
      uri => {
        RNFS.readFile(uri, 'base64').then(res => {
          props.navigation.navigate('EditCloset', {
            imgSource: {data: res, path: uri},
            from: 'google',
          });
          setWebView(false);
        });

        // console.warn(uri);
      },
      error => alert('Oops, snapshot failed', error),
    );
  };

  const showFilterFunction = value => {
    setModal(true);
  };

  const setFilter = data => {
    setModal(false);
    let dataObj = {
      categoryIds: data.selectedCategory,
      subCategoryIds: data.selectedSubCategory,
      brandIds: data.selectedBrands,
      seasons: data.seasonData,
      colorCodes: data.colorsFilter,
      userId: userId,
    };
    props.navigation.navigate('ClosetFilter', {
      filterData: dataObj,
    });
  };

  const handleSortingOption = (item, index) => {
    setSelectedSort(item);
    setSelectedSortIndex(index);
  };

  const handleSorting = () => {
    setSortModal(false);
    let data = filterClosetData;
    data = data.sort((a, b) => {
      if (selectedSort.type === 'desc') {
        return moment(a.createdOn) < moment(b.createdOn) ? 1 : -1;
      } else if (selectedSort.type === 'asc') {
        return moment(a.createdOn) > moment(b.createdOn) ? 1 : -1;
      }
    });
    setFilterClosetData(data);
  };

  const handleSortingModal = () => {
    setSortModal(true);
  };

  return (
    <VView style={styles.container}>
      <Header
        title="Closet"
        showMenu
        navigation={props.navigation}
        showSwitch={getcloset.length > 0}
        showFilter={gridType}
        showSort={gridType}
        switchValue={switchValue}
        showFilterFunction={showFilterFunction}
        handleSorting={handleSortingModal}
      />
      {getcloset.length === 0 ? (
        emptyScreen()
      ) : (
        <ScrollView style={{}}>
          {gridType ? lisSectionGrid() : listGrid()}
        </ScrollView>
      )}

      {showWebView ? (
        <View
          style={{
            margin: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              width: '45%',
              alignItems: 'center',
              backgroundColor: 'black',
              paddingVertical: 20,
            }}
            onPress={onCapture}>
            <Text style={{color: 'white', textTransform: 'uppercase'}}>
              Add to Closet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setWebView(false)}
            style={{
              width: '45%',
              alignItems: 'center',
              backgroundColor: 'black',
              paddingVertical: 20,
            }}>
            <Text style={{color: 'white', textTransform: 'uppercase'}}>
              cancel
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <VView style={styles.footerContainer}>
          <TouchableHighlight
            underlayColor={'rgba(0,0,0,0.1)'}
            onPress={handleCamera}
            style={styles.footerImageContainer}>
            <Image
              source={Images.camera}
              style={styles.footerImage}
              resizeMode="contain"
            />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={'rgba(0,0,0,0.1)'}
            onPress={handleGallery}
            style={styles.footerImageContainer}>
            <Image
              source={Images.photos}
              style={styles.footerImage}
              resizeMode="contain"
            />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={'rgba(0,0,0,0.1)'}
            onPress={() => setWebView(true)}
            style={styles.footerImageContainer}>
            <Image
              source={Images.googleIcon}
              style={styles.footerImage}
              resizeMode="contain"
            />
          </TouchableHighlight>
        </VView>
      )}
      {showWebView && (
        <View
          ref={captureViewRef}
          style={{
            height: '90%',
            position: 'absolute',
            zIndex: 999,
            width: '100%',
          }}>
          <WebView
            automaticallyAdjustContentInsets={false}
            source={{
              uri: 'https://www.google.co.in/',
            }}
          />
        </View>
      )}
      {
        <FilterModal
          from="closet"
          showModal={showModal}
          categoryDataArray={gridClosetData}
          hideModal={() => setModal(false)}
          setFilter={setFilter}
          filterValue={{
            selectedCategory: [],
            setSeasonData: [],
            selectedBrands: [],
            selectedSubCategory: [],
            colorsFilter: [],
          }}
        />
      }
      <OverlayModal
        showModal={showSortModal}
        component={
          <SortComponent
            sortingData={sortingData}
            setSortModal={setSortModal}
            handleSortingOption={handleSortingOption}
            handleSorting={handleSorting}
            selectedSortIndex={selectedSortIndex}
          />
        }
      />
    </VView>
  );
};

export const FilterModal = ({
  showModal = false,
  hideModal = () => {},
  setFilter = () => {},
  filterValue = {},
  onResetFilter = () => {},
  from = '',
}) => {
  const [selectedFilter, setSelectedFilter] = useState('Category');
  const categoryData = useSelector(state => state.ClosetReducer.categoryData);
  const brandData = useSelector(state => state.ClosetReducer.brandData);
  const brandData2 = useSelector(state => state.ClosetReducer.brandData2);
  console.log('@@ brandData2', JSON.stringify(brandData2, undefined, 2));
  const getColorsResponse = useSelector(
    state => state.ClosetReducer.getColorsResponse,
  );
  const getSizeResponse = useSelector(
    state => state.ClosetReducer.getSizeResponse,
  );
  const [brandList, setBrandList] = useState(
    from === 'home' ? brandData2 : brandData,
  );
  const [brandSearchKey, setBrandSearchKey] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [seasonData, setSeasonData] = useState([]);
  const [colorsFilter, setColors] = useState([]);
  const [sizeFilter, setSizeFilter] = useState([]);
  const filterKeys =
    from !== 'closet'
      ? ['Category', 'Brand', 'Season', 'Color', 'Size', 'Price']
      : ['Category', 'Brand', 'Season', 'Color'];
  const [priceFilterObj, setPriceObj] = useState([]);

  const [priceFilter, setPriceFilter] = useState([
    {isChecked: false, min: 0, max: 1000, id: '1'},
    {isChecked: false, min: 1000, max: 2000, id: '2'},
    {isChecked: false, min: 2000, max: 3000, id: '3'},
    {isChecked: false, min: 3000, max: 4000, id: '4'},
    {isChecked: false, min: 4000, max: 5000, id: '5'},
    {isChecked: false, min: 5000, max: 6000, id: '6'},
    {isChecked: false, min: 6000, max: 'and above', id: '7'},
  ]);

  const handleCheckBox = (item, index) => {
    let priceFilter1 = [...priceFilter];
    priceFilter1[index].isChecked = !priceFilter1[index].isChecked;
    setPriceFilter(priceFilter1);
  };

  console.log('@@ selectedBrands', selectedBrands);

  useEffect(() => {
    if (Object.keys(filterValue).length) {
      setSelectedCategory(filterValue?.selectedCategory);
      setSelectedSubCategory(filterValue?.selectedSubCategory);
      setSelectedBrands(filterValue?.selectedBrands);
      setSeasonData(filterValue?.setSeasonData);
      setColors(filterValue?.colorsFilter);
      setSizeFilter(filterValue?.sizeFilter);
    }
  }, [filterValue]);

  const setSeasonDataFunction = item => {
    let selectedSeason1 = [...seasonData];
    if (!seasonData.includes(item)) {
      selectedSeason1.push(item);
    } else {
      selectedSeason1 = selectedSeason1.filter(i => i !== item);
    }
    setSeasonData(selectedSeason1);
  };

  const setSizesData = item => {
    let sizeFilter1 = [...sizeFilter];
    if (!sizeFilter1.includes(item.sizeCode)) {
      sizeFilter1.push(item.sizeCode);
    } else {
      sizeFilter1 = sizeFilter1.filter(i => i !== item.sizeCode);
    }
    setSizeFilter(sizeFilter1);
  };

  const searchBrand = e => {
    setBrandSearchKey(e);
    let allBrandList = brandData;
    allBrandList = allBrandList.filter(i => {
      return i.brandName.toLowerCase().includes(e.toLowerCase());
    });
    setBrandList(allBrandList);
  };

  const setBrandsFilter = item => {
    let selectedBrands1 = [...selectedBrands];
    if (selectedBrands.includes(item.brandId)) {
      selectedBrands1 = selectedBrands1.filter(i => i !== item.brandId);
    } else {
      selectedBrands1.push(item.brandId);
    }
    setSelectedBrands(selectedBrands1);
  };

  const handleCategoryFilter = (item, i) => {
    let selectedCategory1 = [...selectedCategory];
    let selectedSubCategory1 = [...selectedSubCategory];

    if (selectedSubCategory1.includes(i.subCategoryId)) {
      selectedSubCategory1 = selectedSubCategory1.filter(
        data => data !== i.subCategoryId,
      );
      if (selectedCategory1.includes(item.categoryId)) {
        selectedCategory1.pop();
      }
    } else {
      selectedSubCategory1.push(i.subCategoryId);
      selectedCategory1.push(item.categoryId);
    }

    setSelectedCategory(selectedCategory1);
    setSelectedSubCategory(selectedSubCategory1);
  };

  const resetFilterValues = () => {
    setSelectedBrands([]);
    setSelectedCategory([]);
    setSelectedSubCategory([]);
    setSeasonData([]);
    setColors([]);
    setSizeFilter([]);
    setPriceFilter([
      {isChecked: false, min: 0, max: 1000, id: '1'},
      {isChecked: false, min: 1000, max: 2000, id: '2'},
      {isChecked: false, min: 2000, max: 3000, id: '3'},
      {isChecked: false, min: 3000, max: 4000, id: '4'},
      {isChecked: false, min: 4000, max: 5000, id: '5'},
      {isChecked: false, min: 5000, max: 6000, id: '6'},
      {isChecked: false, min: 6000, max: 'and above', id: '7'},
    ]);
  };

  const setColorsFilter = colorName => {
    let colorsFilter1 = [...colorsFilter];
    if (!colorsFilter1.includes(colorName)) {
      colorsFilter1.push(colorName);
    } else {
      colorsFilter1 = colorsFilter1.filter(i => i !== colorName);
    }
    setColors(colorsFilter1);
  };

  useEffect(() => {
    let priceFilterObj1 = [];
    priceFilter.map(item => {
      if (item.isChecked) {
        priceFilterObj1.push(item);
      }
    });
    setPriceObj(priceFilterObj1);
  }, [priceFilter]);

  return (
    <View>
      <Modal
        animationIn="fadeInUpBig"
        avoidKeyboard
        animationInTiming={400}
        animationOutTiming={900}
        isVisible={showModal}
        style={{
          margin: 0,
        }}>
        <View
          style={{
            backgroundColor: 'white',
            paddingVertical: 30,
            paddingHorizontal: 16,
            flex: 1,
          }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 24,
            }}>
            <Text style={{fontSize: FONTS_SIZES.s3, fontWeight: 'bold'}}>
              Filters
            </Text>
            <TouchableOpacity
              onPress={hideModal}
              style={{
                height: 32,
                width: 32,
                zIndex: 600,
                borderRadius: 50,
                alignSelf: 'flex-end',
              }}>
              <Image
                source={require('../../assets/cross.webp')}
                style={{
                  height: '100%',
                  width: '100%',
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', flex: 1}}>
            <View style={{width: '30%', alignItems: 'flex-start'}}>
              {filterKeys.map(item => {
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedFilter(item)}
                    style={{
                      paddingVertical: 12,
                      width: '80%',
                      paddingHorizontal: 8,
                      alignItems: 'center',
                      backgroundColor:
                        item === selectedFilter ? Colors.grey1 : 'transparent',
                    }}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={{width: '70%'}}>
              <ScrollView>
                {selectedFilter === 'Category' ? (
                  <View>
                    {categoryData.map(item => {
                      return (
                        <View>
                          <Text style={{marginVertical: 8, fontWeight: 'bold'}}>
                            {item.categoryName}
                          </Text>
                          <View
                            style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                            {item.subCategory.map(i => {
                              return (
                                <TouchableOpacity
                                  onPress={() => handleCategoryFilter(item, i)}
                                  style={{
                                    borderWidth: 1,
                                    padding: 8,
                                    borderColor: Colors.greyBorder,
                                    marginRight: 8,
                                    marginBottom: 8,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    backgroundColor:
                                      selectedSubCategory.includes(
                                        i.subCategoryId,
                                      )
                                        ? '#DBDBDB'
                                        : 'transparent',
                                    alignItems: 'center',
                                  }}>
                                  <Text>{i.subCategoryName}</Text>
                                  {selectedSubCategory.includes(
                                    i.subCategoryId,
                                  ) ? (
                                    <Image
                                      source={require('../../assets/crossIcon.png')}
                                      style={{
                                        width: 12,
                                        height: 12,
                                        marginLeft: 8,
                                      }}
                                    />
                                  ) : null}
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : selectedFilter === 'Brand' ? (
                  <View>
                    <Input
                      placeholder="Search Brands"
                      onChangeText={e => searchBrand(e)}
                      value={brandSearchKey}
                    />
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                      {brandList.map(item => {
                        return (
                          <TouchableOpacity
                            onPress={() => setBrandsFilter(item)}
                            style={{
                              borderWidth: 1,
                              padding: 8,
                              marginRight: 8,
                              borderColor: Colors.greyBorder,
                              marginBottom: 8,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              backgroundColor: selectedBrands.includes(
                                item.brandId,
                              )
                                ? '#DBDBDB'
                                : 'transparent',
                              alignItems: 'center',
                            }}>
                            <Text>{item.brandName}</Text>
                            {selectedBrands.includes(item.brandId) ? (
                              <Image
                                source={require('../../assets/crossIcon.png')}
                                style={{width: 12, height: 12, marginLeft: 8}}
                              />
                            ) : null}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ) : selectedFilter === 'Season' ? (
                  <>
                    <Text style={{marginVertical: 8, fontWeight: 'bold'}}>
                      Season
                    </Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                      {['Spring', 'Summer', 'Autumn', 'Winter'].map(
                        (item, index) => {
                          return (
                            <TouchableOpacity
                              onPress={() => setSeasonDataFunction(item)}
                              style={{
                                borderWidth: 1,
                                padding: 8,
                                marginRight: 8,
                                borderColor: Colors.greyBorder,
                                marginBottom: 8,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                backgroundColor: seasonData.includes(item)
                                  ? '#DBDBDB'
                                  : 'transparent',
                                alignItems: 'center',
                              }}>
                              <VText
                                style={{textTransform: 'capitalize'}}
                                text={item}
                              />
                              {seasonData.includes(item) ? (
                                <Image
                                  source={require('../../assets/crossIcon.png')}
                                  style={{width: 12, height: 12, marginLeft: 8}}
                                />
                              ) : null}
                            </TouchableOpacity>
                          );
                        },
                      )}
                    </View>
                  </>
                ) : selectedFilter === 'Color' ? (
                  <>
                    <Text style={{marginVertical: 8, fontWeight: 'bold'}}>
                      Colors
                    </Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                      {getColorsResponse?.map((item, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => setColorsFilter(item.colorName)}
                            style={{
                              borderWidth: 1,
                              padding: 8,
                              marginRight: 8,
                              borderColor: Colors.greyBorder,
                              marginBottom: 8,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              backgroundColor: colorsFilter.includes(
                                item.colorName,
                              )
                                ? Colors.grey2
                                : 'transparent',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                width: 24,
                                height: 24,
                                backgroundColor: item.colorName,
                                borderWidth: 1,
                                borderColor: Colors.greyBorder,
                                marginRight: 8,
                              }}
                            />
                            <Text>{item.colorName}</Text>
                            {colorsFilter.includes(item.colorName) ? (
                              <Image
                                source={require('../../assets/crossIcon.png')}
                                style={{width: 12, height: 12, marginLeft: 8}}
                              />
                            ) : null}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                ) : selectedFilter === 'Size' ? (
                  <>
                    <Text style={{marginVertical: 8, fontWeight: 'bold'}}>
                      Sizes
                    </Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                      {getSizeResponse.map((item, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => setSizesData(item)}
                            style={{
                              borderWidth: 1,
                              padding: 8,
                              marginRight: 8,
                              borderColor: Colors.greyBorder,
                              marginBottom: 8,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              backgroundColor: sizeFilter.includes(
                                item.sizeCode,
                              )
                                ? '#DBDBDB'
                                : 'transparent',
                              alignItems: 'center',
                            }}>
                            <VText
                              style={{textTransform: 'capitalize'}}
                              text={item.sizeName}
                            />
                            {sizeFilter.includes(item.sizeCode) ? (
                              <Image
                                source={require('../../assets/crossIcon.png')}
                                style={{width: 12, height: 12, marginLeft: 8}}
                              />
                            ) : null}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                ) : selectedFilter === 'Price' ? (
                  <>
                    <Text style={{marginVertical: 8, fontWeight: 'bold'}}>
                      Price
                    </Text>
                    {priceFilter.map((item, index) => {
                      return (
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 16,
                          }}
                          onPress={() => handleCheckBox(item, index)}>
                          <CheckBox
                            disabled={false}
                            boxType="square"
                            value={item.isChecked}
                          />
                          <Text style={{paddingLeft: 8}}>
                            {item.min + '-' + item.max}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </>
                ) : null}
              </ScrollView>
            </View>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '45%'}}>
              <Buttons text="reset" isInverse onPress={resetFilterValues} />
            </View>
            <View style={{width: '45%'}}>
              <Buttons
                text="apply"
                onPress={() =>
                  setFilter({
                    selectedBrands,
                    selectedCategory: [...new Set(selectedCategory)],
                    selectedSubCategory,
                    seasonData,
                    colorsFilter,
                    sizeFilter,
                    priceFilter: priceFilterObj,
                  })
                }
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    zIndex: -999,
  },
  footerImageContainer: {
    marginRight: 16,
    borderRadius: 20,
  },
  bodyContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteBoxStyle: {
    height: 160,
    width: 160,
  },
  emptyClosetText: {
    marginTop: 16,
    fontSize: 15,
  },
  footerContainer: {
    // flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 16,
  },
  footerImage: {
    height: 44,
    width: 44,
  },
  lineArrowStyle: {
    height: 131,
    width: 27,
  },
});
