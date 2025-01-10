import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Colors} from '../../constants/styles';
import Paragraph from '../typography/Paragraph';
import {getInfo} from '../../api/info';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faClose} from '@fortawesome/free-solid-svg-icons';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const Info = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      const response = await getInfo();
      setInfo(response.data.data);
    } catch (error) {
      console.error('Error fetching info:', error);
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.instructionsBtn} onPress={toggleModal}>
        <Paragraph style={styles.instructionsBtnText}>Anleitung</Paragraph>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.modalContent}>
              <View style={styles.headingContainer}>
                <Paragraph style={styles.modalText}>{info?.title}</Paragraph>
                <TouchableOpacity onPress={toggleModal}>
                  <FontAwesomeIcon
                    icon={faClose}
                    style={styles.closeButtonIcon}
                  />
                </TouchableOpacity>
              </View>
              {info?.des?.map((i, index) => (
                <Paragraph key={index} style={styles.paragraph}>
                  {i}
                </Paragraph>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  instructionsBtn: {
    backgroundColor: 'white',
    marginVertical: 16,
    padding: 10,
    borderRadius: 10,
    width: deviceWidth * 0.5,
    alignSelf: 'center',
    alignItems: 'center',
  },
  instructionsBtnText: {
    fontSize: 18,
    color: Colors.primaryPurple,
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 16,
    color: Colors.darkGray,
    textAlign: 'justify',
  },
  closeButtonIcon: {
    backgroundColor: 'red',
    color: 'white',
    padding: 10,
    borderRadius: 100,
  },
});

export default Info;
