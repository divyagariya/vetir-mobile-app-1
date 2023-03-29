import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {VView, VText, Buttons} from '../../components';
import {FONTS_SIZES} from '../../fonts';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {useDispatch, useSelector} from 'react-redux';
import {sendOtp, verifyOtp} from '../../redux/actions/sendOtpAction';
import Toast from 'react-native-simple-toast';
import {Colors} from '../../colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const VerifyEmail = propsData => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const [count, setCount] = useState(59);
  const [errorText, setErrorText] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const CELL_COUNT = 4;

  const [countDown, setCountDown] = useState(60 * 5);
  const [runTimer, setRunTimer] = useState(true);

  const otpResponse = useSelector(state => state.OtpReducer.otpResponse);

  const verifyOtpResponse = useSelector(
    state => state.OtpReducer.verifyOtpResponse,
  );

  useEffect(() => {
    if (value) {
      setErrorText(false);
    }
  }, [value]);

  useEffect(() => {
    if (Object.keys(verifyOtpResponse).length) {
      dispatch({type: 'VERIFY_OTP', value: ''});
      if (verifyOtpResponse.statusCode === 200) {
        setErrorText('');
        dispatch({type: 'USERID', value: verifyOtpResponse.userId});
        dispatch({
          type: 'IS_PROFILE_CREATED',
          value: verifyOtpResponse.isProfileCreated,
        });
      } else if (verifyOtpResponse.statusCode === 401) {
        setValue(null);
        setErrorText(true);
      }
    }
  }, [dispatch, verifyOtpResponse]);

  useEffect(() => {
    if (Object.keys(otpResponse).length) {
      if (otpResponse.statusCode === 200) {
        setCountDown(300);
        setRunTimer(true);
        setCount(59);
        dispatch({type: 'SEND_OTP', value: ''});
        Toast.show(otpResponse.statusMessage);
      }
    }
  }, [dispatch, otpResponse]);

  useEffect(() => {
    let timerId;
    if (runTimer) {
      timerId = setInterval(() => {
        setCountDown(countDown => countDown - 1);
      }, 1000);
    } else {
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [runTimer]);

  useEffect(() => {
    if (countDown < 0 && runTimer) {
      setRunTimer(false);
      setCountDown(0);
    }
  }, [countDown, runTimer]);

  const seconds = String(countDown % 60).padStart(2, 0);
  const minutes = String(Math.floor(countDown / 60)).padStart(2, 0);

  useEffect(() => {
    let interval = setInterval(() => {
      setCount(prev => {
        if (prev < 0) clearInterval(interval);
        return prev - 1;
      });
    }, 1000);
    // interval cleanup on component unmount
    return () => clearInterval(interval);
  }, [count]);

  const sendOtpAgain = () => {
    dispatch(
      sendOtp({
        emailId: propsData?.route?.params?.email,
        status: 2,
      }),
    );
  };

  const verifyOtpData = () => {
    dispatch(
      verifyOtp({
        emailId: propsData?.route?.params?.email,
        otp: value,
        status: 1,
      }),
    );
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <VText
          text="Verify your email"
          style={{
            fontSize: FONTS_SIZES.s3,
            fontWeight: '700',
            textAlign: 'center',
          }}
        />
        <VView
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 56,
          }}>
          <VText
            text="We have sent you a 4 digit OTP to your given email id "
            style={{
              marginVertical: 8,
              textAlign: 'center',
              lineHeight: 24,
              color: Colors.black60,
            }}
          />
          <VText
            text={propsData?.route?.params?.email}
            style={{fontWeight: '700', textAlign: 'center'}}
          />
        </VView>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[
                styles.cell,
                isFocused && styles.focusCell,
                {borderColor: errorText ? Colors.red : Colors.black30},
              ]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
        {errorText && (
          <VText
            text={'Enter a valid OTP'}
            style={{color: 'red', textAlign: 'right', marginTop: 8}}
          />
        )}
        {seconds != 0 ? (
          <VView style={{alignItems: 'flex-end', margin: 8}}>
            <VText
              style={{color: Colors.black60}}
              text={`OTP will be expired after ${minutes} : ${seconds}`}
            />
          </VView>
        ) : null}
        <VView style={{marginTop: 56}}>
          <Buttons text="Verify" onPress={verifyOtpData} />
          <Buttons
            disabled={count > 0 ? true : false}
            onPress={sendOtpAgain}
            text={
              count > 0 ? `Send otp again in ${count} secs` : 'Send otp again'
            }
            isInverse
          />
          <Buttons
            text="change email ID"
            isInverse
            noBorder
            onPress={() => propsData.navigation.goBack()}
          />
        </VView>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default VerifyEmail;

const styles = StyleSheet.create({
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#00000030',
    textAlign: 'center',
    height: 74,
    width: 74,
    lineHeight: 63,
  },
  focusCell: {
    borderColor: '#000',
    justifyContent: 'center',
  },
});
