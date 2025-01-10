import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import BackgroundImage from '../images/Sprinkle.png';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faLock,
  faEye,
  faEyeSlash,
  faEnvelope,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import {Colors} from '../constants/styles';
import Heading from '../components/typography/Heading';
import Paragraph from '../components/typography/Paragraph';
import {Toast} from 'react-native-toast-notifications';
import {signUp} from '../api/auth';
import {useGlobalLoader} from '../components/loader/GlobalLoaderProvider';
import {ScrollView} from 'react-native-gesture-handler';
export default function Signup() {
  const navigation = useNavigation();
  const {showLoader, hideLoader} = useGlobalLoader();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    cPassword: '',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSignup = async () => {
    try {
      showLoader();
      if (!formData.firstName) {
        Toast.show('Vornamen eingeben.');
        return;
      }
      if (!formData.lastName) {
        Toast.show('Nachname eingeben.');
        return;
      }
      if (!formData.email) {
        Toast.show('E-Mail eingeben.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Toast.show('E-Mail ist nicht gültig.');
        return;
      }
      if (!formData.password) {
        Toast.show('Passwort eingeben.');
        return;
      }

      if (formData.password.length < 8) {
        Toast.show('Das Passwort sollte mindestens 8 Zeichen haben.');
        return;
      }
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
      if (!passwordRegex.test(formData.password)) {
        Toast.show(
          'Das Passwort sollte mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Ziffer und ein Sonderzeichen enthalten.',
        );
        return;
      }
      if (formData.password !== formData.cPassword) {
        Toast.show('Die Passwörter stimmen nicht überein.');
        return;
      }

      const response = await signUp(formData);

      if (response.data.status === 200) {
        Toast.show('Erfolgreich registriert', {
          type: 'success',
          duration: 3000,
          backgroundColor: 'green',
          textColor: 'white',
          animationType: 'slide',
        });
        navigation.navigate('Login');
      }
    } catch (error) {
      Toast.show(error.response?.data?.message || 'An error occurred');
    } finally {
      hideLoader();
    }
  };

  const logError = errorMessage => {
    console.error(errorMessage);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView style={styles.container}>
        <Animatable.Text
          style={styles.titleText}
          animation="fadeInUp"
          delay={1200}>
          Registrieren
        </Animatable.Text>
        <View style={styles.mainProfileContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={require('../images/signup.png')}
            />
          </View>
          <View style={styles.inputContainer}>
            <ScrollView>
              <View style={styles.inputView}>
                <FontAwesomeIcon
                  icon={faUser}
                  style={styles.inputIcon}
                  color={Colors.primaryPurple}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Vorname"
                  placeholderTextColor="#093967"
                  autoCapitalize="words"
                  onChangeText={text =>
                    setFormData({...formData, firstName: text})
                  }
                />
              </View>
              <View style={styles.inputView}>
                <FontAwesomeIcon
                  icon={faUser}
                  style={styles.inputIcon}
                  color={Colors.primaryPurple}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nachname"
                  placeholderTextColor="#093967"
                  autoCapitalize="words"
                  onChangeText={text =>
                    setFormData({...formData, lastName: text})
                  }
                />
              </View>
              <View style={styles.inputView}>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={styles.inputIcon}
                  color={Colors.primaryPurple}
                />
                <TextInput
                  style={styles.input}
                  placeholder="E-Mail"
                  placeholderTextColor="#093967"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={text => setFormData({...formData, email: text})}
                />
              </View>
              <View style={styles.inputView}>
                <FontAwesomeIcon
                  icon={faLock}
                  style={styles.inputIcon}
                  color={Colors.primaryPurple}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Passwort"
                  placeholderTextColor="#093967"
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  onChangeText={text =>
                    setFormData({...formData, password: text})
                  }
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={togglePasswordVisibility}>
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                    style={styles.eyeIcon}
                    color={Colors.primaryPurple}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.inputView}>
                <FontAwesomeIcon
                  icon={faLock}
                  style={styles.inputIcon}
                  color={Colors.primaryPurple}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Passwort bestätigen"
                  placeholderTextColor="#093967"
                  secureTextEntry={!confirmPasswordVisible}
                  autoCapitalize="none"
                  onChangeText={text =>
                    setFormData({...formData, cPassword: text})
                  }
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={toggleConfirmPasswordVisibility}>
                  <FontAwesomeIcon
                    icon={confirmPasswordVisible ? faEyeSlash : faEye}
                    style={styles.eyeIcon}
                    color={Colors.primaryPurple}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignup}>
                <Paragraph style={styles.signupButtonText}>
                  Registrieren
                </Paragraph>
              </TouchableOpacity>
              <View style={styles.loginContainer}>
                <Paragraph style={styles.alreadyText}>
                  Hast du schon ein Konto??
                </Paragraph>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Paragraph style={styles.loginText}>Anmeldung</Paragraph>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  mainProfileContainer: {
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    height: '65%',
    marginTop: 'auto',
    elevation: 8,
  },
  image: {
    width: 210,
    height: 220,
    position: 'absolute',
    left: 10,
    top: Platform.OS === 'ios' ? -190 : -175,
  },
  inputContainer: {
    width: '90%',
  },
  titleText: {
    position: 'absolute',
    top: Dimensions.get('screen').height * 0.07,
    alignSelf: 'center',
    color: '#093967',
    fontFamily: 'SourceSansProBold',
    fontSize: 40,
    shadowColor: '#093967',
    elevation: 8,
    // fontWeight: 'bold',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  baseTop: {
    borderBottomWidth: 35,
    borderBottomColor: '#fff',
    borderLeftWidth: 200,
    borderLeftColor: 'transparent',
    borderRightWidth: 200,
    borderRightColor: 'transparent',
    height: 0,
    width: Dimensions.get('screen').width,
    left: 0,
    top: -35,
    position: 'absolute',
  },
  signupText: {
    fontFamily: 'SourceSansProBold',
    fontSize: 24,
    marginTop: 12,
    marginBottom: 4,
    color: Colors.primaryPurple,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.primaryPurple,
    height: 40,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  inputIcon: {
    paddingHorizontal: 8,
  },
  input: {
    height: 40,
    flex: 1,
    fontFamily: 'SourceSansProRegular',
    fontSize: 16,
    color: '#093967',
    paddingLeft: 10,
  },
  eyeIcon: {
    marginRight: 4,
  },
  signupButton: {
    backgroundColor: Colors.primaryPurple,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  signupButtonText: {
    color: '#fff',
    fontFamily: 'SourceSansProBold',
    alignSelf: 'center',
    fontSize: 18,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  alreadyText: {
    alignSelf: 'center',
    fontFamily: 'SourceSansProRegular',
    fontSize: 14,
    color: 'black',
  },
  loginText: {
    alignSelf: 'center',
    fontFamily: 'SourceSansProRegular',
    fontSize: 14,
    color: Colors.primaryPurple,
    fontWeight: 'bold',
    paddingLeft: 5,
  },
});
