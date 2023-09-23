import {StyleSheet} from 'react-native';
import {hp, spH, spV, wp} from '../../utils/normalise';
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
    backgroundColor: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spV(16),
    marginLeft: spH(36)
  },
  sendIcon: {
    width: spH(30),
    marginBottom: 10,
    // alignSelf: 'center',
    height: spV(30),
  },
  textInputStyle: {
    width: spH(150),
    marginBottom: 10,
    height: spV(80),
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  messageImage: {
    margin: 3,
    width: spH(200),
    height: spV(200),
    borderRadius: 13,
  },
  headerText: {
    marginLeft: wp(20),
    fontWeight: 'bold',
    width: '55%',
    fontSize: FONTS_SIZES.s3,
  },
});
