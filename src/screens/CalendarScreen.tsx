import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';

export function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return {
      daysInMonth: lastDay.getDate(),
      firstDayOfWeek: firstDay.getDay(),
    };
  };

  const { daysInMonth, firstDayOfWeek } = getDaysInMonth(selectedDate);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.monthButton}>
            <Icon name="chevron-left" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {selectedDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.monthButton}>
            <Icon name="chevron-right" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.calendar}>
        <View style={styles.weekDays}>
          {days.map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {Array.from({ length: 42 }, (_, index) => {
            const dayNumber = index - firstDayOfWeek + 1;
            const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  isToday(dayNumber) && styles.today,
                  !isCurrentMonth && styles.outsideMonth,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    isToday(dayNumber) && styles.todayText,
                    !isCurrentMonth && styles.outsideMonthText,
                  ]}
                >
                  {isCurrentMonth ? dayNumber : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView style={styles.events}>
        <Text style={styles.sectionTitle}>Today's Events</Text>
        <View style={styles.emptyState}>
          <Icon name="calendar" size={48} color={theme.colors.textSecondary} />
          <Text style={styles.emptyStateText}>No events scheduled for today</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
  },
  monthButton: {
    padding: theme.spacing.sm,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '500',
    color: theme.colors.text,
  },
  calendar: {
    backgroundColor: theme.colors.card,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    color: theme.colors.text,
    fontSize: 16,
  },
  today: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
  todayText: {
    color: '#000',
    fontWeight: '600',
  },
  outsideMonth: {
    opacity: 0.3,
  },
  outsideMonthText: {
    color: theme.colors.textSecondary,
  },
  events: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyStateText: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});