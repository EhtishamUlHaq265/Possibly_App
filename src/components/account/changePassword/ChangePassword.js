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
import {useNavigation} from '@react-navigation/native';
import {Toast} from 'react-native-toast-notifications';
import {Colors} from '../../../constants/styles';
import {useGlobalLoader} from '../../loader/GlobalLoaderProvider';
import {changePassword} from '../../../api/account';
const ChangePassword = ({route}) => {
  const {email, token} = route.params;
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const {showLoader, hideLoader} = useGlobalLoader();

  const handleChangePassword = async () => {
    try {
      showLoader();
      if (!password) {
        Toast.show('Bitte gib dein Passwort ein.');
        return;
      }
      if (password.length < 8) {
        Toast.show('Das Passwort sollte mindestens 8 Zeichen haben.');
        return;
      }
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
      if (!passwordRegex.test(password)) {
        Toast.show(
          'Das Passwort sollte mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Ziffer und ein Sonderzeichen enthalten.',
        );
        return;
      }
      if (password !== confirmPassword) {
        Toast.show('Die Passwörter stimmen nicht überein.');
        return;
      }
      if (!oldPassword) {
        Toast.show('Bitte gib dein altes Passwort ein.');
        return;
      }

      const body = {
        email: email,
        password: password,
        cPassword: confirmPassword,
        oldPassword: oldPassword,
      };
      const response = await changePassword(body, token);

      Toast.show(response.data.message, {
        type: 'success',
        duration: 6000,
        backgroundColor: 'green',
        textColor: 'white',
        animationType: 'slide',
        placement: 'bottom',
      });
      navigation.goBack();
    } catch (error) {
      Toast.show(error.response.data.message);
    } finally {
      hideLoader();
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../images/confirmationImg.png')}
        style={styles.responsiveImage}
        resizeMode="contain"
      />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Passwort ändern</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Passwort"
            placeholderTextColor="#093967"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <TouchableWithoutFeedback onPress={toggleShowPassword}>
            <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Passwort bestätigen"
            placeholderTextColor="#093967"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
          />
          <TouchableWithoutFeedback onPress={toggleShowConfirmPassword}>
            <Text style={styles.eyeIcon}>
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Altes Passwort"
            placeholderTextColor="#093967"
            secureTextEntry={!showOldPassword}
            value={oldPassword}
            onChangeText={text => setOldPassword(text)}
          />
          <TouchableWithoutFeedback onPress={toggleShowOldPassword}>
            <Text style={styles.eyeIcon}>{showOldPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableWithoutFeedback>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={{color: '#fff'}}>Passwort ändern</Text>
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
  },
  responsiveImage: {
    width: '80%',
    height: '25%',
    marginBottom: 10,
  },
  formContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 40,
    borderColor: Colors.primaryPurple,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: Colors.primaryPurple,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  eyeIcon: {
    fontSize: 20,
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{translateY: -20}],
  },
});

export default ChangePassword;
