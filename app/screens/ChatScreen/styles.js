import {StyleSheet} from 'react-native';
import {hp, spH, spV, wp} from '../../utils/normalise';
import {Colors} from '../../colors';
import {FONTS_SIZES} from '../../fonts';

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
  },
  sendIcon: {
    width: spH(40),
    height: spV(40),
  },
  textInputStyle: {
    backgroundColor: 'lightgrey',
    width: spH(150),
    height: spV(80),
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});
