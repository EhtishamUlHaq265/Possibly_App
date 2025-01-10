import React from 'react';
import {View, StyleSheet} from 'react-native';
import Accordion from '../accordion/Accordion';

const GetHelp = () => {
  return (
    <View style={styles.container}>
      <Accordion
        title="Was bedeutet es, zu schnüffeln? "
        content="Inhalt von Abschnitt 1 und Einzelheiten können Sie hier abrufen"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default GetHelp;
