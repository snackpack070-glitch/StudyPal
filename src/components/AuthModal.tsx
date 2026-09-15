import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  Shield,
  KeyRound
} from 'lucide-react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from '../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: () => void;
  onOpenLegal?: (tab: 'terms' | 'privacy') => void;
}

export default function AuthModal({
  isOpen,
  initialMode = 'signin',
  onClose,
  onSuccess,
  onOpenLegal
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetState = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleGoogleSignIn = async () => {
    resetState();
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setSuccessMsg('Successfully signed in with Google!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 600);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      let msg = 'Failed to sign in with Google. Please try again.';
      if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Sign-in window was closed before completion.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        msg = 'Sign-in request was cancelled.';
      }
      setErrorMsg(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    if (!email || (mode !== 'forgot' && !password)) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccessMsg('Signed in successfully!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 600);
      } else if (mode === 'signup') {
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName && userCredential.user) {
          await updateProfile(userCredential.user, { displayName });
        }
        setSuccessMsg('Account created successfully! Welcome to StudyPal.');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 600);
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg(`Password reset link sent to ${email}. Check your inbox.`);
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      let msg = err.message || 'An error occurred during authentication.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please check your credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Try logging in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 transition-all transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="bg-blue-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-blue-300 hover:text-white p-1 rounded-full hover:bg-blue-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-yellow-400 font-extrabold text-sm mb-1">
            <Shield className="w-4 h-4" />
            <span>StudyPal Account</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            {mode === 'signin' && 'Sign in to sync your study history and cloud solution items.'}
            {mode === 'signup' && 'Join StudyPal to save your homework scans and practice quizzes.'}
            {mode === 'forgot' && 'Enter your account email to receive a password reset link.'}
          </p>

          {/* Mode Switch Tabs */}
          {mode !== 'forgot' && (
            <div className="flex bg-blue-900/80 p-1 rounded-xl mt-5 border border-blue-800">
              <button
                type="button"
                onClick={() => { setMode('signin'); resetState(); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signin' 
                    ? 'bg-yellow-400 text-blue-950 shadow-xs' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); resetState(); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signup' 
                    ? 'bg-yellow-400 text-blue-950 shadow-xs' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Status Feedback Messages */}
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-start space-x-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-start space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          {mode !== 'forgot' && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full py-3 px-4 border border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100/80 rounded-2xl font-bold text-xs text-gray-800 transition-all flex items-center justify-center space-x-3 cursor-pointer shadow-2xs"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                ) : (
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
                )}
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-gray-100 w-full"></div>
                <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">or email</span>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-900 focus:bg-white rounded-xl text-xs font-medium text-gray-900 outline-hidden transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-900 focus:bg-white rounded-xl text-xs font-medium text-gray-900 outline-hidden transition-all"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); resetState(); }}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-900 focus:bg-white rounded-xl text-xs font-medium text-gray-900 outline-hidden transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3 bg-blue-950 hover:bg-blue-900 text-yellow-400 font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'signin' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {mode !== 'forgot' && (
              <p className="text-[11px] text-gray-500 text-center mt-3 leading-tight">
                By continuing, you agree to StudyPal's{' '}
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('terms')}
                  className="text-blue-950 font-bold underline hover:text-blue-700 cursor-pointer"
                >
                  Terms of Use
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('privacy')}
                  className="text-blue-950 font-bold underline hover:text-blue-700 cursor-pointer"
                >
                  Privacy Policy
                </button>.
              </p>
            )}
          </form>

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => { setMode('signin'); resetState(); }}
              className="w-full text-center text-xs font-bold text-gray-500 hover:text-gray-800 pt-2 cursor-pointer"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
