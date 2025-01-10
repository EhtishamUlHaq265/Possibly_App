import React from "react";
import { Text } from "react-native";

const Heading = ({ children, style }) => {
  return (
    <Text style={{ fontSize: 18, fontWeight: "bold", ...style }}>
      {children}
    </Text>
  );
};

export default Heading;
