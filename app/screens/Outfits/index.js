/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../colors';
import {Buttons, Header, OverlayModal, VView} from '../../components';
import {FONTS_SIZES} from '../../fonts';
import {getOutfitsList} from '../../redux/actions/outfitActions';

const Outfits = props => {
  const dispatch = useDispatch();
  const [showModal, setModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState({});
  const [selectedSortIndex, setSelectedSortIndex] = useState(null);

  const sortingData = [
    {
      type: 'asc',
      title: 'Alphabetical (A to Z)',
      isSelected: true,
    },
    {
      type: 'desc',
      title: 'Alphabetical (Z to A)',
      isSelected: false,
    },
    {
      type: 'dateAsc',
      title: 'Date added',
      isSelected: false,
    },
    {
      type: 'dateDesc',
      title: 'Date modified',
      isSelected: false,
    },
  ];

  const getOutfitData =
    useSelector(state => state.OutfitReducer.getOutfitData) || [];

  const renderItem = (item, index) => {
    return (
      <View
        style={{
          marginBottom: 16,
          alignSelf: 'center',
          flex: 0.5,
          marginHorizontal: 8,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            props.navigation.navigate('OutfitDetail', {
              outfitId: item.outfitId,
            })
          }
          style={{
            backgroundColor: Colors.grey1,
            paddingVertical: 10,
            paddingHorizontal: 13,
            width: '100%',
            alignSelf: 'center',
            marginBottom: 8,
          }}>
          <Image
            resizeMode="contain"
            source={{uri: item.outfitImageType}}
            style={{
              height: 200,
              width: 100,
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>
        <Text>{item.name}</Text>
      </View>
    );
  };

  const sortData = () => {
    return (
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontSize: FONTS_SIZES.s3, fontWeight: 'bold'}}>
            Sort
          </Text>
          <TouchableOpacity onPress={() => setModal(false)}>
            <Image
              source={require('../../assets/cross.webp')}
              style={{width: 32, height: 32}}
            />
          </TouchableOpacity>
        </View>
        {sortingData.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => handleSortingOption(item, index)}
              style={{paddingVertical: 12, flexDirection: 'row'}}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 22,
                }}>
                {selectedSortIndex == index && (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 10,
                      backgroundColor: 'black',
                    }}
                  />
                )}
              </View>
              <Text>{item.title}</Text>
            </TouchableOpacity>
          );
        })}
        <VView
          style={{
            paddingVertical: 10,
          }}>
          {selectedSortIndex !== null && (
            <Buttons text="Apply" onPress={handleSorting} />
          )}
        </VView>
      </View>
    );
  };

  const handleSortingOption = (item, index) => {
    setSelectedSort(item);
    setSelectedSortIndex(index);
  };

  const handleSorting = () => {
    if (selectedSort?.type == 'asc' || selectedSortIndex == 0) {
      getOutfitData.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1,
      );
      setSelectedSort(0);
    } else if (selectedSort?.type == 'desc') {
      getOutfitData.sort((a, b) =>
        a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1,
      );
      setSelectedSort(0);
    } else if (selectedSort?.type == 'dateAsc' || selectedSortIndex == 0) {
      getOutfitData.sort((a, b) =>
        new Date(a.createdDate) < new Date(b.createdDate) ? 1 : -1,
      );
      setSelectedSort(0);
    } else if (selectedSort?.type == 'dateDesc') {
      getOutfitData.sort((a, b) =>
        new Date(a.modifiedDate) < new Date(b.modifiedDate) ? 1 : -1,
      );
      setSelectedSort(0);
    }
    setModal(false);
  };

  const handleSortingModal = () => {
    setModal(true);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header
        title="Outfits"
        showSort={getOutfitData.length > 0}
        showMenu
        {...props}
        handleSorting={handleSortingModal}
      />
      {getOutfitData.length > 0 ? (
        <FlatList
          data={getOutfitData}
          numColumns={2}
          keyExtractor={(item, index) => item.outfitId}
          renderItem={({item, index}) => renderItem(item, index)}
          contentContainerStyle={{
            paddingVertical: 16,
            paddingHorizontal: 8,
            paddingBottom: 100,
          }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}>
          <Image
            source={require('../../assets/no_outfit.png')}
            style={{width: 160, height: 160}}
          />
          <Text style={{textAlign: 'center', padding: 16, lineHeight: 24}}>
            No Outfits to show. {'\n'} Create outfits to get more personalised
            clothing experinece
          </Text>
        </View>
      )}

      <OverlayModal showModal={showModal} component={sortData()} />
      <View
        style={{padding: 16, position: 'absolute', bottom: 16, width: '100%'}}>
        <Buttons
          text="Create Outfit"
          onPress={() => props.navigation.navigate('AddOutfit')}
        />
      </View>
    </View>
  );
};

export default Outfits;
