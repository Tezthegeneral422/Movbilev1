import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { MoodProvider } from './src/contexts/MoodContext';
import { WellnessProvider } from './src/contexts/WellnessContext';
import { ProfileProvider } from './src/contexts/ProfileContext';
import { Navigation } from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthProvider>
        <MoodProvider>
          <WellnessProvider>
            <ProfileProvider>
              <Navigation />
            </ProfileProvider>
          </WellnessProvider>
        </MoodProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}