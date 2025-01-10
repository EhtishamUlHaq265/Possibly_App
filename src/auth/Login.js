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
  Text,
  ScrollView,
} from 'react-native';
import {useToast, Toast} from 'react-native-toast-notifications';
import BackgroundImage from '../images/Sprinkle.png';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faLock,
  faEye,
  faEyeSlash,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../constants/styles';
import Heading from '../components/typography/Heading';
import Paragraph from '../components/typography/Paragraph';
import {signIn} from '../api/auth';
import {useGlobalLoader} from '../components/loader/GlobalLoaderProvider';
import {registerFcmToken} from '../components/push_notification/config';

export default function Login() {
  const navigation = useNavigation();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signUpType, setSignUpType] = useState('withoutGoogle');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {showLoader, hideLoader} = useGlobalLoader();

  // Clear the form state when the login screen is visited
  useFocusEffect(
    React.useCallback(() => {
      setEmail('');
      setPassword('');
    }, []),
  );

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Error retrieving token from AsyncStorage:', error);
      return null;
    }
  };

  const handleLogin = async () => {
    try {
      showLoader();
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim(); // Trim any extra spaces

      if (!trimmedEmail) {
        toast.show('Bitte E-Mail eingeben');
        return;
      } else if (!isValidEmail(trimmedEmail)) {
        toast.show('Bitte gib eine gültige E-Mail-Adresse ein.');
        return;
      } else if (!trimmedPassword) {
        toast.show('Bitte Passwort eingeben.');
        return;
      }

      const response = await signIn({
        email: trimmedEmail,
        password: trimmedPassword,
        signUpType,
      });

      if (response.data.status === 200) {
        await AsyncStorage.setItem(
          'userData',
          JSON.stringify(response.data.data),
        );
        await AsyncStorage.setItem('token', response.data.data.jwttoken);
        Toast.show(response.data.message, {
          type: 'success',
          duration: 2000,
          backgroundColor: 'green',
          textColor: 'white',
          animationType: 'slide',
          placement: 'bottom',
        });

        await registerFcmToken();
        navigation.navigate('AccountComp');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'E-Mail oder Passwort ist falsch';
      if (
        errorMessage.includes('incorrect') ||
        errorMessage.includes('wrong')
      ) {
        toast.show('E-Mail oder Passwort ist falsch');
      } else {
        toast.show(errorMessage);
      }
    } finally {
      hideLoader();
    }
  };

  const isValidEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView style={styles.container}>
        <Animatable.Text
          style={styles.titleText}
          animation="fadeInUp"
          delay={1200}>
          Anmeldung
        </Animatable.Text>
        <View style={styles.mainProfileContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={require('../images/login.png')}
            />
          </View>

          <View style={styles.inputContainer}>
            <ScrollView>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.input}
                  placeholder="E-Mail"
                  placeholderTextColor="#093967"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="oneTimeCode"
                  value={email}
                  onChangeText={text => setEmail(text)}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.input}
                  placeholder="Passwort"
                  placeholderTextColor="#093967"
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  value={password}
                  textContentType="oneTimeCode"
                  onChangeText={text => setPassword(text)}
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
            </ScrollView>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotStack')}>
              <Text style={styles.forgotPassword}>Passwort vergessen?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Anmeldung</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signupContainer}>
            <Text style={styles.accountText}>Hast du schon ein Konto?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupText}>Registrierung</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  titleText: {
    position: 'absolute',
    top: Dimensions.get('screen').height * 0.1,
    alignSelf: 'center',
    color: '#093967',
    fontFamily: 'SourceSansProBold',
    fontSize: 40,
    shadowColor: '#093967',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  mainProfileContainer: {
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOpacity: 0.3, // 30% opaque
    shadowRadius: 5,
    height: '60%',
    marginTop: 'auto',
    position: 'relative',
  },
  loginText: {
    fontFamily: 'Source Sans Pro',
    fontSize: 24,
    color: Colors.primaryPurple,
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'flex-end',
  },
  image: {
    width: 200,
    height: 200,
    position: 'absolute',
    left: 5,
    top: Platform.OS === 'ios' ? -185 : -170,

    // top: -185,
  },
  inputContainer: {
    width: '90%',
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
    paddingHorizontal: 7,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    color: '#093967',
  },
  eyeIcon: {
    marginRight: 4,
  },
  // checkboxContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // rememberMe: {
  //   marginLeft: 8,
  // },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 1,
    fontFamily: 'SourceSansProBold',
    fontSize: 16,
    color: Colors.primaryPurple,
  },
  loginButton: {
    backgroundColor: Colors.primaryPurple,
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    marginTop: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontFamily: 'SourceSansProBold',
    alignSelf: 'center',
    fontSize: 18,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  accountText: {
    fontFamily: 'SourceSansProRegular',
    fontSize: 14,
    color: 'black',
  },
  InputText: {
    fontFamily: 'SourceSansProRegular',
    fontSize: 14,
  },
  signupText: {
    fontFamily: 'SourceSansProRegular',
    fontSize: 14,
    color: Colors.primaryPurple,
    fontWeight: 'bold',
    paddingLeft: 5,
  },
});

