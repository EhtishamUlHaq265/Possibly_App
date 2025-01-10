import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {getFav} from '../../../api/favourite';
import {Toast} from 'react-native-toast-notifications';
import {getCompanyDetails} from '../../../api/company';
import {useGlobalLoader} from '../../loader/GlobalLoaderProvider';
import {Colors} from '../../../constants/styles';
import {Dimensions} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronCircleRight} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
const windowWidth = Dimensions.get('window').width;

const Favourite = ({route}) => {
  const navigation = useNavigation();
  const {token} = route.params;
  const {showLoader, hideLoader} = useGlobalLoader();
  const [companyDetails, setCompanyDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader();
        const response = await getCompanyDetails();
        const allCompanies = response.data.data;

        const favResponse = await getFav(token);

        const favData = favResponse.data.data;
        const companyIds = favData.companyId;
        const favoriteCompanies = allCompanies.filter(company =>
          companyIds.includes(company.companyAdminId._id),
        );

        setCompanyDetails(favoriteCompanies);
      } catch (error) {
        Toast.show(error.response.data.message, {
          type: 'warning',
          duration: 4000,
          textColor: 'white',
          animationType: 'slide',
          placement: 'bottom',
        });
      } finally {
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
      {companyDetails?.map((company, index) => (
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
              <Text style={styles.companyName}>{company.companyName}</Text>
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

export default Favourite;

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
  },
  compSubtitle: {
    fontSize: windowWidth * 0.03,
    color: 'white',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  },
});
