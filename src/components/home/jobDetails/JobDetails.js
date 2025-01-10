import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import {Toast} from 'react-native-toast-notifications';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCalendarAlt,
  faClock,
  faPlay,
  faPause,
} from '@fortawesome/free-solid-svg-icons';
import {Colors} from '../../../constants/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';
import {useGlobalLoader} from '../../loader/GlobalLoaderProvider';
import Heading from '../../typography/Heading';
import Paragraph from '../../typography/Paragraph';
import {getPostedJobId} from '../../../api/company/jobs';
import {useFocusEffect} from '@react-navigation/native';
import {requestAppointment} from '../../../api/company/appointment';

const windowWidth = Dimensions.get('window').width;

const JobDetails = ({route}) => {
  const navigation = useNavigation();
  const {showLoader, hideLoader} = useGlobalLoader();
  const [isPaused, setIsPaused] = useState(false);
  const [isIconVisible, setIsIconVisible] = useState(true);

  const {job, company} = route.params;
  const [userData, setUserData] = useState({});
  const [videoUrl, setVideoUrl] = useState(job?.occupationVideo);

  const handleIconVisibility = () => {
    setIsIconVisible(true);
  };

  const togglePlayback = () => {
    setIsPaused(!isPaused);
    setIsIconVisible(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      callgetPostedJobId();
    }, []),
  );

  const callgetPostedJobId = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const id = job._id;

      const response = await getPostedJobId(id, token);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        showLoader();
        const userData = await AsyncStorage.getItem('userData');

        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserData(parsedUserData);
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      } finally {
        hideLoader();
      }
    };

    getUserData();
  }, []);

  const currentDate = new Date();

  return (
    <View>
      <ScrollView bounces={false}>
        <View style={styles.container}>
          <Image
            style={styles.companyImage}
            source={
              company.image !== 'company_image_url.jpg'
                ? {uri: company.coverImage}
                : {uri: 'https://placehold.co/500x400.png'}
            }
          />
          <View style={styles.companyInfo}>
            <Image
              style={styles.companySmallImage}
              source={
                company.image !== 'company_image_url.jpg'
                  ? {uri: company.image}
                  : {uri: 'https://placehold.co/500x400.png'}
              }
            />

            <Heading style={styles.companyName}>{job.occupationName}</Heading>
            <Paragraph style={styles.companyDescription}>
              {job.occupationdescription}
            </Paragraph>

            <View style={styles.videoContainer}>
              <Video
                source={{uri: videoUrl}}
                style={[styles.video]}
                controls={true}
                resizeMode="cover"
                repeat={true}
              />
            </View>
          </View>

          {job?.occupationlocations?.map((location, locationIndex) => (
            <View key={locationIndex} style={styles.locationContainer}>
              <View style={styles.jobLocationContainer}>
                <FontAwesomeIcon
                  icon={faClock}
                  size={18}
                  color={Colors.primaryPurple}
                />
                <Heading style={styles.jobName}>{location.address}</Heading>
              </View>

              {location.testerDays
                .filter(
                  testerDay => new Date(testerDay.startdate) >= currentDate,
                )
                .map((testerDay, testerDayIndex) => {
                  const startDate = new Date(testerDay.startdate);
                  const endDate = new Date(testerDay.endDate);

                  // Format the dates to DD/MM/YYYY
                  const formattedStartDate =
                    startDate.toLocaleDateString('en-GB'); // DD/MM/YYYY format
                  const formattedEndDate = endDate.toLocaleDateString('en-GB'); // DD/MM/YYYY format

                  return (
                    <View
                      key={testerDayIndex}
                      style={styles.testerDayContainer}>
                      <View style={styles.dateAndTimeContainer}>
                        <Text style={styles.dateAndTimeText}>
                          Startdatum: {formattedStartDate}
                        </Text>
                        <Text style={styles.dateAndTimeText}>
                          Enddatum: {formattedEndDate}
                        </Text>
                      </View>
                      <View style={styles.dateAndTimeContainer}>
                        <Text style={styles.dateAndTimeText}>
                          Beginn: {testerDay.startDuration}
                        </Text>
                        <Text style={styles.dateAndTimeText}>
                          Ende: {testerDay.endDuration}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Bewerbung', {
                            location,
                            testerDay,
                            job,
                            company,
                          })
                        }
                        style={styles.button}>
                        <Text style={styles.buttonText}>Bewerbung</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  companyDescription: {
    marginVertical: 4,
    fontSize: 16,
    color: '#333',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  jobLocationContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  jobName: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    color: '#333',
  },
  companySmallImage: {
    borderRadius: 15,
    width: 100,
    height: 100,
    zIndex: 1,
    marginTop: -40,
  },
  iconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -20}, {translateY: -20}],
    backgroundColor: 'transparent',
  },
  iconBlur: {
    filter: 'blur(2px)',
    backgroundColor: 'transparent',
  },
  testerDayContainer: {
    backgroundColor: Colors.secondaryPurple,
    marginVertical: width * 0.05,
    borderRadius: 12,
    width: width * 0.85,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        borderWidth: 4,
        borderColor: Colors.secondaryPurple,
      },
      android: {
        elevation: 4,
      },
    }),

    padding: 8,
  },
  dateAndTimeText: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
  },
  dateAndTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  companyImage: {
    width: '100%',
    height: Platform.OS === 'ios' ? 200 : 300,
  },
  videoContainer: {
    width: '100%',
  },
  video: {
    height: 220, // Adjust this height based on your design requirements
    backgroundColor: '#000', // Ensures the video container has a background
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.secondaryPurple,
    paddingBottom: 100,
  },
  locationContainer: {
    backgroundColor: 'white',
    marginTop: 10,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    width: width * 0.88,
    marginBottom: 40,
  },
  button: {
    backgroundColor: Colors.primaryPurple,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 8,
    ...Platform.select({
      ios: {
        borderWidth: 4,
        borderColor: Colors.secondaryPurple,
      },
      android: {
        elevation: 4,
        shadowColor: Colors.primaryPurple,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        backgroundColor: Colors.primaryPurple,
        borderColor: Colors.primaryPurple,
        borderWidth: 1,
        borderRadius: 10,
        padding: 4,
      },
    }),
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default JobDetails;
