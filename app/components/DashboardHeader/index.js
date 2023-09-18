import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {wp, hp} from '../../utils/normalise';
import {FONTS_SIZES} from '../../fonts';

const DashboardHeader = props => {
  const {headerText, navigation} = props;
  return (
    <SafeAreaView style={Styles.headerContainer}>
      <TouchableOpacity
        style={Styles.backBtn}
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../../assets/iBack.webp')}
          style={Styles.backIcon}
        />
      </TouchableOpacity>
      <Text style={Styles.headerText}>{headerText}</Text>
    </SafeAreaView>
  );
};
export default DashboardHeader;

const Styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    paddingHorizontal: wp(20),
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(40),
  },
  backBtn: {
    height: hp(20),
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(20),
  },
  backIcon: {
    height: hp(24),
    width: wp(24),
  },
  headerText: {
    marginLeft: wp(20),
    fontWeight: 'bold',
    fontSize: FONTS_SIZES.s3,
  },
});
