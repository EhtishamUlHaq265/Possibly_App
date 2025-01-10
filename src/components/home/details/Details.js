import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Colors} from '../../../constants/styles';

const Details = ({route, navigation}) => {
  const {item} = route.params;
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: item.title || 'Details',
    });
  }, [navigation, item.title]);

  const renderImage = () => {
    if (item.image && item.image !== 'company_image_url.jpg') {
      return (
        <Image
          source={{uri: item.image}}
          style={{width: '100%', height: 200}}
        />
      );
    } else {
      return (
        <Image
          source={{uri: 'https://placehold.co/500x400.png'}}
          style={{width: '100%', height: 200}}
        />
      );
    }
  };

  return (
    <View style={StyleSheet.mainContainer}>
      {renderImage()}
      <View style={StyleSheet.mainContainer}>
        <Text style={{fontSize: 24, fontWeight: 'bold', margin: 10}}>
          {item.title}
        </Text>
        <Text style={{fontSize: 16, margin: 10}}>{item.companyName}</Text>
        <Text style={{fontSize: 16, margin: 10}}>{item.description}</Text>
        <Text style={{fontSize: 16, margin: 10}}>{item.text}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.secondaryPurple,
  },
});

export default Details;
