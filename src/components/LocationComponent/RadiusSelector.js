import React, {useState} from 'react';
import {View, Text} from 'react-native';
import Slider from '@react-native-community/slider';

const RadiusSelector = () => {
  const [radius, setRadius] = useState(30); // Default radius

  return (
    <View>
      <Text>Select search radius: {radius} km</Text>
      <Slider
        style={{width: '100%', height: 40}}
        minimumValue={1}
        maximumValue={100}
        step={1}
        value={radius}
        onValueChange={setRadius}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#b9e4c9"
      />
      {/* You can add a button here to perform the search */}
    </View>
  );
};

export default RadiusSelector;
