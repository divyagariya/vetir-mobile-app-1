import {Image, Text, TouchableOpacity, View} from 'react-native';
import {FONTS_SIZES} from '../../fonts';
import Buttons from '../Buttons';
import React from 'react';

export const SortComponent = ({
  setSortModal = () => {},
  sortingData = [],
  handleSortingOption = () => {},
  selectedSortIndex = 0,
  handleSorting = () => {},
}) => {
  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontSize: FONTS_SIZES.s3, fontWeight: 'bold'}}>Sort</Text>
        <TouchableOpacity onPress={() => setSortModal(false)}>
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
      <View
        style={{
          paddingVertical: 10,
        }}>
        <Buttons text="Apply" onPress={handleSorting} />
      </View>
    </View>
  );
};
