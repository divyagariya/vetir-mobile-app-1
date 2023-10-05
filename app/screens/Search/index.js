import moment from 'moment';
import React, {useEffect, useState} from 'react';
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
import {Header, OverlayModal, SortComponent} from '../../components';
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
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <CategoryCard
                  index={index}
                  item={item}
                  getProductDetails={() => getProductDetails(item.productId)}
                  addToCloset={() => addToCloset(item)}
                  deletFromClost={() => deletFromClost(item)}
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
    </View>
  );
};

export default Search;
