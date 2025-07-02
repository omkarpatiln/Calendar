import {
  View,
  StyleSheet,
  Text,
  FlatList,
  AppState,
  Alert,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Agenda } from 'react-native-calendars';
import moment from 'moment';
import RNCalendarEvents from 'react-native-calendar-events';
import { Colors, Sizes } from '../../Modules/ThemHelper';
import Header from '../../Components/Header';
import EventRenderItem from './Components/EventRenderItem';
import { AgendaSchedule } from '../../interface';

const CalendarScreen = () => {
  const [items, setItems] = useState<AgendaSchedule>({});
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const fetchedMonths = useRef<Set<string>>(new Set());

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        loadCalendarEvents(new Date());
      }
    });

    return () => subscription.remove();
  }, []);
  useEffect(() => {
    const today = new Date();
    loadCalendarEvents(today);
  }, []);
  const loadCalendarEvents = async (baseDate: Date = new Date()) => {
    const key = moment(baseDate).format('YYYY-MM');
    if (fetchedMonths.current.has(key)) return;

    fetchedMonths.current.add(key);

    const start = moment(baseDate).startOf('month').toISOString();
    const end = moment(baseDate).endOf('month').toISOString();

    const status = await RNCalendarEvents.requestPermissions();
    if (status !== 'authorized') {
      Alert.alert(
        'Permission Denied',
        'Please allow calendar access from settings.',
      );
      return;
    }

    const events = await RNCalendarEvents.fetchAllEvents(start, end);
    const eventKeySet = new Set();

    const uniqueEvents = events.filter(event => {
      const key = `${event.title}-${event.startDate}-${event.endDate}`;
      if (eventKeySet.has(key)) return false;
      eventKeySet.add(key);
      return true;
    });
    const agendaData: AgendaSchedule = {};
    const newMarked: Record<string, { marked: boolean; dotColor: string }> = {};

    uniqueEvents.forEach(event => {
      const date = moment(event.startDate).format('YYYY-MM-DD');

      if (!agendaData[date]) agendaData[date] = [];
      console.log('event.title', event.title);

      agendaData[date].push({
        name: event.title || 'No Title',
        startTime: moment(event.startDate).format('hh:mm A'),
        endTime: moment(event.endDate).format('hh:mm A'),
        height: 80,
        day: date,
      });

      newMarked[date] = { marked: true, dotColor: Colors.Primary };
    });

    setItems(prev => ({ ...prev, ...agendaData }));
    setMarkedDates(prev => ({ ...prev, ...newMarked }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.White }}>
      <Header label="Calender" />

      <Agenda
        items={items}
        selected={moment().format('YYYY-MM-DD')}
        loadItemsForMonth={month => {
          const date = new Date(month.year, month.month - 1);
          loadCalendarEvents(date);
        }}
        renderList={({ item }) => (
          <View style={{ flex: 1, backgroundColor: Colors.White }}>
            <FlatList
              data={items[selectedDate] || []}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              renderItem={({ item }) => <EventRenderItem item={item} />}
              ListEmptyComponent={() => (
                <View style={styles.emptyItem}>
                  <Text style={{ color: Colors.Primary }}>No Events</Text>
                </View>
              )}
            />
          </View>
        )}
        renderEmptyData={() => (
          <View style={styles.emptyItem}>
            <Text style={{ color: Colors.Primary }}>No Events</Text>
          </View>
        )}
        onDayPress={day => {
          setSelectedDate(day.dateString);
        }}
        markedDates={markedDates}
        showClosingKnob={true}
        hideKnob={false}
        showSixWeeks={true}
        theme={{
          selectedDayBackgroundColor: Colors.Primary,
          agendaDayTextColor: Colors.PrimaryText,
          agendaDayNumColor: Colors.PrimaryText,
          agendaKnobColor: Colors.Primary,
        }}
      />
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  item: {
    borderRadius: 8,
    padding: Sizes.Padding,
    marginRight: 10,
    marginTop: 10,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.Black,
  },

  emptyItem: {
    backgroundColor: Colors.White,
    marginHorizontal: Sizes.ScreenPadding,
    marginVertical: Sizes.Padding,
    padding: Sizes.ScreenPadding + 10,
    borderRadius: Sizes.Radius,
    shadowColor: Colors.Black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
