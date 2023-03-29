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
  const [showModal, setModal] = useState(false);
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
  const filteredProducts = useSelector(
    state => state.HomeReducer.filteredProducts,
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

  useEffect(() => {
    if (props.route.params.data) {
      const data = {
        optionId: props.route.params.data.optionId,
      };
      console.log('@@ home @@', data);
      setFilterParametrs(data);
      dispatch(getFilteredProducts(data));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(filteredProducts).length) {
      setLoader(false);
      setProducts(filteredProducts?.productDetails);
      dispatch({type: 'FILTERED_PRODUCTS', value: {}});
    }
  }, [filteredProducts]);

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
    console.log('@@ add data', JSON.stringify(data, undefined, 2));
    dispatch(addDataInCloset(data));
  };

  const setFilter = data => {
    console.log('data.selectedBrands', data.selectedBrands);
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
    dispatch(getFilteredProducts(data1));
  };

  const deletFromClost = item => {
    const data = {
      userId: userId,
      closetItemId: item?.closetItemId,
    };
    dispatch(deleteClosetData(data));
  };

  return (
    <VView style={{backgroundColor: 'white', flex: 1}}>
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
        <View style={{alignSelf: 'center', paddingTop: 100}}>
          <Text
            style={{
              color: Colors.black60,
              fontSize: 15,
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
    </VView>
  );
};
export default CategoryScreen;
