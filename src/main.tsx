import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RequireAuth } from './components/Auth/RequireAuth';
import { Auth } from './pages/Auth';
import { MoodProvider } from './contexts/MoodContext';
import { WellnessProvider } from './contexts/WellnessContext';
import { ProfileProvider } from './contexts/ProfileContext';
import App from './App.tsx';
import { TaskManager } from './pages/TaskManager';
import { Calendar } from './pages/Calendar';
import { Wellness } from './pages/Wellness';
import { Profile } from './pages/Profile';
import './index.css';

const router = createBrowserRouter([
  { path: '/auth', element: <Auth /> },
  {
    path: '/',
    element: <RequireAuth><App /></RequireAuth>,
  },
  {
    path: '/tasks',
    element: <RequireAuth><TaskManager /></RequireAuth>,
  },
  {
    path: '/calendar',
    element: <RequireAuth><Calendar /></RequireAuth>,
  },
  {
    path: '/wellness',
    element: <RequireAuth><Wellness /></RequireAuth>,
  },
  {
    path: '/profile',
    element: <RequireAuth><Profile /></RequireAuth>,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <MoodProvider>
        <WellnessProvider>
          <ProfileProvider>
            <RouterProvider router={router} />
          </ProfileProvider>
        </WellnessProvider>
      </MoodProvider>
    </AuthProvider>
  </StrictMode>
);
