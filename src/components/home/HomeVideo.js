import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Video from 'react-native-video';
import {Svg, Text as SvgText, Rect} from 'react-native-svg';
import Paragraph from '../typography/Paragraph';
import {Colors} from '../../constants/styles';
import Info from '../info/Info';
import {useNavigation} from '@react-navigation/native';

const HomeVideo = () => {
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate('Map');
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <Video
        source={require('../../images/video/video.mp4')}
        style={[styles.video, {width: deviceWidth, height: deviceHeight * 0.7}]}
        controls={false}
        resizeMode="cover"
        muted={true}
        paused={false}
        repeat={true}
      />
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Rect width="50%" height="5%" x="8%" y="46%" rx="10" fill="#093967" />
        <SvgText
          x="33%"
          y="48.5%"
          fontSize={10}
          fill="white"
          fontWeight={'bold'}
          textAnchor="middle"
          alignmentBaseline="middle">
          Deine Zukunft zum Ausprobieren!
        </SvgText>
      </Svg>

      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Rect
          width="44%"
          height="5%"
          x="8%"
          y="55%"
          rx="10"
          fill="#093967"
          onPress={handlePress}
        />
        <SvgText
          x="30%"
          y="57.5%"
          fontSize={13}
          fontWeight={'bold'}
          fill="white"
          textAnchor="middle"
          alignmentBaseline="middle">
          🚀 Karte anzeigen
        </SvgText>
      </Svg>
      {/* <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Rect width="38%" height="4%" x="8%" y="57%" rx="10" fill="#BDC8D0" />
        <SvgText
          x="28%"
          y="59%"
          fontSize={10}
          fill="black"
          textAnchor="middle"
          alignmentBaseline="middle">
          Your location is not available.
        </SvgText>
      </Svg> */}
      <View style={styles.textUnderVideo}>
        {/* <Paragraph style={styles.headingText}>
          Drücken Sie die Taste Anleitung, um die Info zu sehen.
        </Paragraph> */}
        <View>
          <Paragraph style={styles.headingText}>
            Cool, dass du InstaZubi entdeckt hast!
          </Paragraph>
          <Paragraph style={styles.paraText}>
            Wenn du dir noch unsicher bist, wie InstaZubi genau funktioniert und
            welche Funktionen es gibt, findest du unter dem Button Anleitung
            eine kurze Erklärung.
          </Paragraph>
        </View>

        <Info />
      </View>
    </View>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width,
    height: height,
  },
  textUnderVideo: {
    width: width,
    backgroundColor: Colors.primaryPurple,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.02,
    alignItems: 'left',
    flex: 1,
    justifyContent: 'center',
    borderBottomRightRadius: height * 0.02,
    borderBottomLeftRadius: height * 0.02,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  paraText: {
    color: 'white',
    fontSize: height * 0.02,
  },
  headingText: {
    color: 'white',
    fontSize: height * 0.02,
    fontWeight: 'bold',
    marginVertical: height * 0.01,
  },
  instructionsBtn: {
    backgroundColor: 'white',
    marginVertical: 16,
    padding: 10,
    borderRadius: 10,
    width: width * 0.5,
    alignSelf: 'center',

    alignItems: 'center',
  },
  instructionsBtnText: {
    fontSize: 18,
    color: Colors.primaryPurple,
  },
});

export default HomeVideo;
