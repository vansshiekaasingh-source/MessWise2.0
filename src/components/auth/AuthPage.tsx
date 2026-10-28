import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { sound } from '../../lib/audio';

export const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update user profile display name if entered
        if (fullName.trim()) {
          await updateProfile(userCredential.user, {
            displayName: fullName.trim()
          });
        }
        sound.playSuccess();
      } else {
        // Sign in flow
        await signInWithEmailAndPassword(auth, email, password);
        sound.playSuccess();
      }
    } catch (error: any) {
      sound.playError();
      const code = error.code;

      if (isSignUp) {
        // Required exact message for existing account
        if (code === 'auth/email-already-in-use') {
          setErrorMessage('User already exists. Please sign in');
        } else {
          setErrorMessage(error.message || 'Registration failed. Please check your details.');
        }
      } else {
        // Required exact message for incorrect credentials
        if (
          code === 'auth/wrong-password' ||
          code === 'auth/user-not-found' ||
          code === 'auth/invalid-credential' ||
          code === 'auth/invalid-email'
        ) {
          setErrorMessage('Email or password is incorrect');
        } else {
          setErrorMessage('Email or password is incorrect');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warmIvory dark:bg-appDark flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-riceWhite dark:bg-surface border border-softBorder dark:border-borderDark rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-fadeIn">
        
        {/* Left Column: Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-deepMaroon flex items-center justify-center text-turmericGold font-serif font-black text-xl shadow-sm">
                M
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg text-deepMaroon dark:text-primaryAccent leading-none">
                  MessWise
                </h1>
                <p className="text-[10px] text-mutedStone uppercase tracking-wider mt-0.5">
                  The Kamar-Taj Refectory
                </p>
              </div>
            </div>

            <div className="inline-block px-2.5 py-1 bg-turmericGold/15 border border-turmericGold/30 text-turmericGold rounded-full text-[10px] font-bold mb-3">
              Webster 2026 • Team Terror Code 404
            </div>

            <h2 className="text-xl font-bold text-charcoal dark:text-textPrimary">
              {isSignUp ? 'Create Refectory Account' : 'Sign In to Campus Refectory'}
            </h2>
            <p className="text-xs text-mutedStone mt-1">
              {isSignUp 
                ? 'Sign up with your college email and password to access refectory services.' 
                : 'Enter your credentials to access your meal bookings and live QR pass.'}
            </p>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-100 border border-errorRed text-errorRed rounded-xl text-xs font-semibold animate-fadeIn">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-3 text-xs">
              {isSignUp && (
                <div>
                  <label className="font-bold block mb-1 text-charcoal dark:text-textPrimary">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vansshiekaa Singh"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated text-charcoal dark:text-textPrimary focus:outline-none focus:border-deepMaroon"
                  />
                </div>
              )}

              <div>
                <label className="font-bold block mb-1 text-charcoal dark:text-textPrimary">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@mnnit.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated text-charcoal dark:text-textPrimary focus:outline-none focus:border-deepMaroon"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-charcoal dark:text-textPrimary">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated text-charcoal dark:text-textPrimary focus:outline-none focus:border-deepMaroon"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-deepMaroon hover:bg-deepMaroon/90 text-white font-bold text-xs rounded-xl shadow-sm transition-all mt-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            {/* Toggle between Sign In and Sign Up */}
            <div className="mt-4 text-center text-xs text-mutedStone">
              {isSignUp ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setErrorMessage(null);
                    }}
                    className="text-deepMaroon dark:text-primaryAccent font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setErrorMessage(null);
                    }}
                    className="text-deepMaroon dark:text-primaryAccent font-bold hover:underline"
                  >
                    Sign Up
                  </button>
                </span>
              )}
            </div>
          </div>

          <div className="text-[10px] text-mutedStone border-t border-softBorder pt-3 mt-6">
            🔒 Secured with <strong>Firebase Authentication</strong> • Single-Session Protection
          </div>
        </div>

        {/* Right Column: Campus Identity */}
        <div className="bg-gradient-to-br from-[#531b25] to-deepMaroon text-white p-8 sm:p-10 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-turmericGold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full border border-turmericGold/30">
              MNNIT Allahabad Refectory Pilot
            </span>
            <h3 className="text-2xl font-serif font-black leading-tight text-riceWhite">
              "Every Meal Accounted For. Every Resource Respected."
            </h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Real-time bookings, rotating HMAC gate passes, explainable kitchen prep planning, and verified diner reviews.
            </p>
          </div>

          <div className="border-t border-white/20 pt-4 text-[11px] text-white/80 space-y-1 font-mono">
            <div>Team: <strong>Terror Code 404 (ID: 254)</strong></div>
            <div>Materials Engineering, MNNIT Allahabad</div>
          </div>
        </div>

      </div>
    </div>
  );
};
