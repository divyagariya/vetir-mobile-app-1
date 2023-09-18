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
import {Colors} from '../../colors';

const DashboardHeader = props => {
  const {headerText, navigation, showRightBtn} = props;
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
      {showRightBtn ? (
        <TouchableOpacity
          style={Styles.rightBtn}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/chat.png')}
            style={Styles.rightIcon}
          />
          <Text style={Styles.rightBtnText}>{'Get Help'}</Text>
        </TouchableOpacity>
      ) : undefined}
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
    backgroundColor: Colors.white,
    height: hp(50),
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
    width: '50%',
    fontSize: FONTS_SIZES.s3,
  },
  rightBtn: {
    width: wp(110),
    height: hp(30),
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    borderColor: Colors.greyBorder,
    borderWidth: 1,
    borderRadius: 24,
  },
  rightBtnText: {
    fontWeight: '700',
    fontSize: FONTS_SIZES.s14,
  },
  rightIcon: {
    height: wp(20),
    width: wp(20),
  },
});
