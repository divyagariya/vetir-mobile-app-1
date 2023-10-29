import {StyleSheet} from 'react-native';
import {hp, normalize, spH, spV, wp} from '../../utils/normalise';
import {Colors} from '../../colors';
import {FONTS_SIZES} from '../../fonts';

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    height: spV(65),
    // paddingHorizontal: 16,
  },
  sendIcon: {
    width: spH(32),
    // marginBottom: 10,
    // alignSelf: 'center',
    height: spV(32),
  },
  headingText: {
    fontWeight: '700',
    fontSize: FONTS_SIZES.s14,
    marginTop: spV(10),
  },
  inputContainer: {
    marginTop: spV(15),
  },
  input: {
    padding: 16,
    marginTop: spV(2),
    marginBottom: spV(15),
    borderRadius: 8,
    height: spV(40),
    borderColor: Colors.greyBorder,
    borderWidth: 2,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: spV(50),
    marginBottom: spV(15),
    borderRadius: 10,
  },
  btnText: {
    fontSize: FONTS_SIZES.s14,
    fontWeight: '700',
    color: Colors.white,
  },
});
