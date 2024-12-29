import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';

export function WellnessScreen() {
  const wellnessTools = [
    {
      icon: 'play',
      title: 'Quick Meditation',
      description: '5-minute breathing exercise',
      color: theme.colors.primary,
    },
    {
      icon: 'activity',
      title: 'Desk Stretches',
      description: 'Simple exercises for work breaks',
      color: '#4b65de',
    },
    {
      icon: 'heart',
      title: 'Mood Check',
      description: 'Track your daily mood',
      color: '#ef4444',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Wellness Center</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="smile" size={24} color={theme.colors.primary} />
            <Text style={styles.statValue}>Good</Text>
            <Text style={styles.statLabel}>Current Mood</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="activity" size={24} color="#4b65de" />
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Activity Score</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="moon" size={24} color="#9333ea" />
            <Text style={styles.statValue}>7.5h</Text>
            <Text style={styles.statLabel}>Sleep</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Wellness Tools</Text>
        <View style={styles.toolsGrid}>
          {wellnessTools.map((tool, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.toolCard, { backgroundColor: tool.color }]}
            >
              <View style={styles.toolIcon}>
                <Icon name={tool.icon} size={24} color="#000" />
              </View>
              <Text style={styles.toolTitle}>{tool.title}</Text>
              <Text style={styles.toolDescription}>{tool.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Weekly Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Meditation Minutes</Text>
            <Text style={styles.progressValue}>45/60 min</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '75%' }]} />
          </View>
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
  scrollContent: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginVertical: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },
  toolCard: {
    width: '50%',
    padding: theme.spacing.xs,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.7)',
  },
  progressCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  progressValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
});