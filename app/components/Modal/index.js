import Modal from 'react-native-modal';
import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const OverlayModal = ({
  component = {},
  showModal = false,
  onDismiss,
  isScrollEnabled = true,
}) => {
  return (
    <View>
      <Modal
        animationIn="fadeInUpBig"
        avoidKeyboard
        animationInTiming={400}
        animationOutTiming={900}
        isVisible={showModal}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        onDismiss={onDismiss}>
        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
          }}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            scrollEnabled={isScrollEnabled}>
            {component}
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default OverlayModal;
