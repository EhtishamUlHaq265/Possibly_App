import React, {useEffect} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Paragraph from '../typography/Paragraph';
import Inspirations from './Inspirations';

const LearnMain = () => {
  const data = [
    {
      id: '2',
      title: 'Inspiration für deine Karriere.',
      component: <Inspirations />,
    },
  ];

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.sectionContainer}>
            <View style={styles.fieldsTextContainer}>
              <Paragraph style={styles.text}>{item.title}</Paragraph>
              <Paragraph style={{alignSelf: 'flex-end'}}></Paragraph>
            </View>
            {item.component}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 8,
  },
  fieldsTextContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  text: {
    flex: 1,
    color: '#17487a',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
});

export default LearnMain;
