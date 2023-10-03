/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../colors';
import {Buttons, Header, OverlayModal, VView} from '../../components';
import {FONTS_SIZES} from '../../fonts';
import {getOutfitsList} from '../../redux/actions/outfitActions';
import {normalize} from '../../utils/normalise';
import {ClientModelChat} from '../CategoryScreen/components/clientModelChat';

const Outfits = props => {
  const dispatch = useDispatch();
  const [showModal, setModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState({});
  const [selectedSortIndex, setSelectedSortIndex] = useState(null);
  const [showClientModalForChat, setShowClientModalForChat] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState({});
  const isStylistUser = useSelector(state => state.AuthReducer.isStylistUser);
  const personalStylistDetails = useSelector(
    state => state.ProfileReducer?.userProfileResponse.personalStylistDetails,
  );
  const {
    emailId = '',
    name = '',
    _id = '',
  } = (personalStylistDetails && personalStylistDetails[0]) || {};
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

  const userId = useSelector(state => state.AuthReducer.userId);

  const renderItem = (item, index) => {
    return (
      <View
        style={{
          marginBottom: 16,
          alignSelf: 'center',
          flex: 0.5,
          height: 196,
          marginHorizontal: 8,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            props.navigation.navigate('OutfitDetail', {
              outfitId: item.outfitId,
              id: userId,
            })
          }
          style={{
            backgroundColor: Colors.grey1,
            flex: 1,
            width: '100%',
            alignSelf: 'center',
            marginBottom: 8,
          }}>
          <Image
            resizeMode="contain"
            source={{uri: item.outfitImageType}}
            style={{
              flex: 1,
              width: '100%',
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: normalize(10),
            top: normalize(5),
          }}
          onPress={() => {
            const item1 = {
              imageUrls: [item?.itemImageUrl],
              brandName: item?.brandName,
              productName: '',
              productPrice: '',
              categoryId: item?.categoryId,
              subCategoryId: item?.subCategoryId,
              brandId: item?.brandId,
              season: item?.seasons,
              productColorCode: item?.colorCode,
              isImageBase64: false,
            };
            setSelectedProductData(item1);
            if (isStylistUser) {
              setShowClientModalForChat(true);
            } else {
              props.navigation.navigate('ChatScreen', {
                selectedProductData: item1,
                comingFromProduct: true,
                receiverDetails: {
                  emailId: emailId,
                  name: name,
                  userId: _id,
                },
              });
            }
            setSelectedProductData(item1);
          }}>
          <Image
            source={require('../../assets/send_to_chat.webp')}
            style={{width: 20, height: 20}}
            resizeMode="contain"
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
    <View style={{flex: 1, backgroundColor: 'white', paddingTop: 16}}>
      <Header
        title="Outfits"
        showSort={getOutfitData.length > 0}
        showMenu
        {...props}
        handleSorting={handleSortingModal}
      />
      {getOutfitData.length > 0 ? (
        <View style={{flex: 1}}>
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
          <View
            style={{
              paddingTop: 16,
              paddingBottom: 8,
              paddingHorizontal: 16,
              backgroundColor: Colors.white,
            }}>
            <Buttons
              text="Create Outfit"
              onPress={() => props.navigation.navigate('AddOutfit')}
            />
          </View>
        </View>
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
            style={{width: 160, height: 160, marginBottom: 32}}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: FONTS_SIZES.s3,
              fontWeight: '700',
              lineHeight: 24,
              marginBottom: 8,
            }}>
            No outfits yet
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: FONTS_SIZES.s4,
              lineHeight: 24,
              marginBottom: 32,
            }}>
            Create outfits to get more personalised clothing experience
          </Text>
          <View
            style={{
              width: '100%',
              margin: 16,
            }}>
            <Buttons
              text="Create Outfit"
              onPress={() => props.navigation.navigate('AddOutfit')}
            />
          </View>
        </View>
      )}

      <OverlayModal showModal={showModal} component={sortData()} />
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

export default Outfits;
