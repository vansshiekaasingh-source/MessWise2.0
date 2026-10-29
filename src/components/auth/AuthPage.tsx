import React, { useState } from 'react';
import { 
  signInWithPopup,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut
} from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { sound } from '../../lib/audio';

interface AuthPageProps {
  onBypassDemoLogin?: (profile: any) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBypassDemoLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Google Sign-In with strict @mnnit.ac.in domain check
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setLoading(true);

    try {
      googleProvider.setCustomParameters({
        prompt: 'select_account',
        hd: 'mnnit.ac.in' // Google Workspace domain hint
      });

      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = (result.user.email || '').toLowerCase();

      // Enforce @mnnit.ac.in domain restriction
      if (!userEmail.endsWith('@mnnit.ac.in')) {
        await signOut(auth);
        sound.playError();
        setErrorMessage('Access Denied: Only verified @mnnit.ac.in Google Workspace accounts are permitted.');
        return;
      }

      sound.playSuccess();
    } catch (error: any) {
      sound.playError();
      if (error.code === 'auth/unauthorized-domain') {
        setErrorMessage('Notice: 127.0.0.1 is not whitelisted in Firebase. Test via http://localhost:5173/ or use the demo login below.');
      } else {
        setErrorMessage(error.message || 'Google authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Email & Password Sign In / Sign Up
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    // Enforce MNNIT domain for registration
    if (isSignUp && !email.toLowerCase().endsWith('@mnnit.ac.in')) {
      setErrorMessage('Please use your official college email (e.g. name.regno@mnnit.ac.in)');
      setLoading(false);
      sound.playError();
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (fullName.trim()) {
          await updateProfile(userCredential.user, { displayName: fullName.trim() });
        }
        sound.playSuccess();
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        sound.playSuccess();
      }
    } catch (error: any) {
      sound.playError();
      const code = error.code;
      if (isSignUp) {
        if (code === 'auth/email-already-in-use') {
          setErrorMessage('User already exists. Please sign in');
        } else {
          setErrorMessage(error.message || 'Registration failed.');
        }
      } else {
        setErrorMessage('Email or password is incorrect');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warmIvory dark:bg-appDark flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-riceWhite dark:bg-surface border border-softBorder dark:border-borderDark rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-fadeIn">
        
        {/* Left Form */}
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
                  MNNIT Allahabad Refectory
                </p>
              </div>
            </div>

            <div className="inline-block px-2.5 py-1 bg-turmericGold/15 border border-turmericGold/30 text-turmericGold rounded-full text-[10px] font-bold mb-3">
              Webster 2026 • Team Terror Code 404 (ID: 254)
            </div>

            <h2 className="text-xl font-bold text-charcoal dark:text-textPrimary">
              {isSignUp ? 'Create Resident Account' : 'MNNIT Refectory Portal'}
            </h2>
            <p className="text-xs text-mutedStone mt-1">
              Authentication restricted strictly to verified <strong>@mnnit.ac.in</strong> accounts.
            </p>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-100 border border-errorRed text-errorRed rounded-xl text-xs font-semibold leading-relaxed animate-fadeIn">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Primary Google Login Button */}
            <div className="mt-5 space-y-3">
              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 bg-white dark:bg-surfaceElevated hover:bg-gray-50 text-charcoal dark:text-textPrimary font-bold text-xs rounded-xl border border-gray-300 dark:border-borderDark shadow-sm flex items-center justify-center gap-3 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continue with Google (@mnnit.ac.in only)</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-softBorder dark:border-borderDark"></div>
                <span className="flex-shrink mx-3 text-[10px] text-mutedStone uppercase">or email & password</span>
                <div className="flex-grow border-t border-softBorder dark:border-borderDark"></div>
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-2.5 text-xs">
                {isSignUp && (
                  <div>
                    <label className="font-bold block mb-1">Full Name</label>
                    <input
                      type="text" required placeholder="e.g. Vansshiekaa Singh" value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated"
                    />
                  </div>
                )}

                <div>
                  <label className="font-bold block mb-1">College Email (@mnnit.ac.in)</label>
                  <input
                    type="email" required placeholder="name.regno@mnnit.ac.in" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Password</label>
                  <input
                    type="password" required placeholder="••••••••" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated"
                  />
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-2.5 bg-deepMaroon hover:bg-deepMaroon/90 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
              </form>

              <div className="text-center text-xs text-mutedStone pt-1">
                {isSignUp ? (
                  <span>Already registered? <button onClick={() => { setIsSignUp(false); setErrorMessage(null); }} className="text-deepMaroon dark:text-primaryAccent font-bold underline">Sign In</button></span>
                ) : (
                  <span>New resident? <button onClick={() => { setIsSignUp(true); setErrorMessage(null); }} className="text-deepMaroon dark:text-primaryAccent font-bold underline">Create Account</button></span>
                )}
              </div>
            </div>
          </div>

          {/* Sandbox Bypass */}
          {onBypassDemoLogin && (
            <div className="mt-4 pt-3 border-t border-softBorder text-center">
              <span className="text-[10px] text-mutedStone block mb-1.5">Mid-Evaluation Sandbox Bypass:</span>
              <button
                type="button"
                onClick={() => onBypassDemoLogin({
                  uid: 'demo-vansshiekaa',
                  name: 'Vansshiekaa Singh',
                  email: 'vansshiekaa.20259028@mnnit.ac.in',
                  role: 'STUDENT',
                  branch: 'Materials Engineering',
                  hostelName: 'Sarojini Naidu Girls Hostel (SNGH)',
                  hostelId: 'h-sngh',
                  room: 'A-208',
                  year: '2nd Year B.Tech'
                })}
                className="px-3 py-1 bg-warmIvory dark:bg-surfaceElevated border border-turmericGold text-charcoal dark:text-textPrimary text-[11px] font-bold rounded-lg hover:bg-turmericGold/20"
              >
                ⚡ Instant Login as MNNIT Student (Vansshiekaa)
              </button>
            </div>
          )}
        </div>

        {/* Right Info */}
        <div className="bg-gradient-to-br from-[#531b25] to-deepMaroon text-white p-8 sm:p-10 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-turmericGold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full border border-turmericGold/30">
              The Kamar-Taj Refectory
            </span>
            <h3 className="text-2xl font-serif font-black leading-tight">
              "Every Meal Accounted For. Every Resource Respected."
            </h3>
            <p className="text-xs text-white/80 leading-relaxed">
              MNNIT Allahabad hostel dining automation: meal timeline state machine, single-use 30s rotating QR check-in, vacation checkout ledger, and verified quality feedback.
            </p>
          </div>

          <div className="border-t border-white/20 pt-4 text-[11px] text-white/80 space-y-0.5 font-mono">
            <div>Team: <strong>Terror Code 404 (ID: 254)</strong></div>
            <div>Vansshiekaa (20259028), Ankur (20259001), Saksham (20259023)</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
