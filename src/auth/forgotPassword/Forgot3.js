import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {Colors} from '../../constants/styles';
import {useNavigation} from '@react-navigation/native';
import {resetPassword} from '../../api/auth';
import {Toast} from 'react-native-toast-notifications';
import {useGlobalLoader} from '../../components/loader/GlobalLoaderProvider';

const Forgot3 = ({route}) => {
  const navigation = useNavigation();
  const {email, otp} = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {showLoader, hideLoader} = useGlobalLoader();

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleChangePassword = async () => {
    try {
      showLoader();

      if (!password) {
        Toast.show('Passwort eingeben.', {type: 'danger'});
        hideLoader();
        return;
      }

      if (password.length < 8) {
        Toast.show('Die Länge des Passworts muss 8 betragen.', {
          type: 'danger',
        });
        hideLoader();
        return;
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
      if (!passwordRegex.test(password)) {
        Toast.show(
          'Das Passwort sollte mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Ziffer und ein Sonderzeichen enthalten.',
          {type: 'danger'},
        );
        hideLoader();
        return;
      }

      if (password !== confirmPassword) {
        Toast.show('Passwörter stimmen nicht überein.', {type: 'danger'});
        hideLoader();
        return;
      }

      // Form data being sent
      const formData = {
        email: email.toLowerCase(), // Convert email to lowercase
        password,
        cPassword: confirmPassword,
        otp,
      };

      // Sending API request
      const response = await resetPassword(formData);

      if (response.data.success) {
        Toast.show(response.data.message, {
          type: 'success',
          duration: 6000,
          backgroundColor: 'green',
        });
        navigation.navigate('Login');
      } else {
        Toast.show(response.data.message, {
          type: 'danger',
          duration: 4000,
          backgroundColor: 'red',
        });
      }
    } catch (error) {
      console.error('Error during password reset:', error); // Log the entire error

      // Check if there is an error response from the server
      if (error.response) {
        console.error('Server error response:', error.response.data); // Log backend error
        Toast.show(
          error.response.data.message ||
            'Fehler beim Zurücksetzen des Passworts.',
          {
            type: 'danger',
            duration: 4000,
            backgroundColor: 'red',
          },
        );
      } else {
        Toast.show('Netzwerkfehler oder Server nicht erreichbar.', {
          type: 'danger',
          duration: 4000,
          backgroundColor: 'red',
        });
      }
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
        <Text style={styles.title}>Passwort ändern</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Passwort"
            placeholderTextColor={'black'}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableWithoutFeedback onPress={toggleShowPassword}>
            <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Passwort bestätigen"
            placeholderTextColor={'black'}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableWithoutFeedback onPress={toggleShowConfirmPassword}>
            <Text style={styles.eyeIcon}>
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Passwort ändern</Text>
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
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderColor: '#6A11CB',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
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
  eyeIcon: {
    fontSize: 20,
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{translateY: -10}],
    color: '#6A11CB',
  },
});

export default Forgot3;
