import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Colors} from '../../../../constants/styles';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronCircleRight} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

const AllTopEmployerComp = ({route}) => {
  const navigation = useNavigation();
  const {professionalData} = route.params;
  

  const navigateToCompanyDetails = company => {
    navigation.navigate('CompanyDetails', {company});
  };

  const filteredProfessionalData = professionalData.filter(
    item => item.topRated === true,
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {filteredProfessionalData.map((item, index) => (
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
                  item.image !== 'company_image_url.jpg'
                    ? {uri: item.image}
                    : {uri: 'https://placehold.co/500x400.png'}
                }
              />
            </View>
            <View style={styles.textComp}>
              <Text
                style={styles.companyName}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.companyName}
              </Text>
              <Text style={styles.compSubtitle}>{item.address.states}</Text>
            </View>
          </View>
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            size={windowWidth * 0.08}
            color="#f5f5f5"
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    paddingBottom: 100,
  },
  companyContainer: {
    backgroundColor: Colors.primaryPurple,
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyName: {
    fontSize: windowWidth * 0.04,
    fontWeight: 'bold',
    color: 'white',
    flexShrink: 1, // Allows the company name to shrink if necessary
    marginRight: 10, // Adds space between the company name and the icon
  },
  compSubtitle: {
    fontSize: windowWidth * 0.03,
    color: 'white',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1, // Ensures the text container takes available space
  },
  imageComp: {
    height: windowWidth * 0.12,
    width: windowWidth * 0.12,
  },
  cardImage: {
    height: windowWidth * 0.12,
    width: windowWidth * 0.12,
    borderRadius: windowWidth * 0.1,
    backgroundColor: 'white',
  },
  textComp: {
    paddingHorizontal: 8,
    flex: 1, // Ensures the text component takes available space
  },
});

export default AllTopEmployerComp;
