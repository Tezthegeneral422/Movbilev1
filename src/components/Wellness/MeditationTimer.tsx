import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface MeditationTimerProps {
  onComplete: (duration: number) => void;
  onClose: () => void;
}

export function MeditationTimer({ onComplete, onClose }: MeditationTimerProps) {
  const [duration, setDuration] = useState(5); // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            onComplete(duration);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, duration, onComplete]);

  useEffect(() => {
    if (isRunning) {
      const breathInterval = setInterval(() => {
        setBreathPhase(phase => {
          switch (phase) {
            case 'inhale': return 'hold';
            case 'hold': return 'exhale';
            case 'exhale': return 'inhale';
          }
        });
      }, 4000); // 4 seconds per phase

      return () => clearInterval(breathInterval);
    }
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setTimeLeft(duration * 60);
    setIsRunning(false);
    setBreathPhase('inhale');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[#2A2B2E] rounded-3xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-semibold mb-6 text-center">Meditation Timer</h2>

        <div className="flex flex-col items-center space-y-8">
          <div className="text-6xl font-light">{formatTime(timeLeft)}</div>

          {isRunning && (
            <div className="text-xl text-[var(--accent-color)]">
              {breathPhase === 'inhale' && 'Inhale...'}
              {breathPhase === 'hold' && 'Hold...'}
              {breathPhase === 'exhale' && 'Exhale...'}
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="w-16 h-16 rounded-full bg-[var(--accent-color)] text-black flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              {isRunning ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </button>
            <button
              onClick={reset}
              className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          {!isRunning && (
            <div className="w-full">
              <label className="text-sm text-gray-400 block mb-2">
                Duration (minutes)
              </label>
              <input
                type="range"
                min="1"
                max="60"
                value={duration}
                onChange={(e) => {
                  setDuration(Number(e.target.value));
                  setTimeLeft(Number(e.target.value) * 60);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>1</span>
                <span>{duration}</span>
                <span>60</span>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full bg-black/20 text-white rounded-2xl py-3 font-medium hover:bg-black/30 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}