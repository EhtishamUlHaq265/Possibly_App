import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeMain from '../components/home/HomeMain';
import ProffesionalFieldsList from '../components/home/ProffesionalFieldsList';
import Details from '../components/home/details/Details';
import All from '../components/home/all/AllProfessionalFields';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft, faHeart} from '@fortawesome/free-solid-svg-icons';
import {View, Dimensions, TouchableOpacity} from 'react-native';
import {Colors} from '../constants/styles';
import AllProfessionalFields from '../components/home/all/AllProfessionalFields';
import Company from '../components/company/Company';
import AllComp from '../components/home/allstack/all/AllComp';
import CompanyDetails from '../components/home/allstack/all/CompanyDetails';
import JobDetails from '../components/home/jobDetails/JobDetails';
import AllCategoryComp from '../components/home/allstack/all/AllCategoryComp';
import SpecificTitleCompany from '../components/home/allstack/all/SpecificTitleCompany';
import SpecificSubtitleCompanies from '../components/home/allstack/all/SpecificSubtitleCompanies';
import ShowAllSubCategoryCompanies from '../components/home/all/ShowAllSubCategoryCompanies';
import AllSubcategoryComp from '../components/home/allstack/all/AllSubcategoryComp';
import {addFav, getFav, removeFav} from '../api/favourite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {useGlobalLoader} from '../components/loader/GlobalLoaderProvider';
import {
  useRoute,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import {Toast} from 'react-native-toast-notifications';
import AllTopEmployerComp from '../components/home/allstack/all/AllTopEmployerComp';
import SpecificStateCompanies from '../components/home/allstack/all/SpecificStateCompanies';
import AllStatesComp from '../components/home/allstack/all/AllStatesComp';
import JobForm from '../components/home/jobDetails/FormScreen';
import FormScreen from '../components/home/jobDetails/FormScreen';
import Login from '../auth/Login';

const Stack = createStackNavigator();

const BackButton = ({onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        marginLeft: 10,
        padding: 5,
        borderRadius: 20,
        backgroundColor: 'white',
      }}>
      <FontAwesomeIcon
        icon={faArrowLeft}
        size={20}
        color={Colors.primaryPurple}
      />
    </View>
  </TouchableOpacity>
);

