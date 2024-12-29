import React from 'react';
import { ProgressChart } from './ProgressChart';
import { useWellnessTracking } from '../../hooks/useWellnessTracking';

export function WellnessMetrics() {
  const { metrics } = useWellnessTracking();

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return days;
  };

  const getMetricsForType = (type: string) => {
    const days = getLast7Days();
    return days.map(day => {
      const dayMetrics = metrics.filter(m => 
        m.type === type &&
        new Date(m.timestamp).toLocaleDateString('en-US', { weekday: 'short' }) === day
      );
      return {
        label: day,
        value: dayMetrics.reduce((acc, curr) => acc + curr.value, 0),
      };
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProgressChart
        title="Meditation"
        data={getMetricsForType('meditation')}
        color="purple"
        unit="min"
      />
      <ProgressChart
        title="Exercise"
        data={getMetricsForType('exercise')}
        color="green"
        unit="min"
      />
    </div>
  );
}