import React, {useEffect, useState} from 'react';
import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../colors';
import {Header, OverlayModal, SortComponent} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {openClosetDetails} from '../../redux/actions/closetAction';
import {FilterModal} from '../Closet';
import moment from 'moment';

const ClosetCategory = props => {
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
  const userId = useSelector(state => state.AuthReducer.userId);
  const singleClosetReponse = useSelector(
    state => state.ClosetReducer.singleClosetReponse,
  );
  const [showSortModal, setSortModal] = useState(false);
  const [showModal, setModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState({
    type: 'asc',
    title: 'Price Low to High',
    isSelected: false,
  });
  const [selectedSortIndex, setSelectedSortIndex] = useState(null);
  const [closetData, setClosetData] = useState([]);

  useEffect(() => {
    if (props?.route?.params?.categoryType?.subCategory) {
      setClosetData(props?.route?.params?.categoryType?.subCategory);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(singleClosetReponse).length) {
      dispatch({type: 'SINGLE_CLOSET', value: {}});
      props.navigation.navigate('ClosetInfo', {
        apiData: singleClosetReponse,
      });
    }
  }, [dispatch, props.navigation, singleClosetReponse]);
  const openClosetInfo = id => {
    let data = {
      userId: userId,
      closetItemId: id,
    };
    dispatch(openClosetDetails(data));
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
    let data = closetData;
    data = data.sort((a, b) => {
      if (selectedSort.type === 'desc') {
        return moment(a.createdOn) < moment(b.createdOn) ? 1 : -1;
      } else if (selectedSort.type === 'asc') {
        return moment(a.createdOn) > moment(b.createdOn) ? 1 : -1;
      }
    });
    setClosetData(data);
  };

  const handleSortingModal = () => {
    setSortModal(true);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header
        showBack
        showFilter
        showFilterFunction={showFilterFunction}
        title={props?.route?.params?.categoryType?.category}
        {...props}
        showSort
        handleSorting={handleSortingModal}
      />
      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {closetData.map(item => {
            return (
              <TouchableOpacity
                style={{
                  width: '45%',
                  alignItems: 'center',
                  backgroundColor: Colors.grey1,
                  paddingHorizontal: 7,
                  paddingVertical: 12,
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
          })}
        </View>
      </ScrollView>
      {
        <FilterModal
          from="closet"
          showModal={showModal}
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

export default ClosetCategory;
