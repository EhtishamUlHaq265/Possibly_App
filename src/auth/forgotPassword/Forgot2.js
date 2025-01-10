import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  LinearGradient,
} from 'react-native';
import {Colors} from '../../constants/styles';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {useNavigation} from '@react-navigation/native';
import {Toast} from 'react-native-toast-notifications';
import {verifyOtp} from '../../api/auth';

const CELL_COUNT = 6;

const Forgot2 = ({route}) => {
  const navigation = useNavigation();
  const {email} = route.params;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleConfirm = async () => {
    if (value.length === CELL_COUNT) {
      try {
        const response = await verifyOtp(email.toLowerCase(), value);

        if (response.data.success) {
          Toast.show('OTP erfolgreich überprüft.', {
            type: 'success',
            duration: 4000,
            backgroundColor: 'green',
            textColor: 'white',
          });
          navigation.navigate('Forgot3', {email, otp: value});
        } else {
          Toast.show(response.data.message || 'Ungültiges OTP.', {
            type: 'danger',
            duration: 4000,
            backgroundColor: 'red',
            textColor: 'white',
          });
        }
      } catch (error) {
        Toast.show(
          error.response?.data?.message || 'Fehler bei der OTP-Überprüfung.',
          {
            type: 'danger',
            duration: 4000,
            backgroundColor: 'red',
            textColor: 'white',
          },
        );
      }
    } else {
      Toast.show('Bitte gib das vollständige OTP ein.', {
        type: 'warning',
        duration: 3000,
        backgroundColor: 'orange',
        textColor: 'white',
      });
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
        <Text style={styles.title}>OTP Überprüfen</Text>
        <Text style={styles.subtitle}>
          Geben Sie das per E-Mail gesendete OTP ein.
        </Text>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Bestätigen</Text>
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
    marginBottom: 20,
  },
  formContainer: {
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
    width: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  codeFieldRoot: {
    marginBottom: 20,
  },
  cell: {
    width: 40,
    height: 50,
    lineHeight: 48,
    fontSize: 20,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    textAlign: 'center',
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
  },
  focusCell: {
    borderColor: '#6A11CB',
    backgroundColor: '#E3E3FF',
  },
  button: {
    backgroundColor: '#6A11CB',
    paddingVertical: 15,
    width: '100%',
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

export default Forgot2;
