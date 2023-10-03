import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {useSelector} from 'react-redux';
import {FONTS_SIZES} from '../../../fonts';
import {Colors} from '../../../colors';
import {Buttons, Input} from '../../../components';
import {ClientList} from '..';

export const ClientModelChat = ({
  setShowClientModalForChat = () => {},
  selectedProductData = {},
  navigation,
}) => {
  const allClientDataRespo = useSelector(
    state => state.StylistReducer.allClientDataRespo,
  );

  return (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
          <Text style={{fontSize: FONTS_SIZES.s3, fontWeight: 'bold'}}>
            Send to your clients
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowClientModalForChat(false)}>
          <Image
            source={require('../../../assets/cross.webp')}
            style={{width: 32, height: 32}}
          />
        </TouchableOpacity>
      </View>
      <View style={{marginVertical: 16}}>
        {allClientDataRespo.map((item, index) => {
          return (
            <ClientList
              showChatIcon
              item={item}
              onPressChat={() => {
                setShowClientModalForChat(false);
                navigation.navigate('ChatScreen', {
                  selectedProductData: selectedProductData,
                  comingFromProduct: true,
                  receiverDetails: {
                    emailId: item?.emailId,
                    name: item?.name,
                    userId: item?.userId,
                  },
                });
              }}
              index={index}
              selectedClients={() => {
                setShowClientModalForChat(false);
                navigation.navigate('ChatScreen', {
                  selectedProductData: selectedProductData,
                  comingFromProduct: true,
                  receiverDetails: {
                    emailId: item?.emailId,
                    name: item?.name,
                    userId: item?.userId,
                  },
                });
              }}
            />
          );
        })}
      </View>
      {/* <Buttons text="Send to Chat" onPress={() => recommendToClients(note)} /> */}
    </View>
  );
};
