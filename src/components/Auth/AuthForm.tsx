import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';

interface AuthFormProps {
  mode: 'signIn' | 'signUp';
  onToggleMode: () => void;
}

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const validatePassword = (pass: string) => {
    if (pass.length < PASSWORD_MIN_LENGTH) {
      return 'Password must be at least 8 characters long';
    }
    if (!PASSWORD_REGEX.test(pass)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (resetMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?mode=reset`,
        });
        if (error) throw error;
        setMessage('Check your email for password reset instructions');
      } else if (mode === 'signUp') {
        const passwordError = validatePassword(password);
        if (passwordError) {
          setError(passwordError);
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { 
            data: { name: email.split('@')[0] }
          }
        });
        if (error) throw error;
        setMessage('Check your email to verify your account');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          throw error;
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-center">
        {mode === 'signIn' ? 'Welcome Back' : 'Create Account'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-black/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
          />
        </div>

        {!resetMode && <div>
          <label className="block text-sm text-gray-400 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 bg-black/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
          />
        </div>}

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <p>{error}</p>
          </div>
        )}

        {message && (
          <p className="text-[var(--accent-color)] text-sm text-center">
            {message}
          </p>
        )}

        {!message && <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--accent-color)] text-black rounded-xl py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : mode === 'signIn' ? (
            resetMode ? 'Send Reset Instructions' : 'Sign In'
          ) : (
            'Sign Up'
          )}
        </button>}

        <p className="text-center text-sm text-gray-400">
          {resetMode ? (
            <>
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => setResetMode(false)}
                className="text-[var(--accent-color)] hover:underline"
              >
                Sign In
              </button>
            </>
          ) : mode === 'signIn' ? (
            <>
              <span className="block mb-2">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="text-[var(--accent-color)] hover:underline"
                >
                  Sign Up
                </button>
              </span>
              <button
                type="button"
                onClick={() => setResetMode(true)}
                className="text-gray-500 hover:text-gray-400"
              >
                Forgot your password?
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={onToggleMode}
                className="text-[var(--accent-color)] hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}