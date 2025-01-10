import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeVideo from './HomeVideo';
import Logo from './Logo';
import ProffesionalFieldsList from './ProffesionalFieldsList';
import Heading from '../typography/Heading';
import Paragraph from '../typography/Paragraph';
import IndustryList from './IndustryList';
import PersonalAdvice from './PersonalAdvice';
import FederalStatesList from './FederalStatesList';
import TopEmployerList from './TopEmployerList';
import AllCompanies from './AllCompanies';
import {getCompanyDetails} from '../../api/company';
import {useGlobalLoader} from '../loader/GlobalLoaderProvider';
import ShowAllCategoryCompanies from './all/ShowAllCategoryCompanies';
import {
  getSubtitles,
  getcompaniesByTitle,
  titleSubtitle,
} from '../../api/titleSubtitle';
import ShowAllSubCategoryCompanies from './all/ShowAllSubCategoryCompanies';
import CompanyDetails from './allstack/all/CompanyDetails';
import ShowAllTopEmployer from './all/ShowAllTopEmployer';
import ShowAllStates from './all/ShowAllStates';

const HomeMain = () => {
  const [scrollY, setScrollY] = useState(0);
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;

  const {showLoader, hideLoader} = useGlobalLoader();
  const [companyDetails, setCompanyDetails] = useState(null);
  const [titleSubtitleData, setTitleSubtitleData] = useState(null);
  const [subtitleData, setSubtitleData] = useState([]);
  const [states, setStates] = useState([]);

  const [companiesByTitle, setCompaniesByTitle] = useState(null);

  const handleScroll = event => {
    setScrollY(event.nativeEvent.contentOffset.y);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader();

        const response = await getCompanyDetails();
        setCompanyDetails(response.data.data);

        const companies = response.data.data;
        const allStates = companies.reduce((states, company) => {
          if (company.address && company.address.states) {
            if (!states.includes(company.address.states)) {
              states.push(company.address.states);
            }
          }
          return states;
        }, []);
        setStates(allStates);
      } catch (error) {
      } finally {
        hideLoader();
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        showLoader();
        const body = {
          type: 'get',
        };
        const response = await titleSubtitle(body, token);
        setTitleSubtitleData(response.data.data);
        hideLoader();
      } catch (error) {
        hideLoader();
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader();
        const response = await getSubtitles();
        setSubtitleData(response.data.data);
        hideLoader();
      } catch (error) {
        hideLoader();
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('token');
  //       showLoader()
  //       const response = await getcompaniesByTitle(token);
  //       setCompaniesByTitle(response.data.data);
  //
  //       hideLoader();
  //     } catch (error) {
  //       console.error("errrrrrrrrrrrrrrrrrr",error);
  //       hideLoader();
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <Logo isSticky={scrollY > 0} />
      <ScrollView
        contentContainerStyle={styles.mainContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}>
        <HomeVideo />
        {/* Professional fields */}
        <View style={styles.fieldsContainer}>
          <View style={styles.fieldsTextContainer}>
            <Heading style={{flex: 1, color: 'black'}}>Berufsfelder</Heading>
            <ShowAllCategoryCompanies professionalData={titleSubtitleData} />
          </View>
          <ProffesionalFieldsList professionalData={titleSubtitleData} />
        </View>

        {/* Industry List */}
        <View style={styles.fieldsContainer}>
          <View style={styles.fieldsTextContainer}>
            <Heading style={{flex: 1, color: 'black'}}>Jobs</Heading>
            <ShowAllSubCategoryCompanies professionalData={subtitleData} />
          </View>
          <IndustryList professionalData={subtitleData} />
        </View>
        <PersonalAdvice />

        {/* Federal States */}
        <View style={styles.fieldsContainer}>
          <View style={styles.fieldsTextContainer}>
            <Heading style={{flex: 1, color: 'black'}}>Bundesländer</Heading>
            <ShowAllStates professionalData={states} />
          </View>
          <FederalStatesList professionalData={states} />
        </View>

        {/* Top Employer */}
        <View style={styles.fieldsContainer}>
          <View style={styles.fieldsTextContainer}>
            <Heading style={{flex: 1, color: 'black'}}>
              Top-Arbeitgeber 🌟
            </Heading>
            <ShowAllTopEmployer professionalData={companyDetails} />
          </View>
          <TopEmployerList topEmployerData={companyDetails} />
        </View>

        {/* All Companies */}
      </ScrollView>
    </View>
  );
};

export default HomeMain;

const styles = StyleSheet.create({
  mainContainer: {
    paddingBottom: '40%',
    flexGrow: 1,
  },
  fieldsContainer: {
    marginVertical: 12,
    marginTop: 25,
  },
  fieldsTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    // backgroundColor: 'black',
  },
});
