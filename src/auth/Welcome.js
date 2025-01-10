import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image
        source={require('./path-to-your-image.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.welcomeText}>Welcome to Possibly</Text>
      <Text style={styles.descriptionText}>
        Lorem ipsum dolor elit elit elit Volupta consectetur adipiscing elit.
        reprehenderit iusto.
      </Text>
      <TouchableOpacity style={styles.buttonPrimary}>
        <Text style={styles.buttonText}>Create an Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '80%',
    height: 300, // Set this to maintain aspect ratio
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  buttonPrimary: {
    backgroundColor: '#0000FF',
    padding: 16,
    width: '80%',
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    width: '80%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0000FF',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Welcome;
