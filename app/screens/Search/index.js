import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../colors';
import {
  Buttons,
  Header,
  Input,
  OverlayModal,
  SortComponent,
} from '../../components';
import {FONTS_SIZES} from '../../fonts';
import {
  addDataInCloset,
  deleteClosetData,
  getClosetData,
} from '../../redux/actions/closetAction';
import {
  getFilteredProducts,
  getProductDetailsApi,
} from '../../redux/actions/homeActions';
import CategoryCard from '../CategoryScreen/components/categoryCard';
import {FilterModal} from '../Closet';
import {debounce} from '../../utils/common';
import {returnFilterParams} from '../CategoryScreen/common';
import {ClientModelChat} from '../CategoryScreen/components/clientModelChat';
import {recommendedAction} from '../../redux/actions/stylistAction';

export const ClientList = ({
  item,
  index,
  selectClient,
  selectedClients,
  onPressChat,
  showChatIcon,
}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
      }}
      onPress={() => (showChatIcon ? onPressChat(item) : selectClient(item))}>
      <View style={{flexDirection: 'row'}}>
        {item.profilePicUrl ? (
          <Image
            source={{uri: item.profilePicUrl}}
            style={{width: 40, height: 40, borderRadius: 20}}
          />
        ) : (
          <Image
            source={require('../../assets/iProfile.png')}
            style={{width: 40, height: 40}}
          />
        )}
        <View style={{marginLeft: 8, width: '70%'}}>
          <Text>{item.name}</Text>
          <Text style={{color: Colors.black30}}>{item.emailId}</Text>
        </View>
      </View>
      {showChatIcon && (
        <TouchableOpacity onPress={() => onPressChat(item)}>
          <Image
            source={require('../../assets/send_to_chat.webp')}
            style={{width: 20, height: 20}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      {!showChatIcon && (
        <View>
          <Image
            source={
              selectedClients.includes(item.userId)
                ? require('../../assets/iSelectedCheck.png')
                : require('../../assets/iCheck.png')
            }
            style={{width: 16, height: 16}}
            resizeMode="contain"
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export const RenderClients = ({
  setShowClientModal = () => {},
  selectClient = () => {},
  selectedClients,
  recommendToClients = () => {},
  selectedProductImg = '',
  selectedProductData = {},
  navigation,
}) => {
  const [noteUi, setNoteUi] = useState(false);
  const [note, setNote] = useState('');
  const allClientDataRespo = useSelector(
    state => state.StylistReducer.allClientDataRespo,
  );

  const addNote = () => {
    if (selectedClients.length === 0) {
      Toast.show('Please select atleast one client');
      return;
    }
    setNoteUi(true);
  };

  const back = () => {
    setNoteUi(false);
  };

  if (noteUi) {
    return (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={back}>
              <Image
                resizeMode="contain"
                source={require('../../assets/iBack.webp')}
                style={{width: 32, height: 32}}
              />
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  fontSize: FONTS_SIZES.s3,
                  fontWeight: 'bold',
                  paddingLeft: 8,
                }}>
                Recommend to {selectedClients.length} clients
              </Text>
              <View style={{flexDirection: 'row', overflow: 'hidden'}}>
                {selectedClients.length &&
                  selectedClients.map(item => {
                    return allClientDataRespo.map(i => {
                      if (i.userId === item) {
                        return (
                          <Text style={{color: Colors.black60, marginLeft: 4}}>
                            {i.name + ', '}
                          </Text>
                        );
                      }
                    });
                  })}
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowClientModal(false)}>
            <Image
              source={require('../../assets/cross.webp')}
              style={{width: 32, height: 32}}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: 56,
            height: 74,
            alignItems: 'center',
            backgroundColor: Colors.grey1,
            justifyContent: 'center',
            marginTop: 16,
          }}>
          <Image
            source={{uri: selectedProductImg}}
            style={{width: 50, height: 50}}
          />
          <View style={{position: 'absolute', right: 0, top: 0}}>
            <Image
              source={require('../../assets/iSelectedCheck.png')}
              style={{width: 16, height: 16}}
              resizeMode="contain"
            />
          </View>
        </View>

        <Input
          placeholder="Type your note that you want to send to your clients... "
          multiline
          propStyle={{
            height: 200,
            backgroundColor: Colors.grey1,
            marginBottom: 8,
            textAlignVertical: 'top',
            marginTop: 16,
          }}
          onChangeText={e => setNote(e)}
          value={note}
        />

        <Buttons
          text="recommend with note"
          onPress={() => recommendToClients(note)}
        />
      </View>
    );
  }
  return (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
          <Text style={{fontSize: FONTS_SIZES.s3, fontWeight: 'bold'}}>
            Recommend to your clients
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowClientModal(false)}>
          <Image
            source={require('../../assets/cross.webp')}
            style={{width: 32, height: 32}}
          />
        </TouchableOpacity>
      </View>
      <View style={{marginVertical: 16}}>
        {allClientDataRespo.map((item, index) => {
          return (
            <ClientList
              item={item}
              index={index}
              selectClient={selectClient}
              selectedClients={selectedClients}
            />
          );
        })}
      </View>
      <Buttons text="recommend" onPress={() => recommendToClients(note)} />
      <Buttons text="add note (optional)" isInverse onPress={addNote} />
    </View>
  );
};

