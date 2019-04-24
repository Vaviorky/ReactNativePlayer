import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';

const ControlsButton = ({icon, onPress, customIconStyle = null}) => {
  return (
    <TouchableOpacity style={styles.buttonOutline} onPress={onPress}>
      <View style={styles.buttonInside}>
        <Image source={icon} style={customIconStyle} />
      </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  buttonOutline: {
    width: 40,
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "#FFF",
    alignItems: "center"
  },
  buttonInside: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    backgroundColor: "#282828",
    alignItems: "center"
  }
});

export default ControlsButton;