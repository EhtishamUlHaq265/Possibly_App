import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  Button,
  Text,
  Share,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faLocationDot,
  faChevronCircleRight,
  faPlay,
  faPause,
  faShareAlt,
} from '@fortawesome/free-solid-svg-icons';
import {useRoute} from '@react-navigation/native';
import Heading from '../../../typography/Heading';
import Paragraph from '../../../typography/Paragraph';
import {Colors} from '../../../../constants/styles';
import {getCompanyDetailsId} from '../../../../api/company';
import {useGlobalLoader} from '../../../loader/GlobalLoaderProvider';
import {getPostedJob} from '../../../../api/company/jobs';
import SocialMedia from '../../../socialMedia/SocialMedia';
import Video from 'react-native-video';

const CompanyDetails = ({navigation}) => {
  const {showLoader, hideLoader} = useGlobalLoader();
  const [companyId, setCompanyId] = useState(null);
  const route = useRoute();
  const data = route.params?.company || {};
  const [jobs, setJobs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isPaused, setIsPaused] = useState(false);
  const [isIconVisible, setIsIconVisible] = useState(true);

  const handleIconVisibility = () => {
    setIsIconVisible(true);
  };

  const togglePlayback = () => {
    setIsPaused(!isPaused);
    setIsIconVisible(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: data.companyName || 'Company Name',
    });
  }, [navigation, data.companyName]);

  const [pin, setPin] = useState({
    latitude: 33.732104,
    longitude: 72.813095,
  });

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        showLoader();
        const token = await AsyncStorage.getItem('token');
        const id = data._id;

        const response = await getCompanyDetailsId(id, token);
        setCompanyId(response.data.data.companyAdminId);
        await AsyncStorage.setItem(
          'companyId',
          response.data.data.companyAdminId,
        );
      } catch (error) {
      } finally {
        hideLoader();
      }
    };

    fetchCompanyDetails();
  }, [data._id]);
  const getJobs = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token && companyId !== null) {
        setIsLoggedIn(true);
        const response = await getPostedJob(companyId, token);
        setJobs(response.data.data);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      // console.error('An error occurred', error);
    }
  };

  useEffect(() => {
    getJobs();
  }, [companyId]);

  const navigateToJobDetails = job => {
    navigation.navigate('JobDetails', {job, company: data});
  };
  const latitude = parseFloat(data.address.latitude);
  const longitude = parseFloat(data.address.longitude);
  const [videoUrl, setVideoUrl] = useState(data?.video);

  if (!isLoggedIn) {
    return (
      <View style={styles.messageBox}>
        <Text style={styles.loginMessage}>
          Bitte melden Sie sich an, um die Stellenprofile zu sehen.
        </Text>
      </View>
    );
  }
  const shareJobDetails = async (data, jobs = []) => {
    try {
      const jobList =
        jobs.length > 0
          ? jobs.map(job => `${job.occupationName}`).join('\n')
          : 'No jobs available.';
      const jobUrl = data.url || 'URL not available'; // Ensure the URL is included in the data
      const message = `
        Check out all the jobs at ${data.companyName}!
        Location: ${data.address.states}
        Install the IntsaZubi app from the App Store or Play Store to stay updated:
        - App Store: https://apps.apple.com/app/idYOUR_APP_ID
        - Play Store: https://play.google.com/store/apps/details?id=YOUR_APP_ID
      `;

      const result = await Share.share({message});

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // for cover photo

  // const renderImage = item => {
  //   if (item.title.image === 'company_image_url.jpg') {
  //     return (
  //       <Image
  //         source={{uri: 'https://placehold.co/500x400.png'}}
  //         style={styles.image}
  //       />
  //     );
  //   } else {
  //     return <Image source={{uri: item.title.image}} style={styles.image} />;
  //   }
  // };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
      <View style={styles.container}>
        <Image
          style={styles.companyImage}
          source={
            data.image !== null
              ? {uri: data.coverImage}
              : {uri: 'https://placehold.co/500x400.png'}
          }
        />
        <View style={styles.companyInfo}>
          <Image
            style={styles.companySmallImage}
            source={
              data.image !== 'company_image_url.jpg'
                ? {uri: data.image}
                : {uri: 'https://placehold.co/500x400.png'}
            }
          />
          <View style={styles.headerContainer}>
            <Heading
              style={styles.companyName}
              numberOfLines={1}
              ellipsizeMode="tail">
              {data.companyName}
            </Heading>
            {/* <View style={styles.shareButtonContainer}>
              <TouchableOpacity
                onPress={() => shareJobDetails(data, jobs)}
                style={styles.shareButton}>
                <FontAwesomeIcon
                  icon={faShareAlt}
                  size={24}
                  style={{color: Colors.primaryPurple}}
                />
              </TouchableOpacity>
            </View> */}
          </View>
          <View style={styles.location}>
            <FontAwesomeIcon icon={faLocationDot} size={15} color="red" />
            <Paragraph style={{marginLeft: 4, color: '#333'}}>
              {data.address.states}
            </Paragraph>
          </View>

          <Paragraph style={styles.companyDescription}>
            {data.description}
          </Paragraph>

          <View style={styles.videoContainer}>
            <Video
              source={{uri: videoUrl}}
              style={[styles.video]} // Ensure the width matches the screen width
              controls={true}
              resizeMode="cover" // Cover the video to fill the screen width while maintaining aspect ratio
              repeat={true} // Loop the video continuously
              paused={isPaused} // Control play/pause state with a prop
              onEnd={handleIconVisibility} // Handle visibility logic when the video ends
              onProgress={handleIconVisibility} // Handle visibility logic during video progress
            />
          </View>
          <View style={styles.ourOffersMainContainer}>
            <View>
              <View style={styles.jobProfileContainer}>
                <Heading style={styles.headingJobProfile}>
                  Unsere Job-Profile🕕
                </Heading>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {jobs.map((job, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.jobItem}
                      onPress={() => navigateToJobDetails(job)}>
                      <View style={styles.jobContainer}>
                        <Paragraph style={styles.jobText}>
                          {job.occupationName}
                        </Paragraph>
                        <FontAwesomeIcon
                          icon={faChevronCircleRight}
                          size={20}
                          color="white"
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View>
                <Heading style={styles.headingJobProfile}>Standort 📍</Heading>
              </View>
              <View style={styles.mapContainer}>
                <MapView
                  provider={MapView.PROVIDER_GOOGLE}
                  style={styles.map}
                  region={{
                    latitude,
                    longitude,
                    latitudeDelta: 1.115,
                    longitudeDelta: 1.1121,
                  }}>
                  <Marker
                    key={data._id}
                    coordinate={{
                      latitude,
                      longitude,
                    }}
                    title={data.companyName}
                  />
                </MapView>
              </View>
              <View>
                <SocialMedia social={data} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 100,
    backgroundColor: Colors.secondaryPurple,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companyName: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    flexShrink: 1,
    marginRight: 10,
  },
  shareButtonContainer: {
    flexShrink: 0,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 5,
  },

  iconContainer: {
    position: 'absolute',
    top: '50%', // Position icon in the vertical center of the video
    left: '50%', // Position icon in the horizontal center of the video
    transform: [{translateX: -20}, {translateY: -20}], // Center the icon by translating it half of its size
    backgroundColor: 'transparent',
  },
  iconBlur: {
    filter: 'blur(2px)',
    backgroundColor: 'transparent',
  },
  videoContainer: {
    width: '100%',
  },
  video: {
    height: 220, // Adjust this height based on your design requirements
    backgroundColor: '#000', // Ensures the video container has a background
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  companyImage: {
    width: '100%',
    height: Platform.OS === 'ios' ? 200 : 300,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  companySmallImage: {
    top: -30,
    borderRadius: 12,
    width: 100,
    height: 100,
  },
  location: {
    flexDirection: 'row',
  },
  companyInfo: {
    backgroundColor: Colors.secondaryPurple,
    paddingHorizontal: '6%',
    marginTop: -40,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    width: '100%',
    paddingBottom: 20,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  companyDescription: {
    marginVertical: 4,
    fontSize: 16,
    color: '#333',
  },
  ourOffersMainContainer: {
    paddingVertical: 4,
  },
  mapContainer: {
    marginVertical: 10,
  },
  map: {
    height: 200,
  },
  jobItem: {
    marginRight: 10,
    padding: 10,
    alignItems: 'center',
    backgroundColor: Colors.primaryPurple,
    borderRadius: 4,
  },
  jobContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headingJobProfile: {
    marginBottom: 4,
    color: 'black',
  },
  jobText: {
    fontSize: 14,
    color: 'white',
    marginHorizontal: 10,
  },
  jobProfileContainer: {
    paddingVertical: 10,
    marginVertical: 10,
  },
  loginMessage: {
    textAlign: 'center',
    color: '#333', // Dark text for readability
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageBox: {
    padding: 60,
    paddingTop: 90,
    backgroundColor: 'white', // Consider using a light color or transparent if using LinearGradient
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    alignItems: 'center',
  },
});

export default CompanyDetails;
