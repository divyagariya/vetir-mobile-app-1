import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../colors';
import {
  VView,
  Header,
  OverlayModal,
  Buttons,
  SortComponent,
  Input,
} from '../../components';
import {FONTS_SIZES} from '../../fonts';
import Toast from 'react-native-simple-toast';
import {
  addDataInCloset,
  getClosetData,
  deleteClosetData,
} from '../../redux/actions/closetAction';
import {
  getFilteredProducts,
  getProductDetailsApi,
} from '../../redux/actions/homeActions';
import {FilterModal} from '../Closet';
import CategoryCard from './components/categoryCard';
import {
  dislikeProductAction,
  recommendedAction,
} from '../../redux/actions/stylistAction';
import {debounce} from '../../utils/common';
import {returnFilterParams} from './common';
import {ClientModelChat} from './components/clientModelChat';

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
      onPress={() => onPressChat(item)}>
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
              // onPressChat={() => {
              //   setShowClientModal(false);
              //   navigation.navigate('ChatScreen', {
              //     selectedProductData: selectedProductData,
              //     comingFromProduct: true,
              //     receiverDetails: {
              //       emailId: item?.emailId,
              //       name: item?.name,
              //       userId: item?.userId,
              //     },
              //   });
              // }}
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

const CategoryScreen = props => {
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
  const [recommendedProductId, setRecommendedProductId] = useState('');
  const [showModal, setModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showClientModalForChat, setShowClientModalForChat] = useState(false);
  const [selectedProductImg, setSelectedProductImg] = useState('');
  const [selectedProductData, setSelectedProductData] = useState({});
  const [showSortModal, setSortModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState({
    type: 'asc',
    title: 'Price Low to High',
    isSelected: false,
  });
  const [showLoader, setLoader] = useState(true);
  const [selectedSortIndex, setSelectedSortIndex] = useState(null);
  const dispatch = useDispatch();
  const [productList, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [currentProdID, setcurrentProdID] = useState('');
  const personalStylistDetails = useSelector(
    state => state.ProfileReducer?.userProfileResponse.personalStylistDetails,
  );
  const {
    emailId = '',
    name = '',
    _id = '',
  } = (personalStylistDetails && personalStylistDetails[0]) || {};
  const filteredProducts = useSelector(
    state => state.HomeReducer.filteredProducts,
  );
  const addClosetResponse = useSelector(
    state => state.ClosetReducer.addClosetResponse,
  );
  const addClosetParams = useSelector(
    state => state.ClosetReducer.addToClosetParams,
  );
  const deleteClosetResponse = useSelector(
    state => state.ClosetReducer.deleteClosetResponse,
  );
  const userId = useSelector(state => state.AuthReducer.userId);
  const [filterParams, setFilterParametrs] = useState({});
  const [isFromPagination, setIsFromPagination] = useState(false);
  const isStylistUser = useSelector(state => state.AuthReducer.isStylistUser);
  const recommendedToClientsRes = useSelector(
    state => state.StylistReducer.recommendedToClientsRes,
  );
  const dislikeResp = useSelector(state => state.StylistReducer.dislikeResp);
  const [selectedClients, setSelectedClients] = useState([]);
  const productDetailResponse = useSelector(
    state => state.HomeReducer.productDetailResponse,
  );

  useEffect(() => {
    if (Object.keys(dislikeResp).length) {
      console.log('dislikeResp useEffect', dislikeResp);
      if (dislikeResp.statusCode === 200) {
        dispatch({type: 'DISLIKE_PRODUCTS', value: {}});
        dispatch(getFilteredProducts(filterParams));
        if (dislikeResp.recommendedProductDetails.dislike) {
          Toast.show('Not liked');
        }
      }
    }
  }, [dislikeResp, dispatch, filterParams]);

  useEffect(() => {
    if (Object.keys(recommendedToClientsRes).length) {
      if (recommendedToClientsRes.statusCode === 200) {
        setSelectedClients([]);
        dispatch({type: 'RECOMMENDED_TO_CLIENTS', value: {}});
        Toast.show('Recommended to client');
      }
    }
  }, [recommendedToClientsRes, dispatch]);

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
        Toast.show('Removed from closet');
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
        Toast.show('Added to closet');
        dispatch(getClosetData());
      }
    }
  }, [addClosetResponse, currentProdID, dispatch, filterParams, productList]);

  useEffect(() => {
    if (Object.keys(productDetailResponse).length) {
      props.navigation.navigate('ViewProduct', {
        data: productDetailResponse.productDetails,
      });
      dispatch({type: 'GET_PRODUCT_DETAILS', value: {}});
    }
  }, [dispatch, productDetailResponse, props.navigation]);

  useEffect(() => {
    if (props.route.params.data && !isFromPagination) {
      const data1 = {};
      const data = returnFilterParams(filterParams);
      data1.optionId = props.route.params.data.optionId;
      data1.page = currentPage;
      const dataTosend = {...data1, ...data};
      // setFilterParametrs(data);
      dispatch(getFilteredProducts(dataTosend));
    }
  }, [
    currentPage,
    dispatch,
    filterParams,
    isFromPagination,
    props.route.params.data,
  ]);

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

  const getProductDetails = productId => {
    dispatch(getProductDetailsApi(productId));
  };

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

  const handleSorting = () => {
    setSortModal(false);
    let data = productList;
    data = data.sort((a, b) => {
      if (selectedSort.type === 'asc') {
        return a.productPrice > b.productPrice ? 1 : -1;
      } else if (selectedSort.type === 'desc') {
        return a.productPrice < b.productPrice ? 1 : -1;
      } else if (selectedSort.type === 'dateDesc') {
        return moment(a.createdOn) < moment(b.createdOn) ? 1 : -1;
      }
    });
    setProducts(data);
  };

  const addToCloset = item => {
    console.warn('userId', userId);
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
    console.log('@@ add data', JSON.stringify(data, undefined, 2));
    dispatch(addDataInCloset(data));
  };

  const setFilter = data => {
    setModal(false);
    setLoader(true);
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
    if (data.genderData.length) {
      data1.gender = data.genderData;
    }
    let priceFilters = [];
    if (data.priceFilter.length > 0) {
      data.priceFilter.map(item => {
        if (item.isChecked) {
          priceFilters.push(item.min);
          if (item.max === 'and above') {
            priceFilters.push(10000);
          } else {
            priceFilters.push(item.max);
          }
        }
      });
      priceFilters = [...new Set(priceFilters)];
      priceFilters = [priceFilters[0], priceFilters[priceFilters.length - 1]];
      data1.price = priceFilters;
    }
    setFilterParametrs(data);
    console.log('@@ data', JSON.stringify({data1}, undefined, 2));
    setIsFromPagination(false);
    dispatch(getFilteredProducts(data1, false));
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
    // setProducts(prev => [...prev, ...prod]);
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

  const dislikeProducts = item => {
    console.log(JSON.stringify(item, undefined, 2));
    const data = {
      productId: item.productId,
      userId: userId,
      dislike: !item.isDisliked,
    };
    dispatch(dislikeProductAction(data));
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
        data1.optionId = props.route.params.data.optionId;
        data1.page = nextPage;
        const dataTosend = {...data1, ...data};
        dispatch(getFilteredProducts(dataTosend));
        setCurrentPage(nextPage);
        // setLoader(false);
      }
    } catch (error) {
      console.error('Error loading more data:', error);
      setLoader(false);
    }
  };

  // Debounce the loadMoreData function with a 500ms delay
  const debouncedLoadMoreData = debounce(loadMoreData, 200);

  return (
    <VView style={{backgroundColor: 'white', flex: 1, paddingTop: 16}}>
      <Header
        showSort
        title={props?.route?.params?.title}
        showFilter
        showBack
        showFilterFunction={showFilterFunction}
        handleSorting={handleSortingModal}
        {...props}
      />
      {productList?.length > 0 && (
        <View style={{backgroundColor: 'white', paddingBottom: 8}}>
          <Text
            style={{
              paddingHorizontal: 16,
              color: Colors.black60,
            }}>
            {`${totalDataCount} results found`}
          </Text>
        </View>
      )}
      {productList?.length > 0 ? (
        <FlatList
          data={productList}
          numColumns={2}
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
              isStylistUser={isStylistUser}
              recommentToClient={() => recommentToClient(item)}
              dislikeProducts={() => dislikeProducts(item)}
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
        <View style={{justifyContent: 'center', flex: 1, width: '100%'}}>
          <Text
            style={{
              color: Colors.black60,
              fontSize: 15,
              alignSelf: 'center',
            }}>
            Umm, nothing is here...
          </Text>
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
    </VView>
  );
};
export default CategoryScreen;
