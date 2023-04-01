import React from 'react';
import {StyleSheet, View, Modal, ActivityIndicator} from 'react-native';

const Loader = props => {
  const {loading} = props;

  return (
    <Modal transparent animationType={'none'} visible={loading}>
      <View style={styles.modalBackground}>
        <ActivityIndicator animating={loading} color="#41caf1" size={40} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000050',
  },
});

export default Loader;
