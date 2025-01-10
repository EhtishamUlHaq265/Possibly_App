import React, {useEffect, useRef} from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as Animatable from 'react-native-animatable';
import {
  faCompass,
  faBookOpen,
  faUser,
  faMap,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Colors} from '../constants/styles';
import Home from '../screens/Home';
import Map from '../screens/Map';
import Learn from '../screens/Learn';
import Account from '../screens/Account';
import {NavigationContainer} from '@react-navigation/native';
import {KeyboardAvoidingView, Platform} from 'react-native';
import Appointment from '../screens/Appointment';

const TabArr = [
  {
    route: 'Home',
    label: 'Home',
    icon: faCompass,
    type: FontAwesomeIcon,
    component: Home,
  },
  {
    route: 'Map',
    label: 'Karte',
    icon: faMap,
    type: FontAwesomeIcon,
    component: Map,
  },
  {
    route: 'Termine',
    label: 'Termine',
    icon: faCalendar,
    type: FontAwesomeIcon,
    component: Appointment,
  },
  {
    route: 'Learn',
    label: 'Berufsgruppen',
    icon: faBookOpen,
    type: FontAwesomeIcon,
    component: Learn,
  },
  {
    route: 'Account',
    label: 'Konto',
    icon: faUser,
    type: FontAwesomeIcon,
    component: Account,
  },
];

const Tab = createBottomTabNavigator();

const animate1 = {
  0: {scale: 0.5, translateY: 7},
  0.92: {translateY: -34},
  1: {scale: 1.2, translateY: -24},
};
const animate2 = {
  0: {scale: 1.2, translateY: -24},
  1: {scale: 1, translateY: 7},
};

const circle1 = {
  0: {scale: 0},
  0.3: {scale: 0.9},
  0.5: {scale: 0.2},
  0.8: {scale: 0.7},
  1: {scale: 1},
};
const circle2 = {0: {scale: 1}, 1: {scale: 0}};

const TabButton = props => {
  const {item, onPress, accessibilityState} = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate(animate1);
      circleRef.current.animate(circle1);
      textRef.current.transitionTo({scale: 1});
    } else {
      viewRef.current.animate(animate2);
      circleRef.current.animate(circle2);
      textRef.current.transitionTo({scale: 0});
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}>
      <Animatable.View ref={viewRef} duration={800} style={styles.container}>
        <View style={styles.btn}>
          <Animatable.View ref={circleRef} style={styles.circle} />
          <item.type
            icon={item.icon}
            color={focused ? 'white' : Colors.primaryPurple}
            size={16}
          />
        </View>
        <Animatable.Text ref={textRef} style={styles.text}>
          {item.label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  );
};

export default function AnimTab1() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarStyle: styles.tabBar,
          }}>
          {TabArr.map((item, index) => (
            <Tab.Screen
              key={index}
              name={item.route}
              component={item.component}
              options={{
                tabBarShowLabel: false,
                tabBarButton: props => <TabButton {...props} item={item} />,
                headerShown: item.route === 'Termine',
                headerTitleAlign: 'center',
                headerTintColor: 'white',
                headerStyle: {
                  backgroundColor: Colors.primaryPurple,
                },
              }}
            />
          ))}
        </Tab.Navigator>
      </NavigationContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    height: 70,
    position: 'absolute',
    bottom: 16,
    right: 16,
    left: 16,
    borderRadius: 16,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: 'white',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryPurple,
    borderRadius: 25,
  },
  text: {
    fontSize: 10,
    textAlign: 'center',
    color: Colors.primaryPurple,
  },
});
