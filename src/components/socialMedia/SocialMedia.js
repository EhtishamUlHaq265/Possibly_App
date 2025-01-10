import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import Heading from '../typography/Heading';

const {width} = Dimensions.get('window');

const SocialMedia = ({social}) => {
  const handleInstagramPress = () => {
    if (social?.instagram) {
      Linking.openURL(`https://www.instagram.com/${social.instagram}`);
    }
  };
  const handleLinkedInPress = () => {
    if (social?.linkedin) {
      Linking.openURL(`https://www.linkedin.com/in/${social.linkedin}`);
    }
  };
  const handleTwitterPress = () => {
    if (social?.twitter) {
      Linking.openURL(`https://twitter.com/${social.twitter}`);
    }
  };
  const handleFacebookPress = () => {
    if (social?.facebook) {
      Linking.openURL(`https://www.facebook.com/${social.facebook}`);
    }
  };

  const iconSize = width * 0.1;

  return (
    <>
      <Heading>Soziale Medien</Heading>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleFacebookPress}>
          <FontAwesomeIcon icon={faFacebook} size={iconSize} color="#3b5998" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleInstagramPress}>
          <FontAwesomeIcon icon={faInstagram} size={iconSize} color="#e4405f" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleTwitterPress}>
          <FontAwesomeIcon icon={faTwitter} size={iconSize} color="#1da1f2" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLinkedInPress}>
          <FontAwesomeIcon icon={faLinkedin} size={iconSize} color="#0077b5" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: width * 0.02,
  },
});

export default SocialMedia;
