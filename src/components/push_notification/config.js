import axios from 'axios';
import {API_BASE_URL_AUTH} from '../../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const sendFcmTokenToBackend = async token => {
  try {
    const userData = await AsyncStorage.getItem('userData');

    if (!userData) {
      console.error('No user ID found for sending FCM token.');
      return;
    }

    const userId = JSON.parse(userData).id;

    const response = await axios.post(`${API_BASE_URL_AUTH}/saveUserFcmToken`, {
      token,
      userId,
    });
  } catch (error) {}
};

// Wrap in an async function to use await
export const registerFcmToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('Retrieved FCM token:', token);
    if (token) {
      await sendFcmTokenToBackend(token);
    }
  } catch (error) {
    console.error('Error retrieving FCM token:', error);
  }
};
