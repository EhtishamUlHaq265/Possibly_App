import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight} from "@fortawesome/free-solid-svg-icons";
import { Colors } from '../../../constants/styles';
const AllProfessionalFields = ({ route }) => {
  const { data } = route.params;

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>{item.emoji} {item.title}</Text>
              <Text>{item.text}</Text>
            </View>
            <FontAwesomeIcon icon={faChevronRight} size={20} color="#000" style={styles.icon} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 16,
    backgroundColor:Colors.secondaryPurple
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    padding:4,
    borderRadius:8,
    backgroundColor:'white',
    elevation:2,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 10,
  },
});

export default AllProfessionalFields;
