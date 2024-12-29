import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useProfile } from '../contexts/ProfileContext';
import { supabase } from '../lib/supabase';

export function ProfileScreen() {
  const { profile } = useProfile();
  const [darkMode, setDarkMode] = React.useState(true);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const menuItems = [
    {
      icon: 'bell',
      title: 'Notifications',
      color: '#9333ea',
    },
    {
      icon: 'globe',
      title: 'Language',
      color: '#4b65de',
      value: 'English',
    },
    {
      icon: 'clock',
      title: 'Time Zone',
      color: '#ef4444',
      value: profile.timezone,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
                <Icon name="moon" size={20} color="#000" />
              </View>
              <Text style={styles.menuItemTitle}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor="#fff"
            />
          </View>

          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <Icon name={item.icon} size={20} color="#fff" />
                </View>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              <View style={styles.menuItemRight}>
                {item.value && (
                  <Text style={styles.menuItemValue}>{item.value}</Text>
                )}
                <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.signOutButton}
        >
          <Icon name="log-out" size={20} color="#ef4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  menuItemTitle: {
    fontSize: 16,
    color: theme.colors.text,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.sm,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  signOutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: theme.spacing.sm,
  },
});