import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
  Text,
  Pressable,
  TextInput,
  Alert,
  Button,
  ActivityIndicator,
} from 'react-native';
import {Colors} from '../../constants/styles';
import Paragraph from '../typography/Paragraph';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import axios from 'axios';
import {
  faCheck,
  faChevronRight,
  faLock,
  faRightFromBracket,
  faUserPlus,
  faXmark,
  faEdit,
  faClose,
  faStar,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {faApple, faGoogle} from '@fortawesome/free-brands-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Toast} from 'react-native-toast-notifications';
import {getProfile, updateProfile} from '../../api/profile';
import {useGlobalLoader} from '../loader/GlobalLoaderProvider';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';
import {API_BASE_URL_AUTH} from '../../api/config';
import {registerFcmToken} from '../../components/push_notification/config';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AccountComp = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState({});
  const {showLoader, hideLoader} = useGlobalLoader();
  const [editedUserData, setEditedUserData] = useState({});
  const [jwttoken, setJwttoken] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
    checkLoginStatus();

    GoogleSignin.configure({
      webClientId:
        '788775129611-3c3oue8fsb71krc5ksv9595tbifqlptg.apps.googleusercontent.com', // From Google Developer Console
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
      checkLoginStatus();
    }, []),
  );

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!userToken);
    } catch (error) {}
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setJwttoken(token);
      const userDataJson = await getProfile(token);
      setUserData(userDataJson.data.data);
    } catch (error) {}
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
    setEditedUserData(userData);
  };

  const handleToChangePassword = () => {
    navigation.navigate('ChangePassword', {
      email: userData?.email,
      token: jwttoken,
    });
  };

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };
  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');
      setUserData(null);
      setIsLoggedIn(false);
      setShowLogoutModal(false);
      Toast.show('Abgemeldet', {
        type: 'success',
        duration: 2000,
        backgroundColor: 'green',
        textColor: 'white',
        animationType: 'slide',
        placement: 'bottom',
      });
      navigation.navigate('Login');
    } catch (e) {}
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const saveProfileChanges = async () => {
    try {
      showLoader();
      const body = {
        firstName: editedUserData?.firstName,
        lastName: editedUserData?.lastName,
        email: editedUserData?.email,
      };

      const response = await updateProfile(body, jwttoken);

      Toast.show(response.data.message, {
        type: 'success',
        duration: 2000,
        backgroundColor: 'green',
        textColor: 'white',
        animationType: 'slide',
        placement: 'bottom',
      });
    } catch (error) {
      Toast.show(error.response.data.message, {
        type: 'danger',
        duration: 2000,
        backgroundColor: 'red',
        textColor: 'white',
        animationType: 'slide',
        placement: 'bottom',
      });
    } finally {
      fetchUserData();
      setShowEditModal(false);
      hideLoader();
    }
  };

  const handleAppleSignIn = async () => {
    try {
      // Start the Apple Sign-In process
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      // Extract user data from Apple's response
      const {user: appleUser, email, fullName} = appleAuthRequestResponse;

      // Check if the sign-in data is incomplete
      if (!email || !fullName) {
        Alert.alert(
          'Unvollständige Apple Sign-In Daten',
          'Es scheint, dass die Apple Sign-In Sitzung mit alten Daten zwischengespeichert wird. Bitte gehen Sie zu Ihren Einstellungen->Apple Id-> Anmelden mit Apple und entfernen Sie diese App aus der Liste, und melden Sie sich dann erneut an .',
          [{text: 'OK'}],
        );
        return;
      }

      // Proceed with sign-in logic...
      const response = await axios.post(
        `${API_BASE_URL_AUTH}/getUserByAppleId`,
        {
          appleId: appleUser,
          email: email,
          firstName: fullName?.givenName || 'Apple',
          lastName: fullName?.familyName || 'User',
        },
      );

      const user = response.data.data;

      await AsyncStorage.setItem('userData', JSON.stringify(user));
      await AsyncStorage.setItem('token', user.jwttoken);

      Toast.show(response.data.message, {
        type: 'success',
        duration: 2000,
        backgroundColor: 'green',
        textColor: 'white',
        animationType: 'slide',
        placement: 'bottom',
      });

      await registerFcmToken();
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Apple Sign-In failed:', error);
      Alert.alert('Apple Sign-In Error', 'An error occurred during sign-in.');
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {data} = await GoogleSignin.signIn();

      // Send the idToken to your backend for verification
      const response = await axios.post(
        `${API_BASE_URL_AUTH}/getUserByGoogleId`,
        {
          idToken: data.idToken,
        },
      );

      const user = response.data.data;

      // Ensure token and user data is saved before continuing
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      await AsyncStorage.setItem('token', user.jwttoken);

      // Only after storing, update the login state
      Toast.show(response.data.message, {
        type: 'success',
        duration: 2000,
        backgroundColor: 'green',
        textColor: 'white',
        animationType: 'slide',
        placement: 'bottom',
      });

      await registerFcmToken();
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      Alert.alert('Google Sign-In Error', 'An error occurred during sign-in.');
    }
  };

  const confirmDeleteAccount = async () => {
    try {
      setLoading(true); // Start loader when the delete process starts
      const response = await axios.delete(`${API_BASE_URL_AUTH}/delete`, {
        headers: {
          Authorization: `Bearer ${jwttoken}`, // Send JWT token for authorization
        },
      });

      if (response.status === 200) {
        Toast.show('Konto erfolgreich gelöscht', {
          type: 'success',
          duration: 2000,
        });
        setShowDeleteModal(false); // Close the delete modal
        await confirmLogout(); // Log out the user after account deletion
      } else {
        Toast.show('Fehler beim Löschen des Kontos', {
          type: 'danger',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(
        'Account deletion error:',
        error.response?.data || error.message,
      );
      Toast.show('Fehler beim Löschen des Kontos', {
        type: 'danger',
        duration: 3000,
      });
    } finally {
      setLoading(false); // Stop the loader once the process is complete
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainTopContainer}></View>
      <View style={styles.mainProfileContainer}>
        <Image
          source={require('../../images/welcome.png')}
          style={styles.profileImage}
          resizeMode="contain"
        />
        <ScrollView style={styles.scroll}>
          <View style={styles.contentContainer}>
            {/* Profile Info */}
            {isLoggedIn ? (
              <View style={styles.userInfoMain}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEditProfile}>
                  <FontAwesomeIcon icon={faEdit} color="white" />
                </TouchableOpacity>

                <View style={styles.userInfo}>
                  <Paragraph style={styles.text}>Name</Paragraph>
                  <Paragraph style={styles.text}>
                    {userData?.firstName} {userData?.lastName}
                  </Paragraph>
                </View>
                <View style={styles.userInfo}>
                  <Paragraph style={styles.text}>Email</Paragraph>
                  <Paragraph style={styles.text}>{userData?.email}</Paragraph>
                </View>
              </View>
            ) : (
              <></>
            )}
            {/* <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('GetHelp')}>
              <Paragraph style={styles.text}>Hilfe erhalten</Paragraph>
              <FontAwesomeIcon
                icon={faChevronRight}
                style={styles.icon}
                color={Colors.primaryPurple}
              />
            </TouchableOpacity> */}

            {isLoggedIn ? (
              <>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Favourite', {
                      token: jwttoken,
                    })
                  }
                  style={styles.card}>
                  <Paragraph style={{color: 'orange', fontWeight: 'bold'}}>
                    Bevorzugte Unternehmen
                  </Paragraph>
                  <FontAwesomeIcon
                    icon={faStar}
                    style={styles.icon}
                    color="orange"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleToChangePassword}
                  style={styles.card}>
                  <Paragraph
                    style={{color: Colors.primaryPurple, fontWeight: 'bold'}}>
                    Passwort ändern
                  </Paragraph>
                  <FontAwesomeIcon
                    icon={faLock}
                    style={styles.icon}
                    color={Colors.primaryPurple}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout} style={styles.card}>
                  <Paragraph style={{color: 'red', fontWeight: 'bold'}}>
                    Abmeldung
                  </Paragraph>
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    style={styles.icon}
                    color="red"
                  />
                </TouchableOpacity>
                {/* Account Delete Button */}
                {loading && <ActivityIndicator size="large" color="#0000ff" />}

                {/* Account Delete Button */}
                <TouchableOpacity
                  onPress={() => setShowDeleteModal(true)}
                  style={styles.card}>
                  <Paragraph style={{color: 'red', fontWeight: 'bold'}}>
                    Konto löschen
                  </Paragraph>
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={styles.icon}
                    color="red"
                  />
                </TouchableOpacity>

                {/* Account Delete Modal */}
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={showDeleteModal}
                  onRequestClose={() => setShowDeleteModal(false)}>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.text}>
                        Bist du sicher, dass du dein Konto löschen willst?
                      </Text>
                      <View style={styles.modalButtons}>
                        <Pressable
                          style={styles.modalButton}
                          onPress={() => setShowDeleteModal(false)}>
                          <FontAwesomeIcon
                            icon={faXmark}
                            style={styles.YesNoicon}
                          />
                        </Pressable>
                        <Pressable
                          style={styles.modalButton}
                          onPress={confirmDeleteAccount}>
                          <FontAwesomeIcon
                            icon={faCheck}
                            style={styles.YesNoicon}
                          />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Modal>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate('Login')}>
                  <Paragraph style={styles.text}>Anmeldung</Paragraph>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    style={styles.icon}
                    color={Colors.primaryPurple}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate('Signup')}>
                  <Paragraph style={styles.text}>Konto erstellen</Paragraph>
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    style={styles.icon}
                    color={Colors.primaryPurple}
                  />
                </TouchableOpacity>

                {/* Sign in WIth Google */}
                <TouchableOpacity
                  style={styles.card}
                  onPress={handleSignInWithGoogle}>
                  <Paragraph style={styles.text}>
                    Anmeldung mit Google
                  </Paragraph>
                  <FontAwesomeIcon
                    icon={faGoogle}
                    style={styles.icon}
                    color={Colors.primaryPurple}
                  />
                </TouchableOpacity>

                {/* Sign in WIth Apple */}

                <TouchableOpacity
                  style={styles.card}
                  onPress={handleAppleSignIn}>
                  <Paragraph style={styles.text}>Anmeldung mit Apple</Paragraph>
                  <FontAwesomeIcon
                    icon={faApple}
                    style={styles.icon}
                    color={Colors.primaryPurple}
                  />
                </TouchableOpacity>
              </>
            )}
            <View style={{marginBottom: windowHeight * 0.15}}></View>
          </View>
        </ScrollView>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.text} ta>
              Bist du sicher, dass du dich abmelden willst?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={cancelLogout}>
                <FontAwesomeIcon icon={faXmark} style={styles.YesNoicon} />
              </Pressable>
              <Pressable style={styles.modalButton} onPress={confirmLogout}>
                <FontAwesomeIcon icon={faCheck} style={styles.YesNoicon} />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showEditModal}
        onRequestClose={() => setShowEditModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.headingContainer}>
              <Paragraph style={styles.modalText}>Profil bearbeiten</Paragraph>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <FontAwesomeIcon
                  icon={faClose}
                  style={styles.closeButtonIcon}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Vorname"
              value={editedUserData.firstName}
              onChangeText={text =>
                setEditedUserData({...editedUserData, firstName: text})
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Nachname"
              value={editedUserData.lastName}
              onChangeText={text =>
                setEditedUserData({...editedUserData, lastName: text})
              }
            />
            <TextInput
              style={styles.input}
              placeholder="E-Mail"
              value={editedUserData.email}
              onChangeText={text =>
                setEditedUserData({...editedUserData, email: text})
              }
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveProfileChanges}>
              <Text style={[styles.text, {color: 'white'}]}>
                Änderungen speichern
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTopContainer: {
    backgroundColor: '#EEE',
    height: windowHeight * 0.3,
    width: '100%',
  },
  mainProfileContainer: {
    marginTop: -windowHeight * 0.035,
    backgroundColor: '#fff',
    width: '100%',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    flex: 1,
  },
  profileImage: {
    marginTop: windowHeight * -0.2,
    width: windowWidth * 0.6,
    height: windowWidth * 0.6,
    alignSelf: 'center',
    top: windowHeight * 0.01,
  },
  scroll: {
    padding: 10,
    width: '100%',
  },
  contentContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#EEE',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    elevation: 3,
  },
  editButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: Colors.primaryPurple,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfoMain: {
    width: '100%',
    backgroundColor: '#EEE',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  icon: {
    marginLeft: 10,
  },
  YesNoicon: {
    color: 'white',
  },
  text: {
    fontWeight: 'bold',
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: windowWidth * 0.8,
    elevation: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  modalButton: {
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 5,
    backgroundColor: Colors.primaryPurple,
  },
  closeButtonIcon: {
    backgroundColor: 'red',
    color: 'white',
    padding: 10,
    borderRadius: 100,
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primaryPurple,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginBottom: 10,
    width: '100%',
  },
  saveButton: {
    backgroundColor: Colors.primaryPurple,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default AccountComp;
