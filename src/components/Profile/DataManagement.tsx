import React, { useState } from 'react';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useProfile } from '../../contexts/ProfileContext';

export function DataManagement() {
  const { profile } = useProfile();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAccountDeletion = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      const { error } = await supabase.auth.admin.deleteUser(profile.id);
      if (error) throw error;
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async () => {
    try {
      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profile.id)
        .single();

      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', profile.id);

      const { data: wellnessData } = await supabase
        .from('wellness_stats')
        .select('*')
        .eq('user_id', profile.id);

      const exportData = {
        profile: userData,
        tasks: tasksData,
        wellness: wellnessData,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `balancepro-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // Implement data validation and import logic
        console.log('Imported data:', data);
      } catch (error) {
        console.error('Error importing data:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="card space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <Download className="w-4 h-4 text-green-500" />
        </div>
        <h2 className="text-lg font-semibold">Data Management</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleExport}
          className="flex items-center gap-3 p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors"
        >
          <Download className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Export Data</div>
            <p className="text-sm text-gray-400">Download all your data as JSON</p>
          </div>
        </button>

        <label className="flex items-center gap-3 p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors cursor-pointer">
          <Upload className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Import Data</div>
            <p className="text-sm text-gray-400">Upload a backup file</p>
          </div>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <div className="text-sm">
          <p className="font-medium text-red-500">Delete Account</p>
          <p className="text-gray-400">
            This action cannot be undone. All your data will be permanently deleted.
          </p>
        </div>
        <button
          onClick={handleAccountDeletion}
          disabled={isDeleting}
          className="ml-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}