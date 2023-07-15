import React from 'react';
import {Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Colors} from '../../../colors';

const Videos = ({runVideoVideos = () => {}, item = {}}) => {
  return (
    <TouchableOpacity
      style={[
        styles.liveVideos,
        {borderWidth: 2, borderColor: !item.view ? '#217AFF' : 'transparent'},
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
    marginLeft: 16,
    marginVertical: 16,
    borderRadius: 36,
    width: 64,
    height: 64,
    padding: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
  },
  title: {
    fontSize: 10,
    color: Colors.black60,
    marginTop: 8,
    textAlign: 'left',
  },
});
