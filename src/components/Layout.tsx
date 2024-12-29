import React, { useState } from 'react';
import { Menu, Bell, Settings, Plus, X, Home, CheckSquare, Calendar, Heart, User, LogOut, Moon, Sun, Volume2, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useProfile } from '../contexts/ProfileContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { profile } = useProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  React.useEffect(() => {
    if (isMobileMenuOpen || isMenuOpen || showNotifications || showSettings) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [isMobileMenuOpen, isMenuOpen, showNotifications, showSettings]);

  return (
    <div className="min-h-full bg-[#1A1B1E] flex flex-col">
      {/* Header */}
      <header className="bg-[#1A1B1E] shadow-sm flex-none border-b border-[#4b65de]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-[#2A2B2E] rounded-lg md:hidden text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="text-xl font-semibold text-white">BalancePro</Link>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-[#2A2B2E] rounded-lg text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowNotifications(true)}
              className="p-2 hover:bg-[#2A2B2E] rounded-lg text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-[#2A2B2E] rounded-lg text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center">
              <span className="text-sm font-medium text-black">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-gray-900/50 md:hidden">
            <div className="fixed inset-y-0 left-0 w-64 bg-[#2A2B2E] shadow-lg flex flex-col">
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="font-semibold text-[var(--accent-color)]">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-[#1A1B1E] rounded-lg text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                <Link
                  to="/"
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    location.pathname === '/' ? 'bg-[var(--accent-color)] text-black' : 'hover:bg-[#1A1B1E]'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/tasks"
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    location.pathname === '/tasks' ? 'bg-[var(--accent-color)] text-black' : 'hover:bg-[#1A1B1E]'
                  }`}
                >
                  <CheckSquare className="w-5 h-5" />
                  <span>Tasks</span>
                </Link>
                <Link
                  to="/calendar"
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    location.pathname === '/calendar' ? 'bg-[var(--accent-color)] text-black' : 'hover:bg-[#1A1B1E]'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span>Calendar</span>
                </Link>
                <Link
                  to="/wellness"
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    location.pathname === '/wellness' ? 'bg-[var(--accent-color)] text-black' : 'hover:bg-[#1A1B1E]'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Wellness</span>
                </Link>
                <Link
                  to="/profile"
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    location.pathname === '/profile' ? 'bg-[var(--accent-color)] text-black' : 'hover:bg-[#1A1B1E]'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-[#1A1B1E]"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>
        )}
      </header>
      {/* Desktop Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/50">
          <div className="fixed inset-y-0 right-0 w-80 bg-[#2A2B2E] shadow-lg flex flex-col">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="font-semibold text-[var(--accent-color)]">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-black/20 rounded-lg text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <Link
                to="/"
                className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                  location.pathname === '/' ? 'bg-[var(--accent-color)] text-black' : 'hover:bg-[#1A1B1E]'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link
                to="/tasks"
                className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                  location.pathname === '/tasks' ? 'bg-[var(--accent-color)] text-black' : 'hover:bg-[#1A1B1E]'
                }`}
              >
                <CheckSquare className="w-5 h-5" />
                <span>Tasks</span>
              </Link>
              <Link
                to="/calendar"
                className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                  location.pathname === '/calendar' ? 'bg-[var(--accent-color)] text-black' : 'hover:bg-[#1A1B1E]'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>Calendar</span>
              </Link>
              <Link
                to="/wellness"
                className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                  location.pathname === '/wellness' ? 'bg-[var(--accent-color)] text-black' : 'hover:bg-[#1A1B1E]'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span>Wellness</span>
              </Link>
              <Link
                to="/profile"
                className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                  location.pathname === '/profile' ? 'bg-[var(--accent-color)] text-black' : 'hover:bg-[#1A1B1E]'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-[#1A1B1E]"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#2A2B2E] border-t border-gray-800 md:hidden">
        <nav className="flex justify-around p-2">
          <Link
            to="/"
            className={`p-2 flex flex-col items-center ${
              location.pathname === '/' ? 'text-[var(--accent-color)]' : 'text-gray-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/tasks"
            className={`p-2 flex flex-col items-center ${
              location.pathname === '/tasks' ? 'text-[var(--accent-color)]' : 'text-gray-400'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="text-xs">Tasks</span>
          </Link>
          <Link
            to="/calendar"
            className={`p-2 flex flex-col items-center ${
              location.pathname === '/calendar' ? 'text-[var(--accent-color)]' : 'text-gray-400'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Calendar</span>
          </Link>
          <Link
            to="/wellness"
            className={`p-2 flex flex-col items-center ${
              location.pathname === '/wellness' ? 'text-[var(--accent-color)]' : 'text-gray-400'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-xs">Wellness</span>
          </Link>
          <Link
            to="/profile"
            className={`p-2 flex flex-col items-center ${
              location.pathname === '/profile' ? 'text-[var(--accent-color)]' : 'text-gray-400'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 overflow-y-auto">
        {children}
      </main>
      
      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#2A2B2E] rounded-3xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-2 hover:bg-black/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--accent-color)]" />
                  <div>
                    <p className="font-medium">New task assigned</p>
                    <p className="text-sm text-gray-400">2 hours ago</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Team meeting tomorrow</p>
                    <p className="text-sm text-gray-400">5 hours ago</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <div>
                    <p className="font-medium">Wellness goal achieved!</p>
                    <p className="text-sm text-gray-400">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#2A2B2E] rounded-3xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Quick Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-black/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5" />
                  <span>Dark Mode</span>
                </div>
                <button className="w-11 h-6 bg-[var(--accent-color)] rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5" />
                  <span>Sound Effects</span>
                </div>
                <button className="w-11 h-6 bg-[var(--accent-color)] rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" />
                </button>
              </div>
              
              <Link
                to="/profile"
                onClick={() => setShowSettings(false)}
                className="flex items-center justify-between p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  <span>All Settings</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}