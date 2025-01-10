import React from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Paragraph from '../typography/Paragraph';

const {width} = Dimensions.get('window');
const itemWidth = width / 2.1;

const IndustryList = ({professionalData}) => {
  const navigation = useNavigation();

  const navigateToCompanyDetails = company => {
    navigation.navigate('SpecificSubtitleCompanies', {company});
  };

  const renderImage = item => {
    if (item.image === 'company_image_url.jpg') {
      return (
        <Image
          source={{uri: 'https://placehold.co/500x400.png'}}
          style={styles.image}
        />
      );
    } else {
      return <Image source={{uri: item.image}} style={styles.image} />;
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => navigateToCompanyDetails(item)}>
      <View style={styles.itemContainer}>
        {renderImage(item)}
        <View style={styles.overlay} />
        <View style={styles.textContainer}>
          <Paragraph style={styles.text}>{item.text}</Paragraph>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleShowAll = () => {
    navigation.navigate('AllProfessionalFields', {data});
  };

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={professionalData}
          keyExtractor={item => item._id}
          horizontal
          renderItem={renderItem}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#f5f5f5', // Set the background color for the container
    paddingVertical: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(28, 28, 28, 0.1)',
  },
  itemContainer: {
    marginHorizontal: 5,
    borderRadius: 10,
    width: itemWidth,
    height: 120,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // This creates the semi-transparent overlay
  },
});

export default IndustryList;
