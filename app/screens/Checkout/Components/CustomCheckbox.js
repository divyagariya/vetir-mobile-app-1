// CustomCheckbox.js
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors} from '../../../colors';
// import {Colors} from '../../colors';

const CustomCheckbox = ({label, isChecked, onToggle}) => {
  return (
    <TouchableOpacity onPress={onToggle}>
      <View style={styles.checkboxContainer}>
        <View
          style={[
            styles.checkbox,
            {backgroundColor: isChecked ? Colors.green : 'transparent'},
          ]}>
          {isChecked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default CustomCheckbox;
