import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArchive,
  faBriefcase,
  faCalendarDay,
  faCalendarTimes,
  faChevronDown,
  faChevronUp,
  faMapMarkedAlt,
} from '@fortawesome/free-solid-svg-icons';
const {width} = Dimensions.get('window');

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DetailRow = ({label, info, iconName}) => {
  // Determine the icon based on iconName
  let icon;
  switch (iconName) {
    case 'faBriefcase':
      icon = faBriefcase;
      break;
    case 'faCalendarDay':
      icon = faCalendarDay;
      break;
    case 'faCalendarTimes':
      icon = faCalendarTimes;
      break;
    case 'faMapMarkedAlt':
      icon = faMapMarkedAlt;
      break;

    // Add more cases as needed
    default:
      icon = null; // Default case if no icon matches
  }

  return (
    <View style={styles.infoRow}>
      <Text style={[styles.label, styles.flexItem]}>{label}</Text>
      {icon && (
        <FontAwesomeIcon icon={icon} size={16} style={styles.iconStyle} />
      )}
      <View style={[styles.detailContainer, styles.flexItem]}>
        <Text style={styles.info}>{info}</Text>
      </View>
    </View>
  );
};

const UpcomingAppointmentCard = ({item}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  // Convert date strings to readable format
  const appliedDate = new Date(item.createdAt).toLocaleDateString();
  const deadline = new Date(item.deadline).toLocaleDateString();

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <Text style={styles.headerText}>{item.companyName}</Text>
        <FontAwesomeIcon
          icon={expanded ? faChevronUp : faChevronDown}
          size={20}
          color="white"
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <DetailRow
            label="Berufliche Tätigkeit:"
            info={item.category}
            iconName="faBriefcase"
          />
          <DetailRow
            label="Startdatum:"
            info={appliedDate}
            iconName="faCalendarDay"
          />
          <DetailRow
            label="Enddatum:"
            info={deadline}
            iconName="faCalendarTimes"
          />
          <DetailRow
            label="Adresse:"
            info={item.occupationlocation.testerDay.address}
            iconName="faMapMarkedAlt"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    width: width * 0.94,
  },
  header: {
    backgroundColor: '#17487a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  collapsedCard: {
    minHeight: 10,
  },

  content: {
    padding: 16,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#17487a',
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexItem: {
    flex: 1,
  },
  iconStyle: {
    marginRight: 2,
    color: '#17487a',
  },
  info: {
    marginLeft: 5,
    color: '#17487a',
    fontWeight: 'bold',
  },
});

export default UpcomingAppointmentCard;
