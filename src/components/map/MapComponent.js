import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, {Marker} from 'react-native-maps';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSearch, faLocationArrow} from '@fortawesome/free-solid-svg-icons';
import {Colors} from '../../constants/styles';
import {getCompanyDetails} from '../../api/company';
import {useGlobalLoader} from '../loader/GlobalLoaderProvider';
import {searchCompanyDetails} from '../../api/company/mapSearch';
import {Toast} from 'react-native-toast-notifications';
import {requestLocationPermission} from '../LocationComponent/LocationComponent';
import Slider from '@react-native-community/slider';
import Geolocation from '@react-native-community/geolocation';
import haversine from 'haversine';
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const itemHeight = screenWidth * 0.35;

const MapComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [companyDetails, setCompanyDetails] = useState([]);
  const {showLoader, hideLoader} = useGlobalLoader();
  const [showSlider, setShowSlider] = useState(false);
  const [radius, setRadius] = useState(30); // Default radius
  const [userLocation, setUserLocation] = useState(null);
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    requestLocationPermission();
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setUserLocation({latitude, longitude});
      },
      error => {},
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }, []);

  const defaultMapRegion = {
    latitude: 50.55,
    longitude: 9.68,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const [mapRegion, setMapRegion] = useState(defaultMapRegion);
  const updateMapRegionBasedOnResults = companyDetails => {
    if (!companyDetails || companyDetails.length === 0) return;

    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    companyDetails.forEach(company => {
      const latitude = parseFloat(company.address.latitude);
      const longitude = parseFloat(company.address.longitude);
      minLat = Math.min(minLat, latitude);
      maxLat = Math.max(maxLat, latitude);
      minLng = Math.min(minLng, longitude);
      maxLng = Math.max(maxLng, longitude);
    });

    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;
    const latDelta = maxLat - minLat + 0.05;
    const lngDelta = maxLng - minLng + 0.05;

    setMapRegion({
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader();

        const {data} = await getCompanyDetails();
        const companies = data.data;
        setCompanyDetails(companies);
        setFilteredCompanies(companies);
      } catch (error) {
        console.error(error);
      } finally {
        hideLoader();
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    try {
      showLoader();

      const token = await AsyncStorage.getItem('token');
      const {data} = await searchCompanyDetails(searchQuery, token);
      const allCompanies = data.data;
      setFilteredCompanies(allCompanies);
      updateMapRegionBasedOnResults(allCompanies);
      setShowSlider(false);
      if (allCompanies.length === 0) {
        Toast.show('No companies');
      }
    } catch (error) {
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  const handleSearchChange = async text => {
    setSearchQuery(text);
    setShowSlider(false);
    if (text === '') {
      setMapRegion(defaultMapRegion);
      setShowRenderCard(true);
      await handleSearch();
    }
  };

  const toggleSlider = () => {
    setShowSlider(!showSlider);
  };

  useEffect(() => {
    if (userLocation && companyDetails) {
      const filtered = filterCompaniesByRadius(userLocation, radius);
      setFilteredCompanies(filtered);
      updateMapRegionBasedOnResults(filtered); // Optionally adjust map region based on filtered results
    }
  }, [userLocation, companyDetails, radius]);

  const filterCompaniesByRadius = (userLocation, radius) => {
    return companyDetails.filter(company => {
      const companyLocation = {
        latitude: parseFloat(company.address.latitude),
        longitude: parseFloat(company.address.longitude),
      };
      const distance = haversine(userLocation, companyLocation, {unit: 'km'});
      return distance <= radius;
    });
  };

  const navigateCompanyDetails = company => {
    navigation.navigate('CompanyDetails', {company});
  };
  const renderCard = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigateCompanyDetails(item)}>
      <Image
        source={
          item.image !== 'company_image_url.jpg'
            ? {uri: item.image}
            : {uri: 'https://placehold.co/500x400.png'}
        }
        style={styles.cardImage}
      />
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.companyName}</Text>
        <Text style={styles.cardAddress}>{item.address.states}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Image
          source={require('../../images/searchLogo.png')}
          style={styles.searchImage}
        />
        <TextInput
          style={styles.searchBarInput}
          placeholder="Suche nach einem Job, einem Ort oder einem Unternehmen..."
          placeholderTextColor="#888"
          value={searchQuery}
          onFocus={() => setShowSlider(false)}
          onChangeText={handleSearchChange}
        />
        <TouchableOpacity onPress={handleSearch}>
          <FontAwesomeIcon
            icon={faSearch}
            size={20}
            color="black"
            style={styles.searchIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleSlider}>
          <FontAwesomeIcon
            icon={faLocationArrow}
            size={20}
            color="black"
            style={styles.locationIcon}
          />
        </TouchableOpacity>
      </View>
      {showSlider && (
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderText}>
            Suchradius auswählen: {radius} km
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={500}
            step={1}
            value={radius}
            onValueChange={newRadius => {
              setRadius(newRadius);
            }}
            minimumTrackTintColor="#17487a"
            thumbTintColor="#17487a"
          />
        </View>
      )}

      <MapView style={styles.map} region={mapRegion}>
        {filteredCompanies.map((company, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(company.address.latitude),
              longitude: parseFloat(company.address.longitude),
            }}
            title={company.name}
          />
        ))}
      </MapView>

      <View style={styles.headerContainer}>
        <FlatList
          data={filteredCompanies}
          horizontal
          renderItem={renderCard}
          keyExtractor={item => item._id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: screenHeight * 0.9,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: itemHeight * 0.4,
    width: screenWidth * 0.95,
    height: itemHeight * 0.5,
    backgroundColor: '#FFF',
    borderRadius: 50,
    padding: 10,
    fontSize: 16,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  searchBarInput: {
    flex: 1,
    marginHorizontal: 4,
    fontSize: 16,
    color: Colors.primaryPurple,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: screenHeight,
  },
  card: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    marginRight: 10,
    width: screenWidth * 0.6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
    color: 'black',
  },
  cardAddress: {
    color: 'black',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    marginBottom: screenHeight * 0.05,
  },
  searchIcon: {
    marginRight: 8,
  },
  locationIcon: {
    marginLeft: 10,
  },
  searchImage: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },

  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 20,
    position: 'absolute',
    top: itemHeight * 0.6,
  },
  radioButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderColor: 'black',
    borderRadius: 100,
    marginVertical: 10,
    backgroundColor: 'white',
  },
  selected: {
    backgroundColor: Colors.secondaryPurple,
    color: 'white',
    alignItems: 'center',
  },
  sliderContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 30,
    zIndex: 1,
    position: 'absolute',
    top: itemHeight * 0.95,
    width: screenWidth * 0.95,
    height: itemHeight * 0.5,
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 5},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

    justifyContent: 'center',
  },
  slider: {
    height: 40,
    width: '100%',
  },
  sliderText: {
    fontSize: 15,
    color: '#17487a',
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'center',
  },
});

export default MapComponent;
