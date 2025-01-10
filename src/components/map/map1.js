import React, {useState} from 'react';
import MapView, {
  Callout,
  Circle,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {Colors} from '../../constants/styles';
const map1 = () => {
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;

  const [pin, setPin] = useState({
    latitude: 33.732104,
    longitude: 72.813095,
  });

  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: 33.732104,
          longitude: 72.813095,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {/* Existing Markers */}
        <Marker
          coordinate={pin}
          title="Marker 1"
          description="Dies ist Markierung 1"
          draggable={true}
          onDragStart={e => {}}
          onDragEnd={e => {
            setPin({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
          }}
        />
        <Marker
          coordinate={{
            latitude: 33.7325,
            longitude: 72.8135,
          }}
          title="Marker 2"
          description="This is marker 2"
          pinColor="black">
          <Callout>
            <Text>Dies ist Markierung 2</Text>
          </Callout>
        </Marker>
        <Marker
          coordinate={{
            latitude: 33.733,
            longitude: 72.814,
          }}
          title="Marker 3"
          description="Dies ist Markierung 3"
        />

        <Circle
          center={{
            latitude: 33.733,
            longitude: 72.814,
          }}
          radius={1000}
        />
      </MapView>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Image
          source={require('../../images/searchLogo.png')}
          style={styles.image}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Suche nach einem Job, einem Ort oder einem Unternehmen..."
          value={searchText}
          onChangeText={text => setSearchText(text)}
        />
        <FontAwesomeIcon
          icon={faSearch}
          size={20}
          color="black"
          style={styles.searchIcon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 900,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'gray',
    height: '500',
    backgroundColor: 'white',
    top: 60,
    height: 50,
    width: '90%',
    color: 'black',
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderRadius: 100,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    fontSize: 12,
  },
  searchIcon: {
    marginLeft: 10,
  },
  image: {
    height: 40,
    width: 40,
  },
});

export default map1;
