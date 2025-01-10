import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import {Colors} from '../../../../constants/styles';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronCircleRight} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {getOccupationCount} from '../../../../api/count';

const windowWidth = Dimensions.get('window').width;

const AllCategoryComp = ({route}) => {
  const navigation = useNavigation();
  const {professionalData} = route.params;
  const [occupationCounts, setOccupationCounts] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchOccupationCount = async () => {
      try {
        const response = await getOccupationCount();
        setOccupationCounts(response.data.data);
      } catch (error) {}
    };
    fetchOccupationCount();
  }, []);

  const navigateToCompanyDetails = company => {
    navigation.navigate('SpecificTitleCompanies', {company});
  };

  const filteredData = professionalData.filter(item =>
    item.title.text.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Kategorien suchen..."
        placeholderTextColor="black"
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />

      {filteredData.length === 0 ? (
        <Text style={styles.noCompanyFoundText}>
          Keine Unternehmen gefunden
        </Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {filteredData.map((item, index) => {
            const countData = occupationCounts.find(
              data => data.occupationName === item.title.text,
            );
            const count = countData ? countData.count : 0;
            return (
              <TouchableOpacity
                key={index}
                style={styles.companyContainer}
                onPress={() => navigateToCompanyDetails(item)}>
                <View style={styles.textContainer}>
                  <View style={styles.imageComp}>
                    <Image
                      resizeMode="cover"
                      style={styles.cardImage}
                      source={
                        item.title.image !== 'company_image_url.jpg'
                          ? {uri: item.title.image}
                          : {uri: 'https://placehold.co/500x400.png'}
                      }
                    />
                  </View>
                  <View style={styles.textComp}>
                    <Text style={styles.companyName}>{item.title.text}</Text>
                    <Text style={styles.compSubtitle}>{count} Companies</Text>
                  </View>
                </View>
                <FontAwesomeIcon
                  icon={faChevronCircleRight}
                  size={Math.max(24, Math.min(windowWidth * 0.08, 32))}
                  color="#f5f5f5"
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    paddingBottom: 150,
  },
  companyContainer: {
    backgroundColor: Colors.primaryPurple,
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInput: {
    height: 50,
    width: '100%',
    alignSelf: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: 'black',
  },
  noCompanyFoundText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
    marginTop: 20,
  },
  scrollContainer: {
    paddingBottom: 130,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imageComp: {
    width: windowWidth * 0.12,
    height: windowWidth * 0.12,
    borderRadius: windowWidth * 0.06,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: windowWidth * 0.06,
  },
  textComp: {
    flex: 1,
    paddingRight: 8,
  },
  companyName: {
    fontSize: Math.max(16, Math.min(windowWidth * 0.04, 22)),
    fontWeight: 'bold',
    color: 'white',
    flexShrink: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingLeft: 10,
  },
  compSubtitle: {
    fontSize: Math.max(14, Math.min(windowWidth * 0.03, 18)),
    color: 'white',
    paddingLeft: 10,
  },
});

export default AllCategoryComp;
