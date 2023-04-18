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
import {FONTS_SIZES} from '../../fonts';

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
    backgroundColor: isInverse ? '#FFFFFF' : '#212427',
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: noBorder ? 'transparent' : Colors.greyBorder,
    height: 56,
    borderRadius: 8,
    marginBottom: 8,
  }),
  buttontext: (isInverse, textColor) => ({
    color: textColor ? textColor : isInverse ? 'black' : 'white',
    textTransform: 'capitalize',
    fontSize: FONTS_SIZES.s4,
    fontWeight: 'bold',
    lineHeight: 20,
  }),
});
