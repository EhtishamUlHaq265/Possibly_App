import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Colors} from '../constants/styles';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import LearnMain from '../components/learn/LearnMain';
import InspirationsDetails from '../components/learn/InspirationsDetails';

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

const Learn = ({navigation, route}) => {
  const {width} = Dimensions.get('window');

  return (
    <Stack.Navigator
      initialRouteName="LearnMain"
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
      <Stack.Screen name="Berufsgruppen" component={LearnMain} />
      <Stack.Screen
        name="InspirationsDetails"
        component={InspirationsDetails}
        options={({navigation}) => ({
          title: 'Details as',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
};

export default Learn;

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
