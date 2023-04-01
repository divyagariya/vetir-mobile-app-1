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

  useEffect(() => {
    if (Object.keys(deleteClosetResponse).length) {
      if (deleteClosetResponse.statusCode === 200) {
        dispatch({type: 'DELETE_CLOSET', value: {}});
        Toast.show('Cloth successfully removed from closet');
        dispatch(getFilteredProducts(filterParams));
        dispatch(getClosetData());
      }
    }
  }, [deleteClosetResponse, dispatch]);

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
    setProducts(data);
  };

  const getProductDetails = productId => {
    dispatch(getProductDetailsApi(productId));
  };

  useEffect(() => {
    if (Object.keys(filteredProducts).length) {
      setProducts(filteredProducts?.productDetails);
      setLoader(false);
    }
  }, [filteredProducts]);

  useEffect(() => {
    if (Object.keys(productDetailResponse).length) {
      dispatch({type: 'GET_PRODUCT_DETAILS', value: {}});
      props.navigation.navigate('ViewProduct', {
        data: productDetailResponse.productDetails,
      });
    }
  }, [dispatch, productDetailResponse, props.navigation]);

  const searchProduct = () => {
    if (searchKey.length) {
      setSearch(false);
      dispatch({type: 'GET_SEARCH_RESULT', value: []});
      const data = {
        key: searchKey,
      };
      setFilterParametrs(data);
      dispatch(getFilteredProducts(data));
    }
  };

  useEffect(() => {
    if (Object.keys(addClosetResponse).length) {
      if (addClosetResponse.statusCode == 200) {
        dispatch({type: 'ADD_TO_CLOSET', value: {}});
        dispatch(getClosetData());
        dispatch(getFilteredProducts(filterParams));
        Toast.show('Cloth successfully added in closet');
      }
    }
  }, [addClosetResponse, dispatch]);

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
    dispatch(addDataInCloset(data));
  };

  const deletFromClost = item => {
    const data = {
      userId: userId,
      closetItemId: item?.closetItemId,
    };
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
    dispatch(getFilteredProducts(data1));
    console.log('@@ data', JSON.stringify(data1, undefined, 2));
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {showSearch ? (
        <>
          <View
            style={{
              marginVertical: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <View style={{width: '75%'}}>
              <TextInput
                style={{
                  paddingVertical: 16,
                  backgroundColor: Colors.grey1,
                  paddingLeft: 16,
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
            style={{flex: 1, justifyContent: 'center', paddingHorizontal: 16}}>
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
              }}>{`${productList?.length} results found`}</Text>
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
                />
              )}
              contentContainerStyle={{
                paddingVertical: 16,
                paddingHorizontal: 8,
              }}
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
