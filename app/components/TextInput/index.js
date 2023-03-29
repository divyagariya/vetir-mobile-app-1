import React, {useState} from 'react';
import {Text, TextInput, View, StyleSheet, Image} from 'react-native';
import {Colors} from '../../colors';

const Input = ({
  placeholder = '',
  value = '',
  onChangeText = () => {},
  errorText = '',
  showIcon = false,
}) => {
  return (
    <View>
      {showIcon && (
        <View style={styles.iconStyle}>
          <Image
            source={require('../../assets/mail.png')}
            style={{
              width: 24,
              height: 24,
              tintColor: value ? '#000' : Colors.black30,
            }}
          />
        </View>
      )}
      <TextInput
        placeholder={placeholder}
        style={styles.input(errorText, showIcon, value)}
        value={value}
        onChangeText={onChangeText}
      />
      <Text style={styles.errorText}>{errorText}</Text>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  input: (errorText, showIcon, value) => ({
    borderWidth: 1,
    padding: 16,
    borderColor: errorText
      ? Colors.red
      : value
      ? Colors.black60
      : Colors.greyBorder,
    marginVertical: 8,
    paddingLeft: showIcon ? 50 : 16,
  }),
  errorText: {
    color: Colors.red,
    fontSize: 13,
  },
  iconStyle: {
    position: 'absolute',
    paddingVertical: 22,
    paddingHorizontal: 18,
  },
});
