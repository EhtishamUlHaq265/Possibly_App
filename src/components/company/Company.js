import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  requireNativeComponent,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faLocationDot,
  faCalendarAlt,
  faClock,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import {Colors} from '../../constants/styles';
import Paragraph from '../typography/Paragraph';
import Heading from '../typography/Heading';
import {useRoute} from '@react-navigation/native';

const Company = ({navigation}) => {
  const route = useRoute();
  const data = route.params?.data || {};
  const stateData = route.params?.stateData || {};

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: data.companyName || 'Company Name',
    });
  }, [navigation, data.companyName]);

  const [pin, setPin] = useState({
    latitude: 33.732104,
    longitude: 72.813095,
  });
  const AIRGoogleMapOverlay = requireNativeComponent(
    'AIRGoogleMapOverlayManager',
  );
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <AIRGoogleMapOverlay />
      <View style={styles.container}>
        <Image style={styles.companyImage} source={{uri: data.image}} />
        <View style={styles.companyInfo}>
          <Image style={styles.companySmallImage} source={{uri: data.image}} />

          <View style={styles.location}>
            <FontAwesomeIcon icon={faLocationDot} size={20} color="red" />
            <Paragraph style={{marginLeft: 4}}>{data.place}</Paragraph>
          </View>

          <Heading style={styles.companyName}>{data.companyName}</Heading>
          <Paragraph style={styles.companyDescription}>
            Unternehmensbeschreibung hier... {data.description}
          </Paragraph>

          <View style={styles.ourOffersMainContainer}>
            <Heading>Our Offers</Heading>
            <View style={styles.ourOffersContainer}>
              <View style={styles.textContainer}>
                <Paragraph>
                  Smart Summer (Technology and IT holiday weeks).
                </Paragraph>
                <Heading style={styles.hand}>👋</Heading>
              </View>

              <View style={styles.dateContainer}>
                {/* Calendar Icon */}
                <TouchableOpacity
                  title="Open"
                  onPress={() => setOpenDate(true)}
                  style={styles.datePicker}>
                  <FontAwesomeIcon icon={faCalendarAlt} size={20} />
                  <Text style={styles.pickedDateText}>
                    {date.toDateString()}
                  </Text>
                </TouchableOpacity>
                <Heading style={styles.see}>#Siehe</Heading>

                {/* Date Picker */}
                <DatePicker
                  modal
                  mode="date"
                  open={openDate}
                  date={date}
                  onConfirm={selectedDate => {
                    setOpenDate(false);
                    setDate(selectedDate);
                  }}
                  onCancel={() => {
                    setOpenDate(false);
                  }}
                />
              </View>
              <View style={styles.dateContainer}>
                {/* Clock Icon */}
                <TouchableOpacity
                  title="Open"
                  onPress={() => setOpenTime(true)}
                  style={styles.datePicker}>
                  <FontAwesomeIcon icon={faClock} size={20} />
                  <Text style={styles.pickedDateText}>
                    {time.toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
                <View style={styles.arrowRightContainer}>
                  <TouchableOpacity style={styles.arrowRight}>
                    <FontAwesomeIcon icon={faArrowRight} size={20} />
                  </TouchableOpacity>
                </View>

                {/* Time Picker */}
                <DatePicker
                  modal
                  mode="time"
                  open={openTime}
                  date={time}
                  onConfirm={selectedTime => {
                    setOpenTime(false);
                    setTime(selectedTime);
                  }}
                  onCancel={() => {
                    setOpenTime(false);
                  }}
                />
              </View>
            </View>
            <View>
              <Heading>Unsere Job-Profile 🕕</Heading>
              <Paragraph>
                {data.emoji} {data.type}
              </Paragraph>
              <View>
                <Heading>Standorte 📍</Heading>
              </View>
              <View style={styles.mapContainer}>
                <MapView
                  provider={MapView.PROVIDER_GOOGLE}
                  style={styles.map}
                  region={{
                    latitude: data.lat,
                    longitude: data.long,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}>
                  {/* Existing Markers */}
                  <Marker
                    coordinate={{
                      latitude: data.lat,
                      longitude: data.long,
                    }}
                    title={data.companyName}
                    description={data.place}
                    pinColor="black">
                    <Callout>
                      <Text>Dies ist Markierung 2</Text>
                    </Callout>
                  </Marker>
                </MapView>
              </View>

              <View></View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    alignItems: 'center',
    marginBottom: 100,
  },
  companyImage: {
    width: '100%',
    height: Platform.OS === 'ios' ? 200 : 300,
  },
  hand: {
    top: -20,
  },
  companySmallImage: {
    top: -50,
    borderRadius: 12,
    width: 100,
    height: 100,
  },
  location: {
    flexDirection: 'row',
    color: '#333',
  },
  companyInfo: {
    backgroundColor: Colors.secondaryPurple,
    paddingHorizontal: '6%',
    marginTop: -40,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  companyDescription: {
    marginVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  ourOffersMainContainer: {
    paddingVertical: 100,
  },
  ourOffersContainer: {
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.lightGreen,
    width: '100%',
    padding: '4%',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePicker: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  pickedDateText: {
    marginLeft: 10,
    color: 'black',
  },
  see: {
    backgroundColor: 'lightgreen',
    padding: 6,
    borderRadius: 8,
    alignItems: 'center',
    width: '25%',
  },
  arrowRight: {
    alignItems: 'center',
    backgroundColor: Colors.primaryPurple,
    padding: 14,
    borderRadius: 100,
  },
  mapContainer: {
    marginVertical: 10,
  },
  map: {
    height: 200,
  },
});

export default Company;
