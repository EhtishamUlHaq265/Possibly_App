import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Video from 'react-native-video';
import {useGlobalLoader} from '../loader/GlobalLoaderProvider';
const windowWidth = Dimensions.get('window').width;
const InspirationsDetails = ({route, navigation}) => {
  const {inspiration} = route.params;
  const {showLoader, hideLoader} = useGlobalLoader();

  useEffect(() => {
    navigation.setOptions({title: inspiration.title.title.text});
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Image
            source={{uri: inspiration.title.title.image}}
            style={[styles.image, {width: windowWidth}]}
          />
          <Text style={styles.title}>Beschreibung</Text>
          <Text style={styles.description}>{inspiration.des}</Text>
          <Text style={styles.title}>Video</Text>
          {inspiration.video && (
            <Video
              source={{uri: inspiration.video}}
              style={[styles.video, {width: windowWidth}]}
              controls={true}
              resizeMode="cover"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const {height: windowHeight} = Dimensions.get('window');
const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: windowWidth * 0.35,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    marginBottom: 6,
    color: 'black',
  },
  safeArea: {
    flex: 1,
  },
  image: {
    height: windowHeight * 0.2,
    marginBottom: 5,
    marginTop: Platform.OS === 'android' ? 0 : 0,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    paddingHorizontal: 8,
    textAlign: 'justify',
    color: 'black',
  },
  video: {
    height: 250,
  },
});

export default InspirationsDetails;
