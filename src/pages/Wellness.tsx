import React from 'react';
import { Layout } from '../components/Layout';
import { WellnessOverview } from '../components/Wellness/WellnessOverview';
import { WellnessTools } from '../components/Wellness/WellnessTools';
import { WellnessStats } from '../components/Wellness/WellnessStats';
import { WellnessGoals } from '../components/Wellness/WellnessGoals';
import { MoodHistory } from '../components/Wellness/MoodHistory';
import { SleepTracker } from '../components/Wellness/SleepTracker';
import { MoodAnalysis } from '../components/Wellness/MoodAnalysis';
import { WellnessMetrics } from '../components/Wellness/WellnessMetrics';
import { useMood } from '../contexts/MoodContext';

export function Wellness() {
  const { moods } = useMood();
  const [showMeditationModal, setShowMeditationModal] = React.useState(false);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Wellness Center</h1>
          <p className="text-gray-400">Track and improve your well-being</p>
        </div>

        <WellnessOverview />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WellnessTools onMeditationStart={() => setShowMeditationModal(true)} />
          <SleepTracker />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <WellnessMetrics />
          </div>
          <MoodAnalysis />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <WellnessGoals />
          </div>
          <MoodHistory moods={moods} />
        </div>
      </div>
      
      {showMeditationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2A2B2E] rounded-3xl p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">5-Minute Breathing Exercise</h2>
            <p className="text-gray-400 mb-6">
              Find a comfortable position and follow the breathing pattern:
              Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds.
            </p>
            <button
              onClick={() => setShowMeditationModal(false)}
              className="w-full bg-[var(--accent-color)] text-black rounded-2xl py-4 font-medium hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}