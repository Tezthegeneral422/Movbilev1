import React from 'react';
import { Layout } from '../components/Layout';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import { NotificationSettings } from '../components/Profile/NotificationSettings';
import { ThemeSettings } from '../components/Profile/ThemeSettings';
import { TimezoneSettings } from '../components/Profile/TimezoneSettings';
import { DataManagement } from '../components/Profile/DataManagement';

export function Profile() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <ProfileHeader />
        <ThemeSettings />
        <TimezoneSettings />
        <NotificationSettings />
        <DataManagement />
      </div>
    </Layout>
  );
}