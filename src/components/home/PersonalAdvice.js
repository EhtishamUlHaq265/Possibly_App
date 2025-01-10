import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Heading from '../typography/Heading';
import Paragraph from '../typography/Paragraph';

const PersonalAdvice = () => {
  const handleGetIn = () => {
    const whatsappLink = 'https://wa.me/4917685084910';
    Linking.openURL(whatsappLink);
  };

  return (
    <View style={styles.bgContainer}>
      <View style={styles.imageContainer}>
        <ImageBackground
          style={styles.bgImage}
          source={require('../../images/bg1.png')}>
          <View>
            <View style={styles.imgContainer}>
              <View style={styles.imgInnerContainer}>
                {/* <Image
                  source={require('../../images/whatsappB.png')}
                  style={styles.image}
                /> */}
                <Image
                  source={require('../../images/logo.png')}
                  style={styles.logo}
                />
              </View>
              <Heading style={styles.text}>Du hast Fragen oder </Heading>
              <Heading style={styles.text}> brauchst Hilfe?</Heading>

              <TouchableOpacity style={styles.button} onPress={handleGetIn}>
                <Paragraph style={styles.buttonText}>Hier klicken!</Paragraph>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default PersonalAdvice;

const styles = StyleSheet.create({
  bgContainer: {
    height: 210,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgInnerContainer: {
    flexDirection: 'row',
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  logo: {
    width: 100,
    resizeMode: 'contain',
    height: 50,
  },
  text: {
    color: 'white',
    fontWeight: '400',
  },
  button: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 8,
    marginTop: 6,
    backgroundColor: '#222138',
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '70%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
