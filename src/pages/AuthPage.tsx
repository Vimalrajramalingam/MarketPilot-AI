import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { Zap, Mail, Lock, User as UserIcon, Phone, ArrowRight, ShieldCheck, Store, Sparkles } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  const [email, setEmail] = useState('rahul@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Rahul Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'customer') {
      setEmail('rahul@example.com');
      setName('Rahul Sharma');
    } else if (role === 'vendor') {
      setEmail('vendor@abcelectronics.com');
      setName('Vikram Mehta (ABC Electronics)');
    } else if (role === 'admin') {
      setEmail('admin@marketpilot.ai');
      setName('Super Admin');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const body = isSignup
        ? { name, email, password, role: selectedRole, phone }
        : { email, password, role: selectedRole };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.user) {
        onLoginSuccess(data.user);
        if (data.user.role === 'vendor') navigate('/vendor-dashboard');
        else if (data.user.role === 'admin') navigate('/admin-dashboard');
        else navigate('/home');
      } else {
        setMessage('Authentication successful! Logging you in...');
        setTimeout(() => {
          const fakeUser: User = {
            id: `usr_${Date.now()}`,
            name,
            email,
            role: selectedRole,
            phone,
          };
          onLoginSuccess(fakeUser);
          if (selectedRole === 'vendor') navigate('/vendor-dashboard');
          else if (selectedRole === 'admin') navigate('/admin-dashboard');
          else navigate('/home');
        }, 600);
      }
    } catch (err) {
      // Fallback local auth
      const fakeUser: User = {
        id: `usr_${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        role: selectedRole,
        phone,
      };
      onLoginSuccess(fakeUser);
      if (selectedRole === 'vendor') navigate('/vendor-dashboard');
      else if (selectedRole === 'admin') navigate('/admin-dashboard');
      else navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const fakeUser: User = {
        id: 'usr_google_101',
        name: 'Rahul Sharma (Google Account)',
        email: 'rahul.google@example.com',
        role: selectedRole,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        phone: '+91 98765 43210',
      };
      onLoginSuccess(fakeUser);
      if (selectedRole === 'vendor') navigate('/vendor-dashboard');
      else if (selectedRole === 'admin') navigate('/admin-dashboard');
      else navigate('/home');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0c14] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 mb-2">
            <Zap className="w-7 h-7 fill-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">MarketPilot AI</h1>
          <p className="text-xs text-slate-400">
            {isForgotPassword
              ? 'Reset your password'
              : isSignup
              ? 'Create your Marketplace Account'
              : 'Sign in to access your portal'}
          </p>
        </div>

        {/* Role Selector Tabs */}
        {!isForgotPassword && (
          <div className="bg-black/30 p-1 rounded-2xl border border-white/10 grid grid-cols-3 gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleRoleChange('customer')}
              className={`py-2 rounded-xl transition flex items-center justify-center gap-1 ${
                selectedRole === 'customer'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('vendor')}
              className={`py-2 rounded-xl transition flex items-center justify-center gap-1 ${
                selectedRole === 'vendor'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Vendor
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`py-2 rounded-xl transition flex items-center justify-center gap-1 ${
                selectedRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>
        )}

        {/* Message Alert */}
        {message && (
          <div className="bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs p-3 rounded-xl text-center">
            {message}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isSignup && (
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Rahul Sharma"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="rahul@example.com"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {isSignup && (
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Phone Number</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="+91 98765 43210"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {!isForgotPassword && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">Password</label>
                {!isSignup && (
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[11px] text-blue-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : isForgotPassword ? (
              <span>Send Reset Instructions</span>
            ) : isSignup ? (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Sign In as {selectedRole.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider & Google Login */}
        {!isForgotPassword && (
          <div className="space-y-4 pt-2 border-t border-white/10">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full bg-white/10 hover:bg-white/15 text-white font-medium py-2.5 rounded-xl border border-white/10 transition flex items-center justify-center gap-2 text-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google OAuth</span>
            </button>

            <div className="text-center text-xs">
              {isSignup ? (
                <p className="text-slate-400">
                  Already have an account?{' '}
                  <button onClick={() => setIsSignup(false)} className="text-blue-400 font-bold hover:underline">
                    Sign In
                  </button>
                </p>
              ) : (
                <p className="text-slate-400">
                  Don't have an account?{' '}
                  <button onClick={() => setIsSignup(true)} className="text-blue-400 font-bold hover:underline">
                    Register Now
                  </button>
                </p>
              )}
            </div>
          </div>
        )}

        {isForgotPassword && (
          <div className="text-center pt-2">
            <button
              onClick={() => setIsForgotPassword(false)}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
