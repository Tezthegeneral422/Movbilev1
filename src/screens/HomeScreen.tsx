import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useProfile } from '../contexts/ProfileContext';

export function HomeScreen() {
  const { profile } = useProfile();
  const tasks = []; // TODO: Implement task context

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {getGreeting()}, {profile.name}!
            </Text>
            <Text style={styles.date}>{formatDate()}</Text>
          </View>
          <View style={styles.weather}>
            <Icon name="sun" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.weatherText}>75°F</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.primary }]}>
            <View style={styles.statIcon}>
              <Icon name="briefcase" size={24} color="#000" />
            </View>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Work Tasks</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.colors.accent }]}>
            <View style={styles.statIcon}>
              <Icon name="home" size={24} color="#fff" />
            </View>
            <Text style={[styles.statValue, { color: '#fff' }]}>3</Text>
            <Text style={[styles.statLabel, { color: '#fff' }]}>Family Tasks</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#9333ea' }]}>
            <View style={styles.statIcon}>
              <Icon name="heart" size={24} color="#fff" />
            </View>
            <Text style={[styles.statValue, { color: '#fff' }]}>2</Text>
            <Text style={[styles.statLabel, { color: '#fff' }]}>Personal Tasks</Text>
          </View>
        </View>

        {/* Add more sections as needed */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  weather: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
  },
  weatherText: {
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    color: '#000',
    opacity: 0.8,
  },
});