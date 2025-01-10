import React, {useEffect} from 'react';
import BottomTab from './src/navigation/BottomTab';
import {ToastProvider} from 'react-native-toast-notifications';
import {GlobalLoaderProvider} from './src/components/loader/GlobalLoaderProvider';
import {
  requestUserPermission,
  getFcmToken,
  registerListenerWithFCM,
} from './src/components/push_notification/pushnotification_helper';

const App: React.FC = () => {
  useEffect(() => {
    const initializeFCM = async () => {
      const permissionGranted = await requestUserPermission();
      if (permissionGranted) {
        await getFcmToken();
      }
    };

    initializeFCM();
  }, []);

  useEffect(() => {
    const unsubscribe = registerListenerWithFCM();
    return unsubscribe; // Unsubscribe from the listener on component unmount
  }, []);

  return (
    <ToastProvider>
      <GlobalLoaderProvider>
        <BottomTab />
      </GlobalLoaderProvider>
    </ToastProvider>
  );
};

export default App;
