import React from 'react';
import {Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Colors} from '../../../colors';
import {VView} from '../../../components';

const Videos = ({runVideoVideos = () => {}, item = {}}) => {
  return (
    <TouchableOpacity
      style={[
        styles.liveVideos,
        {
          borderWidth: !item.view ? 2 : 1,
          borderColor: !item.view ? '#217AFF' : '#00000029',
        },
      ]}
      onPress={runVideoVideos}>
      <Image source={{uri: item.thumbnail}} style={styles.image} />
      <Text numberOfLines={2} style={styles.title}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

export default Videos;

const styles = StyleSheet.create({
  liveVideos: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 32,
    borderRadius: 37,
    width: 74,
    height: 74,
    padding: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 37,
  },
  title: {
    fontSize: 10,
    color: Colors.black60,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 14,
  },
});
