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
    // paddingHorizontal: 16,
    backgroundColor: 'red',
  },
  sendIcon: {
    width: spH(30),
    // marginBottom: 10,
    // alignSelf: 'center',
    height: spV(30),
  },
  textInputStyle: {
    // marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  messageImage: {
    margin: 3,
    width: spH(200),
    height: spV(200),
    borderRadius: 13,
  },
  modalView: {
    margin: 0,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  crossBtn: {
    alignSelf: 'flex-end',
    marginTop: normalize(40),
    marginRight: normalize(30),
  },
  crossIcon: {
    width: 32,
    height: 32,
  },

  previewCountText: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  captionPriceText: {
    fontWeight: '400',
    width: '100%',
    fontSize: FONTS_SIZES.s4,
    color: Colors.black,
  },
  closetBtn: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closetIcon: {
    height: 24,
    width: 24,
  },
});
