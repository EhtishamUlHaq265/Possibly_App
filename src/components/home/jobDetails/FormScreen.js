import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useToast} from 'react-native-toast-notifications';
import {requestAppointment} from '../../../api/company/appointment';
import {Colors} from '../../../constants/styles';

const FormScreen = ({route}) => {
  const navigation = useNavigation();
  const {location, testerDay, job, company} = route.params;
  const [age, setAge] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [classCategory, setClassCategory] = useState('');
  const [information, setInformation] = useState('');
  const [userData, setUserData] = useState({});
  const toast = useToast();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserData(parsedUserData);
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };
    getUserData();
  }, []);

  const handleSubmit = async () => {
    try {
      if (
        information.split(' ').length < 30 ||
        information.split(' ').length > 100
      ) {
        alert('Stelle dich hier kurz vor.(30-100 Wörte).');
        return;
      }

      const token = userData.jwttoken;
      const jwtToken = await AsyncStorage.getItem('token');

      const body = {
        jobId: job._id,
        category: job.occupationName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        companyAdminId: job.companyId,
        companyUserId: job.companyUserId,
        companyName: company.companyName,
        schoolName: schoolName,
        occupationlocation: {
          longitude: location.longitude,
          latitude: location.latitude,
          testerDay: {
            address: location.address,
            startdate: testerDay.startdate,
            endDate: testerDay.endDate,
            startDuration: testerDay.startDuration,
            endDuration: testerDay.endDuration,
          },
        },
        age,
        classCategory,
        information,
      };

      if (jwtToken === null) {
        navigation.navigate('Login');
        toast.show('Bitte erst einloggen.', {
          type: 'danger',
        });
      } else if (jwtToken) {
        const response = await requestAppointment(body, token);

        if (response.data.status === 200) {
          toast.show('Termin Erfolgreich angemeldet!', {
            type: 'success',
          });
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error('Error during submission:', error);
      if (error.response && error.response.data.name === 'Already booked') {
        toast.show(
          'Sie haben sich bereits auf diese Stelle beworben, entweder an diesem oder an einem anderen Ort.',
          {
            type: 'danger',
          },
        );
      } else {
        toast.show('An unexpected error occurred.', {
          type: 'danger',
        });
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Jetzt bewerben!</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Alter"
          keyboardType="numeric"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          value={schoolName}
          onChangeText={setSchoolName}
          placeholder="Schule"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          value={classCategory}
          onChangeText={setClassCategory}
          placeholder="Klasse"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.textArea}
          value={information}
          onChangeText={setInformation}
          placeholder="Stelle dich hier kurz vor.(30-100 Wörter)"
          multiline
          numberOfLines={4}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Abschicken</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 1,
    color: '#000',
  },
  textArea: {
    height: 100,
    color: '#000',

    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 10,
    paddingTop: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 1,
  },
  button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.primaryPurple,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FormScreen;