const HeartButton = ({companyId, checked, onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        marginRight: 10,
        padding: 5,
        borderRadius: 20,
        backgroundColor: 'white',
      }}>
      <FontAwesomeIcon
        icon={faHeart}
        size={20}
        color={checked ? 'red' : Colors.primaryPurple}
      />
    </View>
  </TouchableOpacity>
);
function Home() {
  const {width} = Dimensions.get('window');
  const [isHeartChecked, setHeartChecked] = useState(false);
  const [token, setToken] = useState(null);

  const {showLoader, hideLoader} = useGlobalLoader();
  const [companyId, setCompanyId] = useState(null);
  useFocusEffect(
    React.useCallback(() => {
      const fetchToken = async () => {
        try {
          const storedToken = await AsyncStorage.getItem('token');
          const companyId = await AsyncStorage.getItem('companyId');
          setCompanyId(companyId);
          if (storedToken) {
            setToken(storedToken);
          }
        } catch (error) {}
      };

      fetchToken();

      // Clean up function
      return () => {
        // Any clean-up code here
      };
    }, []),
  );

  const route = useRoute();
  const navigation = useNavigation();
  const noRenderLocation = useNavigationState(state => state);

  useEffect(() => {
    const fetchFavouriteCompanies = async () => {
      try {
        if (!token || !companyId) return;

        const favCompanies = await getFav(token);
        const allFavouriteCompanies = favCompanies.data.data.companyId;
        const id = await AsyncStorage.getItem('companyId');
        const filteredRoutes = noRenderLocation.routes[0].state.routes.filter(
          route => route.name !== 'CompanyDetails',
        );

        if (filteredRoutes.length > 0) {
          const isCompanyFavorite = allFavouriteCompanies.includes(id);
          setHeartChecked(prevState => isCompanyFavorite);
        } else {
        }
      } catch (error) {}
    };
    if (
      noRenderLocation.routes[0]?.state?.routes?.some(
        route => route.name === 'CompanyDetails',
      )
    ) {
      fetchFavouriteCompanies();
    } else {
    }
  }, [noRenderLocation, token, companyId]);

  const handleHeartPress = async () => {
    try {
      showLoader();
      const id = await AsyncStorage.getItem('companyId');
      if (!token) {
        return;
      }
      const response = await addFav(id, token);
      Toast.show(response.data.message, {
        type: 'success',
        duration: 2000,
        backgroundColor: 'green',
        textColor: 'white',
        animationType: 'slide',
        placement: 'bottom',
      });
      setHeartChecked(true);
    } catch (error) {
      if (
        error.response.data.message === 'Company already added to favorites'
      ) {
        const id = await AsyncStorage.getItem('companyId');
        const response = await removeFav(id, token);
        Toast.show(response.data.message, {
          type: 'success',
          duration: 2000,
          backgroundColor: 'green',
          textColor: 'white',
          animationType: 'slide',
          placement: 'bottom',
        });
        setHeartChecked(false);
      }
    } finally {
      hideLoader();
    }
  };

  return (
    <Stack.Navigator
      initialRouteName="HomeMain"
      screenOptions={{
        cardStyle: {backgroundColor: 'white'},
        headerStyle: {
          backgroundColor: Colors.primaryPurple,
          borderBottomWidth: 0,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontSize: width * 0.05,
        },
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="HomeMain"
        component={HomeMain}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfessionalFields"
        component={ProffesionalFieldsList}
        options={{headerShown: true, title: 'Professional Fields'}}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={({navigation}) => ({
          headerShown: true,
          title: 'Details',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="AllProfessionalFields"
        component={AllProfessionalFields}
        options={({navigation}) => ({
          headerShown: true,
          title: 'All Professional Fields',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />

      <Stack.Screen
        name="Company"
        component={Company}
        options={({navigation}) => ({
          title: 'Company Name here',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
          headerRight: () => (
            <HeartButton
              checked={isHeartChecked}
              onPress={() => setHeartChecked(!isHeartChecked)}
            />
          ),
        })}
      />
      <Stack.Screen
        name="AllComp"
        component={AllComp}
        options={({navigation}) => ({
          headerShown: true,
          title: 'All Companies',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="AllCategoriesComp"
        component={AllCategoryComp}
        options={({navigation}) => ({
          headerShown: true,
          title: 'Kategorien',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="AllSubCategoriesComp"
        component={AllSubcategoryComp}
        options={({navigation}) => ({
          headerShown: true,
          title: 'Unterkategorien',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="AllStatesComp"
        component={AllStatesComp}
        options={({navigation}) => ({
          headerShown: true,
          title: 'Bundesländer',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="AllTopeEmployerComp"
        component={AllTopEmployerComp}
        options={({navigation}) => ({
          headerShown: true,
          title: 'Top-Arbeitgeber',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="SpecificTitleCompanies"
        component={SpecificTitleCompany}
        options={({navigation}) => ({
          headerShown: true,
          title: 'spezifischer Titel',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />

      <Stack.Screen
        name="SpecificSubtitleCompanies"
        component={SpecificSubtitleCompanies}
        options={({navigation}) => ({
          headerShown: true,
          title: 'spezifischer Untertitel',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />

      <Stack.Screen
        name="SpecificStateCompanies"
        component={SpecificStateCompanies}
        options={({navigation}) => ({
          headerShown: true,
          title: 'specific Subtitle',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />

      <Stack.Screen
        name="CompanyDetails"
        component={CompanyDetails}
        options={({navigation}) => ({
          title: 'Firmenname hier',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
          headerRight: () => (
            <HeartButton checked={isHeartChecked} onPress={handleHeartPress} />
          ),
        })}
      />

      <Stack.Screen
        name="JobDetails"
        component={JobDetails}
        options={({navigation}) => ({
          headerShown: true,
          title: 'Details zum Job',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />

      <Stack.Screen
        name="Bewerbung"
        component={FormScreen}
        options={({navigation}) => ({
          headerShown: true,
          title: 'Bewerbung',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
}

export default Home;
