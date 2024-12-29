import React, { useState } from 'react';
import { AuthForm } from '../components/Auth/AuthForm';

export function Auth() {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1B1E] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--accent-color)]">
            BalancePro
          </h1>
          <p className="text-gray-400 mt-2">
            Your personal wellness and productivity companion
          </p>
        </div>

        <div className="bg-[#2A2B2E] rounded-3xl p-8">
          <AuthForm
            mode={mode}
            onToggleMode={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
          />
        </div>
      </div>
    </div>
  );
}