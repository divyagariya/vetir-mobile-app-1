import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Colors} from '../../colors';
import {Header} from '../../components';

const ClientList = ({item, index, onPress}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      onPress={() => onPress(item)}>
      <View style={{flexDirection: 'row'}}>
        {item.profilePicUrl ? (
          <Image
            source={{uri: item.profilePicUrl}}
            style={{width: 40, height: 40}}
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
          source={require('../../assets/iRight.png')}
          style={{width: 16, height: 16}}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
};

const Clients = props => {
  const allClientDataRespo = useSelector(
    state => state.StylistReducer.allClientDataRespo,
  );
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header title="Clients" showMenu {...props} />
      <View style={{flex: 1, padding: 16}}>
        {allClientDataRespo.map((item, index) => {
          return (
            <ClientList
              item={item}
              index={index}
              onPress={item =>
                props.navigation.navigate('ClientDetails', {
                  item,
                })
              }
            />
          );
        })}
      </View>
    </View>
  );
};

export default Clients;
