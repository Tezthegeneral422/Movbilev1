import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SleepRecord {
  id: string;
  startTime: Date;
  endTime: Date;
  quality: number;
  notes?: string;
  moodOnWakeup?: string;
}

export function useSleepTracking() {
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
    
    const subscription = supabase
      .channel('sleep_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'sleep_records' 
      }, fetchRecords)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('sleep_records')
        .select('*')
        .order('start_time', { ascending: false });

      if (error) throw error;

      setRecords(data?.map(record => ({
        ...record,
        startTime: new Date(record.start_time),
        endTime: new Date(record.end_time),
      })) || []);
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async (record: Omit<SleepRecord, 'id'>) => {
    const { error } = await supabase
      .from('sleep_records')
      .insert({
        start_time: record.startTime.toISOString(),
        end_time: record.endTime.toISOString(),
        quality: record.quality,
        notes: record.notes,
        mood_on_wakeup: record.moodOnWakeup,
      });

    if (error) throw error;
    await fetchRecords();
  };

  const getSleepStats = (days: number = 7) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const relevantRecords = records.filter(r => r.startTime >= cutoff);
    
    if (relevantRecords.length === 0) {
      return { averageDuration: 0, averageQuality: 0, totalSleep: 0 };
    }

    const totalSleep = relevantRecords.reduce((acc, curr) => {
      return acc + (curr.endTime.getTime() - curr.startTime.getTime());
    }, 0) / (1000 * 60 * 60); // Convert to hours

    const averageQuality = relevantRecords.reduce((acc, curr) => 
      acc + curr.quality, 0) / relevantRecords.length;

    return {
      averageDuration: totalSleep / relevantRecords.length,
      averageQuality,
      totalSleep,
    };
  };

  return {
    records,
    loading,
    addRecord,
    getSleepStats,
  };
}