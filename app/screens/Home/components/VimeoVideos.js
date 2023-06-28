import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Vimeo} from 'react-native-vimeo-iframe';

const VimeoVideoPlayer = ({vimeoId}) => {
  return (
    <View style={styles.container}>
      <Vimeo
        videoId={vimeoId}
        autoplay={false}
        loop={false}
        controls={true}
        // onReady={handleReady}
        // onPlay={handlePlay}
        // onPause={handlePause}
        // onEnded={handleEnded}
        // onTimeUpdate={handleTimeUpdate}
        // onProgress={handleProgress}
        // onSeeked={handleSeeked}
        // onVolumeChange={handleVolumeChange}
        // onError={handleError}
      />
    </View>
  );
};

export default VimeoVideoPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
});
