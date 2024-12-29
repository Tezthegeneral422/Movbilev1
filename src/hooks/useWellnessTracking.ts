import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface WellnessMetric {
  id: string;
  type: 'meditation' | 'sleep' | 'exercise';
  value: number;
  timestamp: Date;
  notes?: string;
}

export function useWellnessTracking() {
  const [metrics, setMetrics] = useState<WellnessMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    
    const subscription = supabase
      .channel('wellness_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'wellness_stats' 
      }, fetchMetrics)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('wellness_stats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMetrics(data?.map(metric => ({
        ...metric,
        timestamp: new Date(metric.created_at),
      })) || []);
    } finally {
      setLoading(false);
    }
  };

  const addMetric = async (metric: Omit<WellnessMetric, 'id' | 'timestamp'>) => {
    const { error } = await supabase
      .from('wellness_stats')
      .insert({
        type: metric.type,
        value: metric.value,
        notes: metric.notes,
      });

    if (error) throw error;
    await fetchMetrics();
  };

  const getProgress = (type: WellnessMetric['type'], days: number = 7) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const relevantMetrics = metrics.filter(m => 
      m.type === type && m.timestamp >= cutoff
    );

    return relevantMetrics.reduce((acc, curr) => acc + curr.value, 0) / days;
  };

  return {
    metrics,
    loading,
    addMetric,
    getProgress,
  };
}