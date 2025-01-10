// import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform} from 'react-native';

export const requestLocationPermission = async () => {
  // if (Platform.OS === 'ios') {
  //   Geolocation.requestAuthorization('whenInUse');
  // } else {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: 'Location Access Permission',
  //         message: 'This app needs access to your location.',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //     } else {
  //
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // }
};
