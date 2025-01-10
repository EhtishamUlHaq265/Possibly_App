import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";

const Card = ({ onPress, children }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.card, Platform.OS === 'ios' && styles.cardIOS]}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    elevation: 3
  },
  cardIOS: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Card;
