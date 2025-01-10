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
import {Colors} from '../../constants/styles';

const {width} = Dimensions.get('window');
const itemWidth = width / 2.1;

const FederalStatesList = ({professionalData}) => {
  const navigation = useNavigation();

  const navigateToCompanyDetails = company => {
    navigation.navigate('SpecificStateCompanies', {company});
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => navigateToCompanyDetails(item)}>
      <View style={styles.itemContainer}>
        <View style={styles.overlay} />
        <View style={styles.textContainer}>
          <Paragraph style={styles.text}>{item}</Paragraph>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={professionalData}
          keyExtractor={index => index}
          horizontal
          renderItem={renderItem}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
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
    width: itemWidth * 0.8,
    height: 50,
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
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: Colors.primaryPurple,
  },
});

export default FederalStatesList;
