import React, {useState} from 'react';
import {Text, TextInput, View, StyleSheet, Image} from 'react-native';
import {Colors} from '../../colors';

const Input = ({
  placeholder = '',
  value = '',
  onChangeText = () => {},
  errorText = '',
  showIcon = false,
  iconName = '',
  propStyle = {},
  multiline = false,
}) => {
  return (
    <View>
      {showIcon && (
        <View style={styles.iconStyle}>
          <Image
            source={
              iconName
                ? require('../../assets/avatars_empty.webp')
                : require('../../assets/mail.webp')
            }
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
        style={[styles.input(errorText, showIcon, value), propStyle]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
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
    paddingLeft: showIcon ? 48 : 16,
    height: 56,
    fontSize: 15,
    borderRadius: 8,
  }),
  errorText: {
    color: Colors.red,
    fontSize: 13,
  },
  iconStyle: {
    position: 'absolute',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
});
