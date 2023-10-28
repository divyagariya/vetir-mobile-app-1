import {StyleSheet} from 'react-native';
import {hp, normalize, spH, spV, wp} from '../../utils/normalise';
import {Colors} from '../../colors';
import {FONTS_SIZES} from '../../fonts';

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 16,
  },
  headerContainer: {
    height: spV(65),
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  parentContainer: {
    alignItems: 'center',
  },
  searchWebIcon: {
    height: 120,
    width: 120,
    marginTop: spV(60),
  },
  emptyTextContainer: {
    alignItems: 'center',
    marginTop: spV(15),
  },
  emptyText: {
    fontWeight: '400',
    fontSize: 15,
    color: '#333333',
    marginTop: spV(5),
  },
  whiteBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: spH(160),
    height: spV(40),
    marginTop: spV(20),
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.black60,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: spH(160),
    height: spV(40),
    marginTop: spV(20),
    borderRadius: 10,
    backgroundColor: Colors.black,
  },
  btnText: {
    fontSize: FONTS_SIZES.s14,
    fontWeight: '700',
    color: Colors.white,
  },
  bottomView: {
    height: spV(50),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    bottom: spV(20),
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: Colors.black30, // Shadow color
    shadowOffset: {
      width: 0,
      height: -5, // A negative value for the height creates a top shadow
    },
    shadowOpacity: 0.5, // Shadow opacity
    shadowRadius: 5,
    // shadowColor: '#000000',
  },
  billingView: {
    marginTop: spV(10),
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  billingTextView: {
    width: '75%',
  },
  billingText: {
    fontWeight: '400',
    fontSize: 15,
    color: Colors.black60,
    width: '55%',
  },
  addressText: {
    width: '85%',
    fontWeight: '400',
    fontSize: 15,
    color: Colors.black60,
  },
  selectBtn: {
    width: wp(95),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(25),
    borderWidth: 1,
    borderRadius: 3,
    borderColor: Colors.black60,
  },
  changeBtn: {
    width: wp(65),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(25),
    borderWidth: 1,
    borderRadius: 3,
    borderColor: Colors.black60,
  },
  billingTitle: {
    fontWeight: '500',
    fontSize: 16,
    color: Colors.black,
  },
});
