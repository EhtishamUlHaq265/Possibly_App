import React from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import Paragraph from '../../typography/Paragraph';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const itemWidth = width - 20;

const ShowAllTopEmployer = ({professionalData}) => {
  const navigation = useNavigation();
  const handleShowAll = () => {
    navigation.navigate('AllTopeEmployerComp', {professionalData});
  };

  return (
    <View style={styles.fieldsTextContainer}>
      <TouchableOpacity onPress={handleShowAll}>
        <Paragraph
          style={{alignSelf: 'flex-end', textAlign: 'right', color: 'black'}}>
          Alle anzeigen
        </Paragraph>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldsTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default ShowAllTopEmployer;
