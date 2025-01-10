import React from "react";
import { Text } from "react-native";

const Paragraph = ({ children, style }) => {
  return <Text style={{ fontSize: 12, ...style }}>{children}</Text>;
};

export default Paragraph;
