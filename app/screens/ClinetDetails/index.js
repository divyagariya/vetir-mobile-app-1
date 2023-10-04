import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../colors';
import {Buttons, OverlayModal} from '../../components';
import {FONTS_SIZES} from '../../fonts';
import {
  getClosetData,
  openClosetDetails,
} from '../../redux/actions/closetAction';
import {getProductDetailsApi} from '../../redux/actions/homeActions';
import {getOutfitsList} from '../../redux/actions/outfitActions';
import {
  recommendedAction,
  recommendedProductsAction,
} from '../../redux/actions/stylistAction';
import {RenderClients} from '../CategoryScreen';
import {Styles} from './styles';

export const RenderItem = ({
  item,
  menuSelected,
  recommendToClients,
  openCloset,
  openOutfit,
  openProduct,
}) => {
  if (menuSelected === 'Closet') {
    return <RenderCloset item={item} openCloset={openCloset} />;
  }
  if (menuSelected === 'Outfits') {
    return <RenderOutfits item={item} openOutfit={openOutfit} />;
  }
  return (
    <RenderRecommenedProducts
      openProduct={openProduct}
      item={item}
      recommendToClients={recommendToClients}
    />
  );
};

export const RenderCloset = ({item, openCloset}) => {
  return (
    <TouchableOpacity style={{margin: 8}} onPress={openCloset}>
      <Image
        source={{uri: item.itemImageUrl}}
        style={{width: 144, height: 164}}
      />
    </TouchableOpacity>
  );
};

export const RenderOutfits = ({item, openOutfit}) => {
  return (
    <TouchableOpacity style={{margin: 8}} onPress={openOutfit}>
      <Image
        source={{uri: item.outfitImageType}}
        style={{width: Dimensions.get('window').width / 2 - 24, height: 164}}
      />
      <Text style={{marginTop: 8}}>{item.name}</Text>
    </TouchableOpacity>
  );
};

