import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors} from '../../constants/styles';

const TabBar = ({activeTab, setActiveTab}) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        onPress={() => setActiveTab('Upcoming')}
        style={[
          styles.tabButton,
          activeTab === 'Upcoming' && styles.activeTabButton,
        ]}>
        <Text
          style={
            activeTab === 'Upcoming' ? styles.activeTabText : styles.tabText
          }>
          Angefragt
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveTab('Accepted')}
        style={[
          styles.tabButton,
          activeTab === 'Accepted' && styles.activeTabButton,
        ]}>
        <Text
          style={
            activeTab === 'Accepted' ? styles.activeTabText : styles.tabText
          }>
          Angenommen
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveTab('Rejected')}
        style={[
          styles.tabButton,
          activeTab === 'Rejected' && styles.activeTabButton,
        ]}>
        <Text
          style={
            activeTab === 'Rejected' ? styles.activeTabText : styles.tabText
          }>
          Abgelehnt
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.tabColor,
    margin: 10,
    borderRadius: 6,
    height: 40,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: Colors.primaryPurple,
  },
  tabText: {
    color: 'black',
    fontSize: 16,
  },
  activeTabText: {
    color: 'white',
    fontSize: 16,
  },
});

export default TabBar;
