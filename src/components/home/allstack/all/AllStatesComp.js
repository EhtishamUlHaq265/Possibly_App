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
import {useGlobalLoader} from '../../../loader/GlobalLoaderProvider';
import {getCompanyDetails} from '../../../../api/company';

const windowWidth = Dimensions.get('window').width;

const AllStatesComp = ({route}) => {
  const {showLoader, hideLoader} = useGlobalLoader();
  const navigation = useNavigation();
  const {professionalData} = route.params;

  const [allCompanies, setAllCompanies] = useState([]);

  const navigateToCompanyDetails = company => {
    navigation.navigate('SpecificStateCompanies', {company});
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader();
        const response = await getCompanyDetails();
        const companiesData = response.data.data;

        setAllCompanies(companiesData);
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

  const [stateCounts, setStateCounts] = useState({});

  const countStates = () => {
    const counts = {};
    allCompanies.forEach(company => {
      const state = company.address.states;
      counts[state] = (counts[state] || 0) + 1;
    });
    setStateCounts(counts);
  };
  useEffect(() => {
    countStates();
  }, [allCompanies]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {professionalData.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.companyContainer}
          onPress={() => navigateToCompanyDetails(item)}>
          <View style={styles.textContainer}>
            <View style={styles.textComp}>
              <Text style={styles.companyName}>{item}</Text>
              <Text style={styles.compSubtitle}>
                {stateCounts[item] || 0} Companies
              </Text>
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

export default AllStatesComp;