export const RenderRecommenedProducts = ({
  item,
  recommendToClients,
  openProduct,
}) => {
  return (
    <TouchableOpacity
      onPress={openProduct}
      style={{
        paddingTop: 30,
        paddingHorizontal: 8,
        marginVertical: 8,
        // width: Dimensions.get('window').width / 2 - 40,
      }}>
      {item.isDisliked ? (
        <View
          style={{
            backgroundColor: '#CE1A1A14',
            paddingHorizontal: 8,
            paddingVertical: 8,
            position: 'absolute',
            right: 6,
          }}>
          <Text style={{color: '#CE1A1A99'}}>not liked by client</Text>
        </View>
      ) : null}
      <Image
        source={{uri: item.imageUrls[0]}}
        style={{width: Dimensions.get('window').width / 2 - 40, height: 164}}
      />
      <TouchableOpacity style={{marginTop: 8}} onPress={recommendToClients}>
        <Image
          source={require('../../assets/iRecommend.png')}
          style={{
            height: 24,
            width: 24,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text
        numberOfLines={1}
        style={{marginTop: 8, width: Dimensions.get('window').width / 2 - 40}}>
        {item.productName}
      </Text>
      <Text>{`$${item.productPrice}`}</Text>
    </TouchableOpacity>
  );
};

const ClientDetails = props => {
  const dispatch = useDispatch();
  const allClientDataRespo = useSelector(
    state => state.StylistReducer.allClientDataRespo,
  );
  const [selectedProductImg, setSelectedProductImg] = useState('');
  const [clinetData, setClientData] = useState(props?.route?.params?.item);
  const [menu, setMenu] = useState(['Closet', 'Outfits', 'Recommended by you']);
  const [menuSelected, setMenuSelected] = useState('Closet');
  const getcloset = useSelector(state => state.ClosetReducer.getcloset);
  const getOutfitData = useSelector(state => state.OutfitReducer.getOutfitData);
  const recommendedProductsClientsRes = useSelector(
    state => state.StylistReducer.recommendedProductsClientsRes,
  );
  const userId = useSelector(state => state.AuthReducer.userId);
  const [selectedClients, setSelectedClients] = useState([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [recommendedProductId, setRecommendedProductId] = useState('');
  const recommendedToClientsRes = useSelector(
    state => state.StylistReducer.recommendedToClientsRes,
  );
  const singleClosetReponse = useSelector(
    state => state.ClosetReducer.singleClosetReponse,
  );
  const productDetailResponse = useSelector(
    state => state.HomeReducer.productDetailResponse,
  );
  useEffect(() => {
    if (Object.keys(recommendedToClientsRes).length) {
      if (recommendedToClientsRes.statusCode === 200) {
        setSelectedClients([]);
        dispatch({type: 'RECOMMENDED_TO_CLIENTS', value: {}});
        Toast.show('Recommended to clients successfuly');
      }
    }
  }, [recommendedToClientsRes, dispatch]);

  useEffect(() => {
    if (props?.route?.params?.item) {
      dispatch(getClosetData(props?.route?.params?.item?.userId));
      dispatch(getOutfitsList(props?.route?.params?.item?.userId));
      dispatch(recommendedProductsAction(props?.route?.params?.item?.userId));
    }
  }, [dispatch, props?.route?.params?.item]);

  useEffect(() => {
    if (Object.keys(productDetailResponse).length) {
      props.navigation.navigate('ViewProduct', {
        data: productDetailResponse.productDetails,
      });
      dispatch({type: 'GET_PRODUCT_DETAILS', value: {}});
    }
  }, [productDetailResponse]);

  useEffect(() => {
    if (Object.keys(singleClosetReponse).length) {
      dispatch({type: 'SINGLE_CLOSET', value: {}});
      props.navigation.navigate('ClosetInfo', {
        apiData: singleClosetReponse,
        id: props?.route?.params?.item?.userId,
      });
    }
  }, [
    dispatch,
    props.navigation,
    props?.route?.params?.item?.userId,
    singleClosetReponse,
  ]);

  const onPress = item => {
    setMenuSelected(item);
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
    setShowClientModal(false);
    dispatch(recommendedAction(data));
  };

  const recommentToClient = item => {
    setShowClientModal(true);
    setSelectedProductImg(item.imageUrls[0]);
    setRecommendedProductId(item.productId);
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

  const openClosetInfo = id => {
    let data = {
      userId: props?.route?.params?.item?.userId,
      closetItemId: id,
    };
    dispatch(openClosetDetails(data));
  };

  const getProductDetails = productId => {
    dispatch(
      getProductDetailsApi(productId, props?.route?.params?.item?.userId),
    );
  };

  return (
    <View style={{backgroundColor: 'white', flex: 2}}>
      <View
        style={{flex: 1, padding: 16, backgroundColor: 'white', marginTop: 8}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Image
              resizeMode="contain"
              source={require('../../assets/iBack.webp')}
              style={{width: 32, height: 32, marginRight: 8}}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
            }}>
            {clinetData.profilePicUrl ? (
              <Image
                source={{uri: clinetData.profilePicUrl}}
                style={{width: 32, height: 32, borderRadius: 20}}
              />
            ) : (
              <Image
                source={require('../../assets/iProfile.png')}
                style={{width: 32, height: 32}}
              />
            )}
            <View style={{marginLeft: 8, flex: 1}}>
              <Text>{clinetData.name}</Text>
              <Text style={{color: Colors.black30}}>{clinetData.emailId}</Text>
            </View>
            <TouchableOpacity
              style={Styles.dashboardBtn}
              onPress={() =>
                props.navigation.navigate('DashboardScreen', {
                  profilePicUrl: clinetData?.profilePicUrl,
                  name: clinetData?.name,
                  emailId: clinetData?.emailId,
                  userId: clinetData?.userId,
                })
              }>
              <Image
                resizeMode="contain"
                style={{height: 24, width: 24}}
                source={require('../../assets/dashboardicon.webp')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginVertical: 16, flex: 1}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ScrollView
              bounces={false}
              horizontal
              showsHorizontalScrollIndicator={false}>
              <View style={{flexDirection: 'row'}}>
                {menu.map(item => {
                  return (
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 8,
                        paddingBottom: 4,
                        borderBottomWidth: 1,
                        borderBottomColor:
                          item === menuSelected ? 'black' : 'transparent',
                      }}
                      onPress={() => onPress(item)}>
                      <Text
                        style={{
                          color:
                            menuSelected === item ? 'black' : Colors.black60,
                        }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={{flex: 1, marginTop: 12}}>
              <FlatList
                data={
                  menuSelected === 'Closet'
                    ? getcloset
                    : menuSelected === 'Outfits'
                    ? getOutfitData
                    : recommendedProductsClientsRes
                }
                showsVerticalScrollIndicator={false}
                numColumns={2}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      paddingTop: 150,
                    }}>
                    <Text style={{color: Colors.black60}}>No Data Found</Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <RenderItem
                    item={item}
                    openCloset={() => openClosetInfo(item.closetItemId)}
                    menuSelected={menuSelected}
                    recommendToClients={() => recommentToClient(item)}
                    openProduct={() => getProductDetails(item.productId)}
                    openOutfit={() =>
                      props.navigation.navigate('OutfitDetail', {
                        outfitId: item.outfitId,
                        id: props?.route?.params?.item?.userId,
                      })
                    }
                  />
                )}
              />
            </View>
          </ScrollView>
        </View>
        {showClientModal && (
          <OverlayModal
            isScrollEnabled={false}
            showModal={showClientModal}
            component={
              <RenderClients
                setShowClientModal={setShowClientModal}
                selectClient={selectClient}
                selectedClients={selectedClients}
                recommendToClients={recommendToClients}
                selectedProductImg={selectedProductImg}
              />
            }
          />
        )}
      </View>
    </View>
  );
};

export default ClientDetails;
