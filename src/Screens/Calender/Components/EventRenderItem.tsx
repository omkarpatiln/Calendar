import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { AgendaEntry } from '../../../interface';
import { Colors } from '../../../Modules/ThemHelper';

interface Props {
  item: AgendaEntry;
}

const EventRenderItem: React.FC<Props> = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.timeBlock}>
        <Text style={styles.timeText}>
          {item.startTime} - {item.endTime}
        </Text>
        <Text style={styles.nameText}>{item.name}</Text>
      </View>
    </View>
  );
};

export default EventRenderItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.White,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    shadowColor: Colors.Black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBlock: {
    flex: 1,
  },
  timeText: {
    fontSize: 14,
    color: Colors.Disable,
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.Primary,
  },
});
