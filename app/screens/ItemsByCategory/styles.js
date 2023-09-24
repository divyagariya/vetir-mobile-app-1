import {StyleSheet} from 'react-native';
import {hp} from '../../utils/normalise';
import {Colors} from '../../colors';

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    backgroundColor: Colors.white,
  },
  flatListContainer: {
    marginTop: hp(0),
  },
});
