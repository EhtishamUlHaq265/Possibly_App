import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronCircleRight} from '@fortawesome/free-solid-svg-icons';
import Paragraph from '../typography/Paragraph';
import Heading from '../typography/Heading';
import {Colors} from '../../constants/styles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const data = [
  {
    id: '1',
    title: 'Info Hub',
    description: 'The ideal perperations to get to know companies',
  },
];

const InfoHub = () => {
  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Heading style={styles.title}>{item.title}</Heading>
        <Paragraph style={styles.description}>{item.description}</Paragraph>
      </View>
      <FontAwesomeIcon
        icon={faChevronCircleRight}
        size={windowWidth * 0.08}
        color="#f5f5f5"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: windowHeight * 0.01,
    paddingHorizontal: windowHeight * 0.01,
  },
  flatListContainer: {
    paddingHorizontal: windowWidth * 0.02,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: windowHeight * 0.02,
    backgroundColor: Colors.primaryPurple,
    borderRadius: windowWidth * 0.02,
    padding: windowWidth * 0.04,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: windowWidth * 0.04,
    marginBottom: windowHeight * 0.01,
    color: '#fff',
  },
  description: {
    fontSize: windowWidth * 0.03,
    color: '#fff',
  },
});

export default InfoHub;
