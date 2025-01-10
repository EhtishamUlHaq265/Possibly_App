import React, {createContext, useContext} from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {EventType} from '@notifee/react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import {firebase} from '@react-native-firebase/app';
import {useNavigation} from '@react-navigation/native';

const NavigationContext = createContext();
export const useNavigationContext = () => useContext(NavigationContext);

export const NavigationProvider = ({children, navigation}) => (
  <NavigationContext.Provider value={navigation}>
    {children}
  </NavigationContext.Provider>
);

// Method to request user permission for notifications and get the FCM token
export async function requestUserPermission() {
  if (!messaging) {
    console.error('Firebase Messaging is not initialized');
    return false;
  }

  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      await getFcmToken(); // Retrieve the token after permission is granted
    }
    return enabled;
  } catch (error) {
    console.error('Error requesting permission:', error);
    return false;
  }
}

// Method to get the FCM token and save it to AsyncStorage
export async function getFcmToken() {
  await checkApplicationNotificationPermission();
  await registerAppWithFCM();

  try {
    let fcmtoken = await AsyncStorage.getItem('fcmtoken');
    console.log(
      fcmtoken
        ? `Old Token: ${fcmtoken}`
        : 'No token found, generating a new one...',
    );

    if (!fcmtoken) {
      fcmtoken = await messaging().getToken();
      if (fcmtoken) {
        await AsyncStorage.setItem('fcmtoken', fcmtoken);
      }
    }
    return fcmtoken;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

// Method to register the app with FCM
export async function registerAppWithFCM() {
  console.log(
    'registerAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages,
  );

  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging()
      .registerDeviceForRemoteMessages()
      .then(status => {})
      .catch(error => {});
  }
}

// Method to unregister the app from FCM and delete the token
export async function unRegisterAppWithFCM() {
  console.log(
    'unRegisterAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages,
  );

  if (messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging()
      .unregisterDeviceForRemoteMessages()
      .then(status => {
        console.log('unregisterDeviceForRemoteMessages status', status);
      })
      .catch(error => {
        console.log('unregisterDeviceForRemoteMessages error', error);
      });
  }
  await messaging().deleteToken();
  console.log('FCM token deleted');
}

// Method to check and request notification permissions
export const checkApplicationNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }

  request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
    .then(result => {
      console.log('POST_NOTIFICATIONS status:', result);
    })
    .catch(error => {
      console.log('POST_NOTIFICATIONS error', error);
    });
};

// Method to register listeners for FCM events
export function registerListenerWithFCM() {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('onMessage Received:', JSON.stringify(remoteMessage));
    if (
      remoteMessage?.notification?.title &&
      remoteMessage?.notification?.body
    ) {
      onDisplayNotification(
        remoteMessage.notification?.title,
        remoteMessage.notification?.body,
        remoteMessage?.data,
      );
    }
  });

  notifee.onForegroundEvent(({type, detail}) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        console.log('User pressed notification', detail.notification);
        // Handle notification press
        break;
    }
  });

  messaging().onNotificationOpenedApp(async remoteMessage => {
    console.log(
      'onNotificationOpenedApp Received:',
      JSON.stringify(remoteMessage),
    );
    // Handle notification opened app
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });

  return unsubscribe;
}

// Method to display a notification
async function onDisplayNotification(title, body, data) {
  console.log('onDisplayNotification:', JSON.stringify(data));

  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: title,
    body: body,
    data: data,
    android: {
      channelId,
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}
