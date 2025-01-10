import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/styles";

const Button = ({ text, onPress, buttonStyle, textStyle, accountLoginBtn }) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, accountLoginBtn]}
      onPress={onPress}
    >
      <Text style={[styles.text, textStyle, ]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primaryPurple,
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  text: {
    color: "white",
    fontSize: 12,
  },
});

export default Button;
