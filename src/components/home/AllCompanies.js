import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ShowAllCompanies from './all/ShowAllCompanies';

const {width} = Dimensions.get('window');
const itemWidth = width - 20;

const data = [
  {
    id: '1',
    image: 'https://placekitten.com/800/800',
    companyName: 'Pichler & storb',
    description: 'Lorem Ipsum Dollar set Emmit',
    type: 'Crafts and production',
    place: 'Londan',
    distance: '+384 Km - Anethering',
    emoji: '🚀',
    long: 33.7325,
    lat: 72.8135,
  },
];

const AllCompanies = ({stateData}) => {
  const navigation = useNavigation();
  const handleCardPress = () => {
    navigation.navigate('Company', {data: data[0]}, {stateData: stateData[0]});
  };
  return (
    <View style={styles.container}>
      <ShowAllCompanies stateData={stateData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'flex-end',
  },
});

export default AllCompanies;
