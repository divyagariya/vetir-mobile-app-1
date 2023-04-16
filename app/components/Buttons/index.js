import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
  Image,
} from 'react-native';
import {Colors} from '../../colors';
import VText from '../Text';

const Buttons = ({
  text = '',
  onPress = () => {},
  isInverse = false,
  noBorder = false,
  disabled = false,
  textColor = '',
  loading = false,
  imageIcon = null,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.buttonContainer(isInverse, noBorder)}
      onPress={loading ? () => {} : onPress}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {imageIcon !== null ? (
            <View style={{marginRight: 8}}>
              <Image
                source={imageIcon}
                resizeMode="contain"
                style={{width: 24, height: 24}}
              />
            </View>
          ) : null}
          <VText text={text} style={styles.buttontext(isInverse, textColor)} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Buttons;

const styles = StyleSheet.create({
  buttonContainer: (isInverse, noBorder) => ({
    backgroundColor: isInverse ? '#FFFFFF' : '#000000',
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    borderWidth: 2,
    borderColor: noBorder ? 'transparent' : Colors.grey1,
  }),
  buttontext: (isInverse, textColor) => ({
    color: textColor ? textColor : isInverse ? 'black' : 'white',
    textTransform: 'uppercase',
  }),
});
