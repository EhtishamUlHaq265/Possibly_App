import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {Colors} from '../../constants/styles';

const Accordion = ({title, content}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleAccordion = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleAccordion} style={styles.titleContainer}>
        <View style={styles.titleContent}>
          <Text style={styles.titleText}>{title}</Text>
          <FontAwesomeIcon
            icon={isCollapsed ? faChevronDown : faChevronUp}
            size={18}
            style={styles.arrowIcon}
          />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>
        <Text style={styles.contentText}>{content}</Text>
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 6,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 6,
  },
  titleContainer: {
    borderRadius: 8,
    backgroundColor: Colors.primaryPurple,
    padding: 10,
    elevation: 1,
  },
  titleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  arrowIcon: {
    fontSize: 18,
    color: 'black',
    color: 'white',
  },
  contentText: {
    backgroundColor: Colors.secondaryPurple,
    padding: 10,
    fontSize: 12,
    marginTop: 4,
    borderRadius: 8,
    elevation: 1,
    marginHorizontal: 4,
    marginVertical: 2,
    color: 'black',
  },
});

export default Accordion;
