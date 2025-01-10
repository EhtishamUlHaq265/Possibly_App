import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  Dimensions,
  UIManager,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faBriefcase,
  faCalendarDay,
  faCalendarTimes,
  faMapMarkedAlt,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DetailRow = ({label, info}) => {
  let icon;
  switch (label) {
    case 'Berufliche Tätigkeit:':
      icon = faBriefcase;
      break;
    case 'Startdatum:':
      icon = faCalendarDay;
      break;
    case 'Enddatum:':
      icon = faCalendarTimes;
      break;
    case 'Adresse:':
      icon = faMapMarkedAlt;
      break;
    default:
      icon = null;
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

const InfoCard = ({item}) => {
  const [expanded, setExpanded] = useState(false);

  const startDate = new Date(
    item.occupationlocation.testerDay.startdate,
  ).toLocaleDateString();
  const endDate = new Date(
    item.occupationlocation.testerDay.endDate,
  ).toLocaleDateString();

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

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
          <DetailRow label="Berufliche Tätigkeit:" info={item.category} />
          <DetailRow
            label="Startdatum:"
            info={startDate}
            iconName="faCalendarDay"
          />
          <DetailRow
            label="Enddatum:"
            info={endDate}
            iconName="faCalendarTimes"
          />
          <DetailRow
            label="Adresse:"
            info={item.occupationlocation.testerDay.address}
          />
        </View>
      )}
    </View>
  );
};

const {width} = Dimensions.get('window');

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
    elevation: 3,
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

export default InfoCard;
