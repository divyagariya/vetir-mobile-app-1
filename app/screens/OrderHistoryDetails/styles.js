import {StyleSheet} from 'react-native';
import {FONTS_SIZES} from '../../fonts';
import {Colors} from '../../colors';
import {hp, spH, spV, wp} from '../../utils/normalise';

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ordercontainer: {
    padding: 16,
    marginTop: hp(3),
    backgroundColor: Colors.white,
  },
  headerContainer: {
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  orderText: {
    fontWeight: '400',
    marginTop: hp(3),
    fontSize: FONTS_SIZES.s4,
    color: Colors.greyText,
  },
  deliverText: {
    fontWeight: '400',
    marginTop: hp(12),
    fontSize: FONTS_SIZES.s4,
  },
  btncontainer: {
    padding: 16,
    marginTop: hp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
  },
  reOrderBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: spH(165),
    height: spV(50),
    borderRadius: hp(8),
    borderWidth: 1,
    borderColor: Colors.greyBorder,
  },
  btnText: {
    fontSize: FONTS_SIZES.s14,
    fontWeight: '700',
    marginLeft: wp(5),
  },
  cardContainer: {
    marginTop: 5,
    backgroundColor: Colors.white,
  },
  icon: {
    height: 24,
    width: 24,
  },
});
