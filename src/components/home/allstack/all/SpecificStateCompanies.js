import React, {useEffect, useState} from 'react';
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
import {
  getcompaniesBySubtitle,
  getcompaniesByTitle,
} from '../../../../api/titleSubtitle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useGlobalLoader} from '../../../loader/GlobalLoaderProvider';
import {Toast} from 'react-native-toast-notifications';
import {getCompanyDetails, getCompanyDetailsId} from '../../../../api/company';

const windowWidth = Dimensions.get('window').width;

const SpecificStateCompanies = ({route}) => {
  const navigation = useNavigation();
  const {company} = route.params;
  const selectedState = company;

  const {showLoader, hideLoader} = useGlobalLoader();
  const [companiesByTitle, setCompaniesByTitle] = useState(null);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: company || 'Category Name',
    });
  }, [navigation, company]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader();
        const response = await getCompanyDetails();
        const companiesData = response.data.data;
        const companiesInSelectedState = companiesData.filter(
          company => company.address.states === selectedState,
        );

        setCompaniesByTitle(companiesInSelectedState);
        hideLoader();
      } catch (error) {
        if ((error.response.data.name = 'Unternehmen nicht gefunden')) {
          Toast.show(error.response.data.name);
        }
        hideLoader();
      }
    };

    fetchData();
  }, []);

  const navigateToCompanyDetails = company => {
    navigation.navigate('CompanyDetails', {company});
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {companiesByTitle?.map((company, index) => (
        <TouchableOpacity
          key={index}
          style={styles.companyContainer}
          onPress={() => navigateToCompanyDetails(company)}>
          <View style={styles.textContainer}>
            <View style={styles.imageComp}>
              <Image
                resizeMode="cover"
                style={styles.cardImage}
                source={
                  company.image !== 'company_image_url.jpg'
                    ? {uri: company.image}
                    : {uri: 'https://placehold.co/500x400.png'}
                }
              />
            </View>
            <View style={styles.textComp}>
              <Text
                style={styles.companyName}
                numberOfLines={1}
                ellipsizeMode="tail">
                {company.companyName}
              </Text>
              <Text style={styles.compSubtitle}>{company.address.states}</Text>
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
    flexShrink: 1, // Allow text to shrink if necessary
    flexGrow: 1, // Allow text to grow if necessary
  },
  compSubtitle: {
    fontSize: windowWidth * 0.03,
    color: 'white',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1, // Allow textContainer to take available space
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
    paddingHorizontal: 18,
    flex: 1, // Allow textComp to take available space
  },
});

export default SpecificStateCompanies;
