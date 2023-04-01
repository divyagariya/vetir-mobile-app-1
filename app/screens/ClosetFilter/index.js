import React, {useEffect, useState} from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import {Header} from '../../components';
import {
  getFilterCloset,
  openClosetDetails,
} from '../../redux/actions/closetAction';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../colors';
import {ScrollView} from 'react-native-gesture-handler';
import {FilterModal} from '../Closet';

const ClosetFilter = props => {
  const [showModal, setModal] = useState(false);
  const dispatch = useDispatch();
  const getFilterClosetResponse = useSelector(
    state => state.ClosetReducer.getFilterClosetResponse,
  );
  const userId = useSelector(state => state.AuthReducer.userId);
  const [previousFilter, setPreviousfilter] = useState({});
  const [filterArray, setFilterArray] = useState(getFilterClosetResponse);
  const getcloset = useSelector(state => state.ClosetReducer.getcloset);

  useEffect(() => {
    if (props?.route?.params?.filterData) {
      dispatch(getFilterCloset(props?.route?.params?.filterData));
      setPreviousfilter({
        selectedCategory: props?.route?.params?.filterData?.categoryIds,
        setSeasonData: props?.route?.params?.filterData?.seasons,
        selectedBrands: props?.route?.params?.filterData?.brandIds,
        selectedSubCategory: props?.route?.params?.filterData?.subCategoryIds,
        colorsFilter: props?.route?.params?.filterData?.colorCodes,
      });
    }
  }, []);

  useEffect(() => {
    setFilterArray(getFilterClosetResponse);
  }, [getFilterClosetResponse]);

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

    dispatch(getFilterCloset(dataObj));
  };

  const onResetFilter = () => {
    setModal(false);
    setFilterArray(getcloset);
  };

  const openClosetInfo = id => {
    let data = {
      userId: userId,
      closetItemId: id,
    };
    dispatch(openClosetDetails(data));
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header
        showBack
        {...props}
        showFilter
        showFilterFunction={showFilterFunction}
      />
      <View style={{flex: 1}}>
        {filterArray?.length > 0 && (
          <Text
            style={{
              padding: 16,
              color: Colors.black60,
            }}>{`${filterArray?.length} results found`}</Text>
        )}
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {filterArray?.length > 0 ? (
            filterArray.map(item => {
              return (
                <TouchableOpacity
                  key={item => item.closetItemId}
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
                  />
                </TouchableOpacity>
              );
            })
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: Dimensions.get('screen').height - 200,
                width: '100%',
              }}>
              <Text style={{color: Colors.black60}}>
                Umm, nothing is here...
              </Text>
            </View>
          )}
        </ScrollView>
        {
          <FilterModal
            showModal={showModal}
            hideModal={() => setModal(false)}
            setFilter={setFilter}
            filterValue={previousFilter}
            onResetFilter={onResetFilter}
            from="closet"
          />
        }
      </View>
    </View>
  );
};

export default ClosetFilter;
