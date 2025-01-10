import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {Colors} from '../../constants/styles';
import {useNavigation} from '@react-navigation/native';
import {sendOtp} from '../../api/auth';
import {Toast} from 'react-native-toast-notifications';
import {useGlobalLoader} from '../../components/loader/GlobalLoaderProvider';

const Forgot1 = () => {
  const navigation = useNavigation();
  const {showLoader, hideLoader} = useGlobalLoader();
  const [email, setEmail] = useState('');

  const handleSendOtp = async () => {
    try {
      showLoader();
      if (!email) {
        Toast.show('Bitte gib deine E-Mail-Adresse ein.', {type: 'danger'});
        hideLoader();
        return;
      }
      const response = await sendOtp(email);
      if (response.data.success) {
        Toast.show(response.data.message + ' Schau mal in deine E-Mails.', {
          type: 'success',
          duration: 6000,
          backgroundColor: 'green',
          textColor: 'white',
        });
        navigation.navigate('Forgot2', {email});
      }
    } catch (error) {
      Toast.show(
        error.response?.data?.message || 'Fehler beim Senden der OTP.',
        {
          type: 'danger',
          duration: 4000,
          backgroundColor: 'red',
          textColor: 'white',
        },
      );
    } finally {
      hideLoader();
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../images/confirmationImg.png')}
        style={styles.responsiveImage}
        resizeMode="contain"
      />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Schick den Bestätigungscode.</Text>
        <Text style={styles.subtitle}>Gib deine E-Mail-Adresse ein.</Text>
        <TextInput
          style={styles.input}
          placeholder="Deine E-Mail"
          placeholderTextColor={'#666'}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>Senden</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  responsiveImage: {
    width: '70%',
    height: '20%',
    marginBottom: 30,
  },
  formContainer: {
    width: '90%',
    padding: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#6A11CB',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    marginBottom: 20,
    color: '#000',
  },
  button: {
    backgroundColor: '#6A11CB',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 30,
    shadowColor: '#6A11CB',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Forgot1;
