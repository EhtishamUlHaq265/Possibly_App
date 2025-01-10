import React, {useRef} from 'react';
import {View, Image, StyleSheet, Animated, Dimensions} from 'react-native';
import {Colors} from '../../constants/styles';
const Logo = ({isSticky}) => {
  const translateY = useRef(new Animated.Value(0)).current;

  Animated.spring(translateY, {
    toValue: isSticky ? 0 : -50,
    useNativeDriver: true,
  }).start();

  const {width, height} = Dimensions.get('window');

  const containerHeight = isSticky ? height * 0.17 : 0;

  return (
    <Animated.View
      style={[
        styles.container,
        isSticky && styles.stickyContainer,
        {transform: [{translateY}], height: containerHeight},
      ]}>
      <Image source={require('../../images/logo.png')} style={styles.image} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: Colors.primaryPurple,
    alignItems: 'center',
    zIndex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  stickyContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  image: {
    marginTop: '10%',
    width: '50%',
    resizeMode: 'contain',
    height: '70%',
  },
});

export default Logo;
