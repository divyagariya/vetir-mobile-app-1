import {StyleSheet} from 'react-native';
import {hp} from '../../utils/normalise';
import {Colors} from '../../colors';
import {FONTS_SIZES} from '../../fonts';

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    backgroundColor: Colors.white,
  },
  profileText: {
    fontWeight: '400',
    fontSize: FONTS_SIZES.s4,
    color: Colors.greyText,
    marginTop: hp(5),
  },
  detailsContainer: {
    marginTop: hp(20),
  },
  heading: {
    fontWeight: '700',
    fontSize: FONTS_SIZES.s4,
    marginTop: hp(30),
  },
});
