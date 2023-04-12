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
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../colors';
import {getClosetData} from '../../redux/actions/closetAction';
import {getOutfitsList} from '../../redux/actions/outfitActions';
import {recommendedProductsAction} from '../../redux/actions/stylistAction';

export const RenderItem = ({item, menuSelected}) => {
  if (menuSelected === 'Closet') {
    return <RenderCloset item={item} />;
  }
  if (menuSelected === 'Outfits') {
    return <RenderOutfits item={item} />;
  }
  return <RenderRecommenedProducts item={item} />;
};

export const RenderCloset = ({item}) => {
  return (
    <View style={{marginVertical: 8}}>
      <Image
        source={{uri: item.itemImageUrl}}
        style={{width: Dimensions.get('window').width / 2 - 24, height: 164}}
      />
    </View>
  );
};

export const RenderOutfits = ({item}) => {
  return (
    <View style={{marginVertical: 8}}>
      <Image
        source={{uri: item.outfitImageType}}
        style={{width: Dimensions.get('window').width / 2 - 24, height: 164}}
      />
      <Text style={{marginTop: 8}}>{item.name}</Text>
    </View>
  );
};

export const RenderRecommenedProducts = ({item}) => {
  return (
    <View style={{marginVertical: 8, paddingTop: 30}}>
      <View
        style={{
          backgroundColor: '#CE1A1A14',
          paddingHorizontal: 8,
          paddingVertical: 8,
          alignSelf: 'flex-end',
        }}>
        <Text style={{color: '#CE1A1A99'}}>not liked by client</Text>
      </View>
      <Image
        source={require('../../assets/sweatshirt.webp')}
        style={{width: Dimensions.get('window').width / 2 - 24, height: 164}}
      />
      <TouchableOpacity style={{marginTop: 8}}>
        <Image
          source={require('../../assets/iRecommend.png')}
          style={{
            height: 24,
            width: 24,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text style={{marginTop: 8}}>Black and White</Text>
      <Text>$100</Text>
    </View>
  );
};

const ClientDetails = props => {
  const dispatch = useDispatch();
  const [clinetData, setClientData] = useState(props?.route?.params?.item);
  const [menu, setMenu] = useState(['Closet', 'Outfits', 'Recommended by you']);
  const [menuSelected, setMenuSelected] = useState('Closet');
  const getcloset = useSelector(state => state.ClosetReducer.getcloset);
  const getOutfitData = useSelector(state => state.OutfitReducer.getOutfitData);

  console.log('getcloset', JSON.stringify(getOutfitData, undefined, 2));

  useEffect(() => {
    if (props?.route?.params?.item) {
      dispatch(getClosetData(props?.route?.params?.item?.userId));
      dispatch(getOutfitsList(props?.route?.params?.item?.userId));
      dispatch(recommendedProductsAction(props?.route?.params?.item?.userId));
    }
  }, [dispatch, props?.route?.params?.item]);

  const onPress = item => {
    setMenuSelected(item);
  };

  return (
    <View style={{flex: 1, padding: 20, backgroundColor: 'white'}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          style={{padding: 5}}
          onPress={() => props.navigation.goBack()}>
          <Image
            resizeMode="contain"
            source={require('../../assets/iBack.webp')}
            style={{width: 24, height: 18}}
          />
        </TouchableOpacity>
        <View style={{flexDirection: 'row', marginLeft: 12}}>
          {clinetData.profilePicUrl ? (
            <Image
              source={{uri: clinetData.profilePicUrl}}
              style={{width: 40, height: 40}}
            />
          ) : (
            <Image
              source={require('../../assets/iProfile.png')}
              style={{width: 40, height: 40}}
            />
          )}
          <View style={{marginLeft: 8}}>
            <Text>{clinetData.name}</Text>
            <Text style={{color: Colors.black30}}>{clinetData.emailId}</Text>
          </View>
        </View>
      </View>
      <View style={{marginTop: 12}}>
        <ScrollView horizontal bounces={false}>
          <View style={{flexDirection: 'row'}}>
            {menu.map(item => {
              return (
                <TouchableOpacity
                  style={{
                    padding: 8,
                    borderBottomWidth: 1,
                    borderBottomColor:
                      item === menuSelected ? 'black' : 'transparent',
                  }}
                  onPress={() => onPress(item)}>
                  <Text
                    style={{
                      color: menuSelected === item ? 'black' : Colors.black60,
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <FlatList
          data={
            menuSelected === 'Closet'
              ? getcloset
              : menuSelected === 'Outfits'
              ? getOutfitData
              : [1, 2]
          }
          showsVerticalScrollIndicator={false}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderItem item={item} menuSelected={menuSelected} />
          )}
        />
      </View>
    </View>
  );
};

export default ClientDetails;