const Search = props => {
  const sortingData = [
    {
      type: 'asc',
      title: 'Price Low to High',
      isSelected: true,
    },
    {
      type: 'desc',
      title: 'Price High to Low',
      isSelected: false,
    },
    {
      type: 'dateDesc',
      title: 'Latest First',
      isSelected: false,
    },
  ];
  const [showSearch, setSearch] = useState(true);
  const [showModal, setModal] = useState(false);
  const [showSortModal, setSortModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState({
    type: 'asc',
    title: 'Price Low to High',
    isSelected: false,
  });
  const [selectedSortIndex, setSelectedSortIndex] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const dispatch = useDispatch();
  const [productList, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [currentProdID, setcurrentProdID] = useState('');
  const [isFromPagination, setIsFromPagination] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState({});
  const [showClientModalForChat, setShowClientModalForChat] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [recommendedProductId, setRecommendedProductId] = useState('');
  const [selectedProductImg, setSelectedProductImg] = useState('');
  const [selectedClients, setSelectedClients] = useState([]);

  const [totalDataCount, setTotalDataCount] = useState(0);
  const filteredProducts = useSelector(
    state => state.HomeReducer.filteredProducts,
  );
  const [filterValue, setFilterDefault] = useState([]);
  const [showLoader, setLoader] = useState(true);
  const productDetailResponse = useSelector(
    state => state.HomeReducer.productDetailResponse,
  );
  const addClosetResponse = useSelector(
    state => state.ClosetReducer.addClosetResponse,
  );
  const deleteClosetResponse = useSelector(
    state => state.ClosetReducer.deleteClosetResponse,
  );
  const userId = useSelector(state => state.AuthReducer.userId);
  const [filterParams, setFilterParametrs] = useState({});
  const isStylistUser = useSelector(state => state.AuthReducer.isStylistUser);
  const flatListRef = useRef(null);
  const personalStylistDetails = useSelector(
    state => state.ProfileReducer?.userProfileResponse.personalStylistDetails,
  );
  const {
    emailId = '',
    name = '',
    _id = '',
  } = (personalStylistDetails && personalStylistDetails[0]) || {};

  const recommendedToClientsRes = useSelector(
    state => state.StylistReducer.recommendedToClientsRes,
  );

  useEffect(() => {
    if (Object.keys(deleteClosetResponse).length) {
      if (deleteClosetResponse.statusCode === 200) {
        let prod = productList;
        prod.map(product => {
          if (product?.productId === currentProdID) {
            product.addedToCloset = false;
            product.closetItemId = addClosetResponse.closetItemId;
          }
        });
        // setProducts([]);
        setProducts(prod);
        dispatch({type: 'DELETE_CLOSET', value: {}});
        Toast.show('Cloth successfully removed from closet');
        // dispatch(getFilteredProducts(filterParams));
        dispatch(getClosetData());
      }
    }
  }, [
    addClosetResponse.closetItemId,
    currentProdID,
    deleteClosetResponse,
    dispatch,
    filterParams,
    productList,
  ]);

  const showFilterFunction = value => {
    setModal(true);
  };

  const handleSortingModal = () => {
    setSortModal(true);
  };

  const handleSortingOption = (item, index) => {
    setSelectedSort(item);
    setSelectedSortIndex(index);
  };
  // Function to scroll the FlatList to the top
  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({animated: true, offset: 0});
    }
  };

  const handleSorting = () => {
    setSortModal(false);
    let data = filteredProducts?.productDetails;
    data = data.sort((a, b) => {
      if (selectedSort.type === 'asc') {
        return a.productPrice > b.productPrice ? 1 : -1;
      } else if (selectedSort.type === 'desc') {
        return a.productPrice < b.productPrice ? 1 : -1;
      } else if (selectedSort.type === 'dateDesc') {
        return moment(a.createdOn) < moment(b.createdOn) ? 1 : -1;
      }
    });
    scrollToTop();
    setProducts(data);
  };

  const getProductDetails = productId => {
    dispatch(getProductDetailsApi(productId));
  };

  useEffect(() => {
    if (Object.keys(filteredProducts).length) {
      setLoader(false);
      setTotalDataCount(filteredProducts?.total);
      setTotalPageCount(filteredProducts?.totalPage);
      if (isFromPagination) {
        setProducts([...productList, ...filteredProducts?.productDetails]);
      } else {
        setProducts([]);
        setProducts(prev => [...prev, ...filteredProducts.productDetails]);
      }
      dispatch({type: 'FILTERED_PRODUCTS', value: {}});
    }
  }, [dispatch, filteredProducts, isFromPagination, productList]);

  useEffect(() => {
    if (Object.keys(recommendedToClientsRes).length) {
      if (recommendedToClientsRes.statusCode === 200) {
        setSelectedClients([]);
        dispatch({type: 'RECOMMENDED_TO_CLIENTS', value: {}});
        Toast.show('Recommended to client');
      }
    }
  }, [recommendedToClientsRes, dispatch]);

  // useEffect(() => {
  //   if (Object.keys(filteredProducts).length) {
  //     setProducts(filteredProducts?.productDetails);
  //     // setProducts([...productList, ...filteredProducts?.productDetails]);
  //     setLoader(false);
  //     setTotalDataCount(filteredProducts?.total);
  //   }
  // }, [filteredProducts, productList]);

  useEffect(() => {
    if (Object.keys(productDetailResponse).length) {
      dispatch({type: 'GET_PRODUCT_DETAILS', value: {}});
      props.navigation.navigate('ViewProduct', {
        data: productDetailResponse.productDetails,
      });
    }
  }, [dispatch, productDetailResponse, props.navigation]);

  const searchProduct = () => {
    if (searchKey.length && !isFromPagination) {
      setSearch(false);
      dispatch({type: 'GET_SEARCH_RESULT', value: []});

      const data1 = {};
      const data = returnFilterParams(filterParams);
      data1.key = searchKey;
      data1.page = currentPage;
      const dataTosend = {...data1, ...data};
      // setFilterParametrs(data);
      dispatch(getFilteredProducts(dataTosend));
    }
  };

  useEffect(() => {
    if (Object.keys(addClosetResponse).length) {
      if (addClosetResponse.statusCode == 200) {
        let prod = productList;
        prod.map(product => {
          if (product?.productId === currentProdID) {
            product.addedToCloset = true;
            product.closetItemId = addClosetResponse.closetItemId;
          }
        });
        // setProducts([]);
        setProducts(prod);
        dispatch({type: 'ADD_TO_CLOSET', value: {}});
        dispatch(getClosetData());
        // dispatch(getFilteredProducts(filterParams));
        Toast.show('Added to closet');
        // dispatch(getFilteredProducts(filterParams));
      }
    }
  }, [addClosetResponse, currentProdID, dispatch, productList]);

  const addToCloset = item => {
    let data = {
      userId: userId,
      categoryId: item.categoryId,
      subCategoryId: item.subCategoryId,
      brandId: item.brandId,
      season: item.seasons,
      colorCode: [item.productColorCode],
      itemImageUrl: item.imageUrls[0],
      isImageBase64: false,
      productId: item.productId,
    };
    setcurrentProdID(item.productId);
    dispatch(addDataInCloset(data));
  };

  const deletFromClost = item => {
    const data = {
      userId: userId,
      closetItemId: item?.closetItemId,
    };
    setcurrentProdID(item.productId);
    let prod = productList;
    prod.map(product => {
      if (product?.closetItemId === currentProdID) {
        product.addedToCloset = false;
        product.closetItemId = undefined;
      }
    });
    setProducts(prod);
    dispatch(deleteClosetData(data));
  };

  const recommentToClient = item => {
    setShowClientModal(true);
    setSelectedProductData(item);
    setRecommendedProductId(item.productId);
    setSelectedProductImg(item.imageUrls[0]);
  };

  const selectClient = item => {
    let selectedClients1 = [...selectedClients];
    if (!selectedClients1.includes(item.userId)) {
      selectedClients1.push(item.userId);
    } else {
      selectedClients1 = selectedClients1.filter(id => id !== item.userId);
    }
    setSelectedClients(selectedClients1);
  };

  const recommendToClients = (note = '') => {
    if (!selectedClients.length) {
      Toast.show('Please select atleast one client');
      return;
    }
    const data = {
      personalStylistId: userId,
      userIds: selectedClients,
      productId: recommendedProductId,
    };
    if (note) {
      data.note = note;
    }
    console.log('data', data);
    setShowClientModal(false);
    dispatch(recommendedAction(data));
  };

  const setFilter = data => {
    setModal(false);
    let data1 = {};
    if (data.selectedCategory.length) {
      data1.categoryIds = data.selectedCategory;
    }
    if (data.selectedBrands.length) {
      data1.brandIds = data.selectedBrands;
    }
    if (data.selectedSubCategory.length) {
      data1.subCategoryIds = data.selectedSubCategory;
    }
    if (data.seasonData.length) {
      data1.season = data.seasonData;
    }
    if (data.colorsFilter.length) {
      data1.color = data.colorsFilter;
    }
    if (data.sizeFilter.length) {
      data1.size = data.sizeFilter;
    }
    let priceFilters = [];
    if (data.priceFilter.length > 0) {
      data.priceFilter.map(item => {
        if (item.isChecked) {
          priceFilters.push(item.min);
          priceFilters.push(item.max);
        }
      });
      priceFilters = [...new Set(priceFilters)];
      priceFilters = [priceFilters[0], priceFilters[priceFilters.length - 1]];
      data1.price = priceFilters;
    }
    data1.key = searchKey;
    setFilterParametrs(data);
    setIsFromPagination(false);
    dispatch(getFilteredProducts(data1, false));
  };

  // Your loadMoreData function that fetches more data
  const loadMoreData = async () => {
    if (showLoader) {
      return; // Return if already loading more data to prevent multiple requests
    }

    try {
      if (currentPage !== totalPageCount) {
        setLoader(true);
        setIsFromPagination(true);
        const nextPage = currentPage + 1;

        const data1 = {};
        const data = returnFilterParams(filterParams);
        data1.key = searchKey;
        data1.page = nextPage;
        const dataTosend = {...data1, ...data};
        dispatch(getFilteredProducts(dataTosend));

        // setFilterParametrs(data);
        setCurrentPage(nextPage);
        // setLoader(false);
      }
    } catch (error) {
      // Handle errors
      console.error('Error loading more data:', error);
      setLoader(false);
    }
  };

  // Debounce the loadMoreData function with a 500ms delay
  const debouncedLoadMoreData = debounce(loadMoreData, 200);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {showSearch ? (
        <>
          <View
            style={{
              marginVertical: 24,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              paddingHorizontal: 16,
            }}>
            <View style={{width: '75%'}}>
              <TextInput
                style={{
                  backgroundColor: Colors.grey1,
                  marginTop: 16,
                  marginBottom: 8,
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 8,
                }}
                onChangeText={e => setSearchKey(e)}
                placeholder="Search jeans, top, hats..."
                autoFocus
                returnKeyType="go"
                onSubmitEditing={searchProduct}
              />
            </View>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Text>CANCEL</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 0.5,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 16,
            }}>
            <Text style={{textAlign: 'center', color: Colors.black30}}>
              "If you love something, wear it all the time... Find things that
              suit you. That's how you look extraordinary."
            </Text>
            <Text
              style={{
                textAlign: 'center',
                paddingTop: 32,
                color: Colors.black30,
              }}>
              – Vivienne Westwood
            </Text>
          </View>
        </>
      ) : (
        <View style={{flex: 1}}>
          <Header
            showBack
            title={searchKey}
            {...props}
            showFilter
            showSort
            showFilterFunction={showFilterFunction}
            handleSorting={handleSortingModal}
            onBack={() => {
              setSearch(true);
              setProducts([]);
              dispatch({type: 'FILTERED_PRODUCTS', value: {}});
              setLoader(true);
              setFilterDefault({
                selectedCategory: [],
                setSeasonData: [],
                selectedBrands: [],
                selectedSubCategory: [],
                colorsFilter: [],
                sizeFilter: [],
              });
            }}
          />
          {productList?.length > 0 && (
            <Text
              style={{
                padding: 16,
                color: Colors.black60,
              }}>{`${totalDataCount} results found`}</Text>
          )}
          {productList.length > 0 ? (
            <FlatList
              data={productList}
              numColumns={2}
              ref={flatListRef}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <CategoryCard
                  index={index}
                  item={item}
                  onPressChat={() => {
                    if (isStylistUser) {
                      setSelectedProductData(item);
                      setShowClientModalForChat(true);
                    } else {
                      props.navigation.navigate('ChatScreen', {
                        selectedProductData: item,
                        isOutfit: false,
                        comingFromProduct: true,
                        receiverDetails: {
                          emailId: emailId,
                          name: name,
                          userId: _id,
                        },
                      });
                    }
                  }}
                  getProductDetails={() => getProductDetails(item.productId)}
                  addToCloset={() => addToCloset(item)}
                  deletFromClost={() => deletFromClost(item)}
                  recommentToClient={() => recommentToClient(item)}
                  isStylistUser={isStylistUser}
                />
              )}
              contentContainerStyle={{
                paddingVertical: 16,
                paddingHorizontal: 8,
              }}
              onEndReached={debouncedLoadMoreData} // Triggered when the user reaches the end
              onEndReachedThreshold={0.01}
              ListFooterComponent={() =>
                showLoader && (
                  <ActivityIndicator size="small" color={Colors.greyText} />
                )
              }
            />
          ) : showLoader ? (
            <ActivityIndicator />
          ) : (
            <View style={{alignSelf: 'center', paddingTop: 50}}>
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
      )}
      {
        <FilterModal
          showModal={showModal}
          from="home"
          hideModal={() => setModal(false)}
          setFilter={setFilter}
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
      {showClientModal && (
        <OverlayModal
          isScrollEnabled={false}
          showModal={showClientModal}
          component={
            <RenderClients
              navigation={props.navigation}
              setShowClientModal={setShowClientModal}
              selectClient={selectClient}
              selectedProductData={selectedProductData}
              selectedClients={selectedClients}
              recommendToClients={recommendToClients}
              selectedProductImg={selectedProductImg}
            />
          }
        />
      )}
      {showClientModalForChat && (
        <OverlayModal
          isScrollEnabled={false}
          showModal={showClientModalForChat}
          component={
            <ClientModelChat
              navigation={props.navigation}
              setShowClientModalForChat={setShowClientModalForChat}
              selectedProductData={selectedProductData}
            />
          }
        />
      )}
    </View>
  );
};

export default Search;
