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

const ProffesionalFieldsList = ({professionalData}) => {
  const navigation = useNavigation();

  const navigateToCompanyDetails = company => {
    navigation.navigate('SpecificTitleCompanies', {company});
  };

  const renderImage = item => {
    if (item.title.image === 'company_image_url.jpg') {
      return (
        <Image
          source={{uri: 'https://placehold.co/500x400.png'}}
          style={styles.image}
        />
      );
    } else {
      return <Image source={{uri: item.title.image}} style={styles.image} />;
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => navigateToCompanyDetails(item)}>
      <View style={styles.itemContainer}>
        {renderImage(item)}
        <View style={styles.overlay} />
        <View style={styles.textContainer}>
          <Paragraph style={styles.text}>{item.title.text}</Paragraph>
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
    paddingVertical: 5, // Add vertical padding to container
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', // Align text to the bottom
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
    position: 'absolute', // Position absolutely to overlay on top of the image
    bottom: 0, // Stick to the bottom of the itemContainer
    left: 0, // Align to the left
    right: 0, // Align to the right
    paddingVertical: 5, // Vertical padding for the text container
    paddingHorizontal: 5, // Horizontal padding for the text container
  },
  text: {
    color: 'white', // Text color that contrasts with the dark background
    fontWeight: 'bold', // Bold font weight for the text
    textAlign: 'left', // Center text horizontally
    fontSize: 15, // Font size for the text
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // This creates the semi-transparent overlay
  },
});

export default ProffesionalFieldsList;
