import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import TabBar from '../components/team/TabBar';
import {useNavigation} from '@react-navigation/native';

import {
  getAppliedAppointments,
  getRejectedAppointments,
  getApprovedAppointments,
} from '../api/user/appointments';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useGlobalLoader} from '../components/loader/GlobalLoaderProvider';
import {useFocusEffect} from '@react-navigation/native';

import InfoCard from '../components/card/InfoCard';
import UpcomingAppointmentCard from '../components/card/UpcomingAppointmentCard';
const Team = () => {
  const navigation = useNavigation();
  const {showLoader, hideLoader} = useGlobalLoader();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [appliedAppointments, setAppliedAppointments] = useState([]);
  const [approvedAppointment, setApprovedAppointments] = useState([]);
  const [rejectedAppointment, setRejectedAppointments] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);

  useEffect(() => {
    const initialLoginCheck = async () => {
      await checkLoginStatus(); // Initial check on mount
    };
    initialLoginCheck();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const focusLoginCheck = async () => {
        await checkLoginStatus(); // Re-check login status every time the screen is focused
      };
      focusLoginCheck();
    }, []),
  );

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllAppointments(); // Fetch appointments when user is logged in
    }
  }, [isLoggedIn]);

  const checkLoginStatus = async () => {
    try {
      showLoader();
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token); // Set login state based on token presence
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    } finally {
      hideLoader();
      setIsCheckingLogin(false);
    }
  };

  const fetchAllAppointments = () => {
    fetchAppliedAppointments();
    fetchApprovedAppointments();
    fetchRejectedAppointments();
  };

  const fetchAppliedAppointments = async () => {
    try {
      showLoader();
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const appliedAppointments = await getAppliedAppointments(token);
      setAppliedAppointments(appliedAppointments);
    } catch (error) {
      console.error('Error fetching applied appointments:', error);
    } finally {
      hideLoader();
    }
  };

  const fetchApprovedAppointments = async () => {
    try {
      showLoader();
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const approvedAppointments = await getApprovedAppointments(token);
      setApprovedAppointments(approvedAppointments);
    } catch (error) {
      console.error('Error fetching approved appointments:', error);
    } finally {
      hideLoader();
    }
  };

  const fetchRejectedAppointments = async () => {
    try {
      showLoader();
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const rejectedAppointments = await getRejectedAppointments(token);
      setRejectedAppointments(rejectedAppointments);
    } catch (error) {
      console.error('Error fetching rejected appointments:', error);
    } finally {
      hideLoader();
    }
  };

  const {width} = Dimensions.get('window');

  if (isCheckingLogin) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleLoginNavigation = () => {
    if (!isCheckingLogin && !isLoggedIn) {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      {!isLoggedIn ? (
        <View style={styles.loginPromptContainer}>
          <Text style={styles.loginPromptText}>
            Bitte melden Sie sich an, um die Stellen zu sehen, auf die Sie sich
            beworben haben.
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLoginNavigation}
            disabled={isCheckingLogin} // Disable button while checking login status
          >
            <Text style={styles.loginButtonText}>Zur Anmeldung gehen</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TabBar
            activeTab={activeTab}
            setActiveTab={tab => {
              setActiveTab(tab);
              fetchAllAppointments(); // Fetch appointments on tab change
            }}
          />
          {activeTab === 'Upcoming' && (
            <ScrollView
              contentContainerStyle={{
                justifyContent: 'center',
                paddingBottom: 150,
              }}>
              {appliedAppointments.map(item => (
                <UpcomingAppointmentCard key={item._id} item={item} />
              ))}
            </ScrollView>
          )}
          {activeTab === 'Accepted' && (
            <ScrollView
              contentContainerStyle={{
                justifyContent: 'center',
                paddingBottom: 150,
              }}>
              {approvedAppointment.map(item => (
                <InfoCard key={item._id} item={item} />
              ))}
            </ScrollView>
          )}
          {activeTab === 'Rejected' && (
            <ScrollView
              contentContainerStyle={{
                justifyContent: 'center',
                paddingBottom: 150,
              }}>
              {rejectedAppointment.map(item => (
                <InfoCard key={item._id} item={item} />
              ))}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableContainer: {
    flex: 1,
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#17487a',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#17487a',
    paddingVertical: 10,
  },
  tableCellHeader: {
    flex: 1,
    paddingHorizontal: 10,
  },
  tableCellHeaderText: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
    color: '#000',
  },
  tableCellText: {
    fontSize: 7,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  contentContainerStyle: {
    justifyContent: 'center',
    paddingBottom: 150,
  },
  loginPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPromptText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Team;
