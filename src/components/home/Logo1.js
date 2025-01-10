import React, { useRef } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";
import { Colors } from "../../constants/styles";

const Logo1 = ({ isSticky }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  Animated.spring(translateY, {
    toValue: isSticky ? 20 : -50,
    useNativeDriver: true,
  }).start();

  const containerHeight = isSticky ? 60 : 0;

  return (
    <Animated.View
      style={[
        styles.container,
        isSticky && styles.stickyContainer,
        { transform: [{ translateY }], height: containerHeight },
      ]}
    >
      <Image
        source={require("../../images/logo.png")}
        style={styles.image}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomRightRadius:20,
    borderBottomLeftRadius:20,
    backgroundColor: Colors.primaryPurple,
    alignItems: "center",
    zIndex: 1,
    overflow: "hidden",
    
    justifyContent:"center",
  },
  stickyContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
  },
  image: {
    top: 0,
    marginTop:"2%",
    width: 100,
    resizeMode: "contain",
    alignSelf:"center",
    justifyContent:"center",
    height: 50,
  },
});

export default Logo1;
