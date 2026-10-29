import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { AuthPage } from './components/auth/AuthPage';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { Header } from './components/shared/Header';
import { RasoiSahayak } from './components/assistant/RasoiSahayak';
import { StudentPortal } from './components/student/StudentPortal';
import { StaffPortal } from './components/staff/StaffPortal';
import { WardenPortal } from './components/warden/WardenPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { sound } from './lib/audio';

const defaultPersonas = [
  { id: 'u-1', name: 'Vansshiekaa Singh', regNo: '20259028', branch: 'Materials Engineering', hostelName: 'Sarojini Naidu Girls Hostel (SNGH)', hostelId: 'h-sngh', room: 'A-208', year: '2nd Year B.Tech', role: 'STUDENT' },
  { id: 'u-2', name: 'Ankur', regNo: '20259001', branch: 'Materials Engineering', hostelName: 'Swami Vivekananda Hostel (SVH)', hostelId: 'h-svh', room: 'B-314', year: '2nd Year B.Tech', role: 'STUDENT' },
  { id: 'u-3', name: 'Chef Rameshwar Dayal', regNo: 'STAFF-102', branch: 'Refectory Operations', hostelName: 'SVH Mega Mess Refectory', hostelId: 'h-svh', room: 'Kitchen Station 1', year: 'Staff', role: 'MESS_STAFF' },
  { id: 'u-4', name: 'Dr. Manish Gupta', regNo: 'FAC-W02', branch: 'Applied Mechanics', hostelName: 'Hostel Office (SVH)', hostelId: 'h-svh', room: 'Warden Residence', year: 'Faculty', role: 'HOSTEL_WARDEN' },
  { id: 'u-5', name: 'Prof. R.K. Srivastava', regNo: 'FAC-CW1', branch: 'Civil Engineering', hostelName: 'Council of Wardens', hostelId: 'all', room: 'Admin Block', year: 'Chief Warden', role: 'ADMIN' }
];

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(defaultPersonas[0]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activePortal, setActivePortal] = useState<string>('STUDENT');

  // Theme Sync
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('messwise_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('messwise_theme', theme);
  }, [theme]);

  // Real-time dynamic clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[currentTime.getDay()];

  // Vacation Pass & Feedback States
  const [vacationPass, setVacationPass] = useState<any>(null);
  const [rebateBalance, setRebateBalance] = useState(675);
  const [plateStreak, setPlateStreak] = useState(18);

  const [addIns, setAddIns] = useState([
    { id: 'adin-1', slot: `${currentDay} Lunch`, name: 'Cold Spiced Mattha (Buttermilk)', type: 'ADD_EXTRA', handle: 'Resident (SVH)', votes: 94, voted: false, status: 'APPROVED_FOR_TRIAL', note: 'Chef Rameshwar: 60L batch capacity cleared.' },
    { id: 'adin-2', slot: `${currentDay} Dinner`, name: 'Less Oil in Paneer Gravy', type: 'IMPROVE', handle: 'Resident (SNGH)', votes: 52, voted: false, status: 'SHORTLISTED', note: 'Committee requested low-cholesterol recipe trial.' }
  ]);

  const [feedbacks, setFeedbacks] = useState([
    { id: 'fb-1', meal: `${currentDay} Deluxe Thali Feast`, rating: 5, comment: 'Dal Makhani was properly heated at 72°C. Zero queue at Counter 1.', author: 'Verified Diner (SNGH A-208)', time: '13:05 IST' }
  ]);

  const [wardenRequests, setWardenRequests] = useState([
    { id: 'wr-1', student: 'Saksham Kumar Singh (20259023)', branch: 'Materials Engineering', type: 'Medical Diet (Soft Khichdi)', room: 'SVH A-104', status: 'PENDING' },
    { id: 'wr-2', student: 'Ankur (20259001)', branch: 'Materials Engineering', type: 'Weekend Leave (Away Mode)', room: 'SVH B-314', status: 'PENDING' }
  ]);

  const [publicActions] = useState([
    { id: 'pa-1', issue: 'Cold Rice at Gate 2 Counter', votes: 34, action: 'Commissioned two heated bain-marie hot-wells maintaining 68°C.', status: 'COMPLETED' },
    { id: 'pa-2', issue: 'Demand for Dalia at Breakfast', votes: 58, action: 'Approved trial add-in for weekly Monday rotation.', status: 'IN_TRIAL' }
  ]);

  // Auth Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        const saved = localStorage.getItem(`messwise_profile_${user.uid}`);
        if (saved) {
          const profile = JSON.parse(saved);
          setCurrentUser(profile);
          setActivePortal(profile.role || 'STUDENT');
          setShowOnboarding(false);
        } else {
          setCurrentUser({
            uid: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'MNNIT Resident',
            email: user.email || '',
            role: 'STUDENT',
            hostelName: '',
            hostelId: '',
            room: '',
            year: '',
            branch: ''
          });
          setShowOnboarding(true);
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveOnboarding = (profileData: any) => {
    const updated = { ...currentUser, ...profileData };
    setCurrentUser(updated);
    setActivePortal(updated.role);
    if (firebaseUser) {
      localStorage.setItem(`messwise_profile_${firebaseUser.uid}`, JSON.stringify(updated));
    }
    setShowOnboarding(false);
    sound.playSuccess();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      sound.playWarning();
    } catch (e) {
      console.error(e);
    }
  };

  const handleGateScan = (code: string) => {
    if (code.includes('WRONG_MESS')) {
      sound.playWarning();
      return { code: 'WRONG_MESS', message: 'Access Denied: Resident registered at PD Tandon Mess, not SVH.', resident: 'Priyanshu Patel (PD Tandon)' };
    }
    if (code.includes('ALREADY_USED')) {
      sound.playWarning();
      return { code: 'ALREADY_USED', message: 'Pass Already Scanned at 12:44 PM! Double-dipping blocked.', resident: 'Ankur (SVH B-314)' };
    }
    sound.playSuccess();
    return { code: 'SUCCESS', message: 'Pass Verified: Lunch Thali Redeemed', resident: `${currentUser.name} (${currentUser.hostelName})` };
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-warmIvory dark:bg-appDark flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-deepMaroon border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-deepMaroon dark:text-primaryAccent">Connecting to MNNIT Telemetry...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!firebaseUser) {
    return (
      <AuthPage
        onBypassDemoLogin={(demoProfile) => {
          setCurrentUser(demoProfile);
          setFirebaseUser({ email: demoProfile.email } as any);
          setActivePortal(demoProfile.role);
          setShowOnboarding(false);
          sound.playSuccess();
        }}
      />
    );
  }

  // First-time Onboarding
  if (showOnboarding) {
    return <OnboardingModal userEmail={firebaseUser.email || ''} onSaveProfile={handleSaveOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-warmIvory dark:bg-appDark text-charcoal dark:text-textPrimary flex flex-col font-sans transition-colors duration-200">
      <Header
        currentUser={currentUser}
        onSwitchUser={(id: string) => {
          const p = defaultPersonas.find((x) => x.id === id);
          if (p) {
            setCurrentUser(p);
            setActivePortal(p.role);
            sound.playSuccess();
          }
        }}
        personas={defaultPersonas}
        currentTime={currentTime}
        currentDay={currentDay}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        onLogout={handleLogout}
        activePortal={activePortal}
        onSelectPortal={(portal: string) => {
          setActivePortal(portal);
          sound.playSuccess();
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {activePortal === 'STUDENT' && (
          <StudentPortal
            currentUser={currentUser}
            currentTime={currentTime}
            currentDay={currentDay}
            rebateBalance={rebateBalance}
            plateStreak={plateStreak}
            addIns={addIns}
            onAddInSubmit={(item: any) => {
              setAddIns((prev) => [item, ...prev]);
              sound.playSuccess();
            }}
            onAddInVote={(id: string) => {
              setAddIns((prev) => prev.map((a) => (a.id === id ? { ...a, votes: a.votes + 1, voted: true } : a)));
              sound.playSuccess();
            }}
            feedbacks={feedbacks}
            onFeedbackSubmit={(fb: any) => {
              setFeedbacks((prev) => [fb, ...prev]);
              sound.playSuccess();
            }}
            vacationPass={vacationPass}
            onApplyVacation={(pass: any) => {
              setVacationPass(pass);
              setRebateBalance((r) => r + pass.rebateCredit);
            }}
          />
        )}

        {activePortal === 'MESS_STAFF' && (
          <StaffPortal onGateScan={handleGateScan} />
        )}

        {activePortal === 'HOSTEL_WARDEN' && (
          <WardenPortal
            currentUser={currentUser}
            requests={wardenRequests}
            onRequestAction={(id: string, status: string) => {
              setWardenRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
            }}
            publicActions={publicActions}
          />
        )}

        {activePortal === 'ADMIN' && <AdminPortal />}
      </main>

      <RasoiSahayak currentDay={currentDay} onCancelMeal={() => {}} />

      <footer className="border-t border-softBorder dark:border-borderDark py-4 text-center text-[11px] text-mutedStone space-y-0.5">
        <div>MessWise: The Kamar-Taj Refectory • MNNIT Allahabad Pilot</div>
        <div>
          Webster 2026 • <strong>Team Terror Code 404 (ID: 254)</strong>: Vansshiekaa Singh (20259028), Ankur (20259001), Saksham Kumar Singh (20259023).
        </div>
      </footer>
    </div>
  );
}
