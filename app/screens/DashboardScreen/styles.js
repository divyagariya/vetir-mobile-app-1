import {StyleSheet} from 'react-native';
import {hp, wp} from '../../utils/normalise';
import {Colors} from '../../colors';
import {FONTS_SIZES} from '../../fonts';

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  profileDetailsContainer: {
    marginTop: hp(20),
    alignItems: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    height: wp(65),
    width: wp(65),
    borderRadius: wp(32.5),
    marginBottom: hp(10),
  },
  firstRowView: {
    paddingHorizontal: wp(20),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  separatorView: {
    height: hp(16),
    width: wp(1),
    backgroundColor: Colors.grey2,
  },
  viewProfileBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    height: hp(38),
    borderWidth: 1,
    borderColor: Colors.greyBorder,
  },
  btnText: {
    fontWeight: '700',
    fontSize: FONTS_SIZES.s5,
  },
  nameText: {
    fontWeight: '700',
    fontSize: FONTS_SIZES.s4,
  },
  purchaseHeader: {
    fontWeight: '700',
    fontSize: FONTS_SIZES.s4,
    marginTop: hp(30),
  },
});
