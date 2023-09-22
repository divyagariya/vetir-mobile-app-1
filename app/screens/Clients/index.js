import React, {useEffect} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../colors';
import {Header} from '../../components';
import {getAllClients} from '../../redux/actions/stylistAction';

const ClientList = ({item, index, onPress}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}
      onPress={() => onPress(item)}>
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
        <View style={{marginLeft: 8}}>
          <Text>{item.name}</Text>
          <Text style={{color: Colors.black30}}>{item.emailId}</Text>
        </View>
      </View>

      <View>
        <Image
          source={require('../../assets/rightArrow.png')}
          style={{width: 16, height: 16}}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
};

const Clients = props => {
  const dispatch = useDispatch();
  const allClientDataRespo = useSelector(
    state => state.StylistReducer.allClientDataRespo,
  );
  const refreshClients = useSelector(
    state => state.StylistReducer.refreshClients,
  );

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      dispatch(getAllClients());
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [props.navigation, dispatch]);

  const _onRefresh = () => {
    dispatch({type: 'REFRESH_CLIENTS', value: true});
    dispatch(getAllClients());
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white', paddingTop: 16}}>
      <Header
        onPressChat={() => {
          props.navigation.navigate('ChatScreen', {
            receiverDetails: {
              emailId: 'vetest@yopmail.com',
              name: 'Test',
              userId: '0d8688d4-e3f1-4559-82e3-589233997dcf',
            },
          });
        }}
        title="Clients"
        showMenu
        showChat
        {...props}
      />
      <View style={{flex: 1, padding: 16}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshClients}
              onRefresh={_onRefresh}
            />
          }>
          {allClientDataRespo.map((item, index) => {
            return (
              <ClientList
                item={item}
                index={index}
                onPress={item => {
                  dispatch({type: 'CLOSET_DATA', value: []});
                  dispatch({type: 'GET_OUTFIT', value: []});
                  console.log('item', item);
                  props.navigation.navigate('ClientDetails', {
                    item,
                  });
                }}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default Clients;
