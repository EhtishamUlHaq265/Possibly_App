import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Colors} from '../constants/styles';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import Paragraph from '../components/typography/Paragraph';
import AccountComp from '../components/account/AccountComp';
import GetHelp from '../components/account/GetHelp';
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import ForgotStack from '../auth/forgotPassword/ForgotStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChangePassword from '../components/account/changePassword/ChangePassword';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import Favourite from '../components/account/favourite/Favourite';
import Team from './Appointment';

const Stack = createStackNavigator();

const BackButton = ({onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        marginLeft: 10,
        padding: 5,
        borderRadius: 20,
        backgroundColor: 'white',
      }}>
      <FontAwesomeIcon
        icon={faArrowLeft}
        size={20}
        color={Colors.primaryPurple}
      />
    </View>
  </TouchableOpacity>
);

const Account = ({navigation, route}) => {
  const {width} = Dimensions.get('window');

  useEffect(() => {
    const getTokenFromLocalStorage = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
        } else {
        }
      } catch (error) {
        console.error(error);
      }
    };
    getTokenFromLocalStorage();
  }, []);

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === 'Login' ||
      routeName === 'Signup' ||
      routeName === 'ForgotStack'
    ) {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
    } else {
      navigation.setOptions({tabBarStyle: styles.tabBar});
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator
      initialRouteName="AccountComp"
      screenOptions={{
        cardStyle: {backgroundColor: 'white'},
        headerStyle: {
          backgroundColor: Colors.primaryPurple,
          borderBottomWidth: 0,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontSize: width * 0.05,
        },
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="AccountComp"
        component={AccountComp}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="GetHelp"
        component={GetHelp}
        options={({navigation}) => ({
          title: 'Hilfe erhalten',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      /> */}

      <Stack.Screen
        name="Favourite"
        component={Favourite}
        options={({navigation}) => ({
          title: 'Favoriten',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={({navigation}) => ({
          title: 'Passwort ändern',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotStack"
        component={ForgotStack}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Account;

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    position: 'absolute',
    bottom: 16,
    right: 16,
    left: 16,
    borderRadius: 16,
  },
});