const data = {
  data: {
    idToken:
      'eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ3YjkzOTc3MWE3ODAwYzQxM2Y5MDA1MTAxMmQ5NzU5ODE5MTZkNzEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3ODg3NzUxMjk2MTEtcTBkbm92bnUybTBmNTRqMDRocGVpc29xMXFjZGtiajQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3ODg3NzUxMjk2MTEtM2Mzb3VlOGZzYjcxa3JjNWtzdjk1OTV0YmlmcWxwdGcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDQzOTk5MDI3NzcxMzEwNDk5NTYiLCJlbWFpbCI6InRhbGFoem1yOEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImgxSHZBZ2FXWmxQc3AxNDd2RGdrMnciLCJub25jZSI6ImFIUWwwanZMWjVnSjRVdmNWUjdPLVloVmVYQkluVGdoQ1I5ZzloU2djTDgiLCJuYW1lIjoidGFsYWggWmFtZWVyIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pRM0FRLWR6cTNDZzA1TGxrOXJYbklJdFNEWXZvbEZlZ1luSE5UVTdmZGJfaVZJZGs9czk2LWMiLCJnaXZlbl9uYW1lIjoidGFsYWgiLCJmYW1pbHlfbmFtZSI6IlphbWVlciIsImlhdCI6MTcyNjE2NDAwMiwiZXhwIjoxNzI2MTY3NjAyfQ.JgvCUwINAIV1b29hqUjMKT0TbZfWn_9bB_sS60YftdTp06OzA7GjhwnWvsLMub0bhe1L5YIBB_XD8NMQ1WA_eXG47NaqgkuKH4gC-tH9DiPmli6ft1Yvr-vkx-rxDJsg75vvJcHzBkFHaUsNTsNtE-iRxggXPpW2MuHcs0TZvEoPM5Br3EZS3tgb278Qc_OdkHLLiRLOzQdbNZJ5Qo5Q84DUlWnL37woRjmSxDTJK0VRGDvoKZH-NC5s3HqTTSHNHIPE95mtRn9oDDstYIitnfvwtav2vEhzZb5rlhwLuDsU048vVNCTUzl0EXzvKrvUtqwauaI2yy9hQ57xlOUUFg',
    scopes: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'openid',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    serverAuthCode:
      '4/0AQlEd8xKDHZHPFYgsFCGy6Fyp7B_hPSVw-MVH-AvB-VDwTjqtwGaFEqYnmjfK5MGHQXAxw',
    user: {
      email: 'talahzmr8@gmail.com',
      familyName: 'Zameer',
      givenName: 'talah',
      id: '104399902777131049956',
      name: 'talah Zameer',
      photo:
        'https://lh3.googleusercontent.com/a/ACg8ocJQ3AQ-dzq3Cg05Llk9rXnIItSDYvolFegYnHNTU7fdb_iVIdk=s120',
    },
  },
  type: 'success',
};

const newData = {
  data: {
    idToken:
      'eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ3YjkzOTc3MWE3ODAwYzQxM2Y5MDA1MTAxMmQ5NzU5ODE5MTZkNzEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3ODg3NzUxMjk2MTEtcTBkbm92bnUybTBmNTRqMDRocGVpc29xMXFjZGtiajQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3ODg3NzUxMjk2MTEtM2Mzb3VlOGZzYjcxa3JjNWtzdjk1OTV0YmlmcWxwdGcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDQzOTk5MDI3NzcxMzEwNDk5NTYiLCJlbWFpbCI6InRhbGFoem1yOEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlhJSG5uanVOS29PbEV5cTREdEc2d1EiLCJub25jZSI6Imh3WDJldVBvanNvbHR6eEJYVDZ3VHVHMlh0TFFIVjBxUVpFWmRUa1JUVGMiLCJuYW1lIjoidGFsYWggWmFtZWVyIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pRM0FRLWR6cTNDZzA1TGxrOXJYbklJdFNEWXZvbEZlZ1luSE5UVTdmZGJfaVZJZGs9czk2LWMiLCJnaXZlbl9uYW1lIjoidGFsYWgiLCJmYW1pbHlfbmFtZSI6IlphbWVlciIsImlhdCI6MTcyNjE2NDA1MywiZXhwIjoxNzI2MTY3NjUzfQ.R8qPgcLYiv0Mw_Uzkd9WiMTEFIOaPqbcO_AM1ZGlW80Nnwg65p9Mm0g1wfCe4vVJdLiAKbgtFscbPIteSj3y-fVBNP_3n8RMQKjhc5c4OboaJ4SnGvVpH6-pLNqfn-1ht5PC-CNVjlhHCH5rFrFJfmaXRLFF-oeMyLsPdHZKKKzfH7Endoqrzn4Yj54PshXRC3n7ruwm7onZxixPQZA_NCsjnlhmR3Gjgssa2a1y_aurgYNed8Ke-Y17YMSEvJUNO0Zd8f7XbxVCQ3EwClU0__LotfzIUHBAZjQ4X_pecW1839HsMS8S_lR6j0TzeafYWpFuYub0BFDGxJBMqEtsbg',
    scopes: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'openid',
    ],
    serverAuthCode:
      '4/0AQlEd8y711eX8O0sV9bV1l5k2h4XQXqSY5vn00crDTkH6cBL-Dksp4VZnmyofNGaoIl4lQ',
    user: {
      email: 'talahzmr8@gmail.com',
      familyName: 'Zameer',
      givenName: 'talah',
      id: '104399902777131049956',
      name: 'talah Zameer',
      photo:
        'https://lh3.googleusercontent.com/a/ACg8ocJQ3AQ-dzq3Cg05Llk9rXnIItSDYvolFegYnHNTU7fdb_iVIdk=s120',
    },
  },
  type: 'success',
};
