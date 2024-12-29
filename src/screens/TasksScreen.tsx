import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import type { Role, Task } from '../types';

export function TasksScreen() {
  const [activeRole, setActiveRole] = useState<Role>('work');
  const [tasks] = useState<Task[]>([]);

  const roles: Array<{ role: Role; icon: string; label: string }> = [
    { role: 'work', icon: 'briefcase', label: 'Work' },
    { role: 'family', icon: 'home', label: 'Family' },
    { role: 'personal', icon: 'heart', label: 'Personal' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="plus" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.roleTabs}>
        {roles.map(({ role, icon, label }) => (
          <TouchableOpacity
            key={role}
            style={[
              styles.roleTab,
              activeRole === role && styles.activeRoleTab,
            ]}
            onPress={() => setActiveRole(role)}
          >
            <Icon
              name={icon}
              size={20}
              color={activeRole === role ? '#000' : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.roleLabel,
                activeRole === role && styles.activeRoleLabel,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.taskList}>
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="inbox" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyStateText}>
              No tasks yet. Add some using the plus button!
            </Text>
          </View>
        ) : (
          tasks
            .filter((task) => task.role === activeRole)
            .map((task) => (
              <View key={task.id} style={styles.taskCard}>
                <TouchableOpacity style={styles.checkbox}>
                  {task.status === 'done' && (
                    <Icon name="check" size={16} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  {task.description && (
                    <Text style={styles.taskDescription}>{task.description}</Text>
                  )}
                </View>
              </View>
            ))
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTabs: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  roleTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  activeRoleTab: {
    backgroundColor: theme.colors.primary,
  },
  roleLabel: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  activeRoleLabel: {
    color: '#000',
    fontWeight: '500',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyStateText: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});