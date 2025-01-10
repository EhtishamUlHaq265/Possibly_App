import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Forgot1 from './Forgot1';
import Forgot2 from './Forgot2';
import Forgot3 from './Forgot3';

const Stack = createStackNavigator();
const ForgotStack = () => {
  return (
    <Stack.Navigator initialRouteName="Forgot1">
      <Stack.Screen
        name="Forgot1"
        component={Forgot1}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Forgot2"
        component={Forgot2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Forgot3"
        component={Forgot3}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
export default ForgotStack;
