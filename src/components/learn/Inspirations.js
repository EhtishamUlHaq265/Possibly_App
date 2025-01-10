import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getInfoHub} from '../../api/info';
import Paragraph from '../typography/Paragraph';
import {useGlobalLoader} from '../loader/GlobalLoaderProvider';

const {width} = Dimensions.get('window');
const itemWidth = width / 2;

const Inspirations = () => {
  const navigation = useNavigation();
  const [isEndReached, setIsEndReached] = useState(false);
  const {showLoader, hideLoader} = useGlobalLoader();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchInfoHub();
  }, []);

  const fetchInfoHub = async () => {
    try {
      showLoader();
      const response = await getInfoHub();
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  const handleInspirationPress = item => {
    navigation.navigate('InspirationsDetails', {inspiration: item});
  };

  const renderFooter = () => {
    if (!isEndReached) return null;
    return (
      <View style={styles.footer}>
        <Text>Sie haben das Ende erreicht!</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        bounces={false}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleInspirationPress(item)}>
            {item?.title?.title?.image ? (
              <Image
                source={{uri: item.title.title.image}}
                style={styles.image}
              />
            ) : (
              <View style={[styles.image, {backgroundColor: '#ccc'}]} />
            )}
            <View style={styles.overlay} />
            <View style={styles.textContainer}>
              <Paragraph style={styles.text}>
                {item?.title?.title?.text || 'No title available'}
              </Paragraph>
            </View>
          </TouchableOpacity>
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        onEndReached={() => setIsEndReached(true)}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 5,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 130,
    borderRadius: 10,
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
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  footer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default Inspirations;
