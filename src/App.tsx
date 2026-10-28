import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { AuthPage } from './components/auth/AuthPage';
import { Header } from './components/shared/Header';
import { RasoiSahayak } from './components/assistant/RasoiSahayak';
import { StudentPortal } from './components/student/StudentPortal';
import { StaffPortal } from './components/staff/StaffPortal';
import { WardenPortal } from './components/warden/WardenPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { sound } from './lib/audio';

const defaultPersonas = [
  { id: 'u-1', name: 'Vansshiekaa Singh', regNo: '20259028', branch: 'Materials Engineering', hostelName: 'Sarojini Naidu Girls Hostel', room: 'A-208', role: 'STUDENT' },
  { id: 'u-2', name: 'Ankur', regNo: '20259001', branch: 'Materials Engineering', hostelName: 'Swami Vivekananda Hostel (SVH)', room: 'B-314', role: 'STUDENT' },
  { id: 'u-3', name: 'Chef Rameshwar Dayal', regNo: 'STAFF-102', branch: 'Refectory Operations', hostelName: 'SVH Mega Mess Refectory', room: 'Kitchen Station 1', role: 'MESS_STAFF' },
  { id: 'u-4', name: 'Dr. Manish Gupta', regNo: 'FAC-W02', branch: 'Applied Mechanics', hostelName: 'Hostel Office (SVH)', room: 'Warden Residence', role: 'HOSTEL_WARDEN' },
  { id: 'u-5', name: 'Prof. R.K. Srivastava', regNo: 'FAC-CW1', branch: 'Civil Engineering', hostelName: 'Council of Wardens', room: 'Admin Block', role: 'ADMIN' }
];

export default function App() {
  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(defaultPersonas[0]);
  const [theme, setTheme] = useState('light');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        // Sync user profile data from Firebase
        setCurrentUser((prev) => ({
          ...prev,
          name: user.displayName || user.email?.split('@')[0] || prev.name,
          email: user.email || ''
        }));
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time clock timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[currentTime.getDay()];

  const [schedule, setSchedule] = useState([
    { id: 'm-bf', type: 'Breakfast', title: `${currentDay} Refectory Breakfast`, state: 'SERVED', startTime: '07:30', endTime: '09:30', cutoff: '06:00', img: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80', items: ['Stuffed Paneer Paratha (पनीर पराठा)', 'Fresh Curd (दही)', 'Adrak Chai (चाय)'], confirmedHeadcount: 780, actualCheckIns: 742, bufferPct: 6.0 },
    { id: 'm-lu', type: 'Lunch', title: `${currentDay} Deluxe Thali Feast`, state: 'LOCKED', startTime: '12:30', endTime: '14:30', cutoff: '10:00', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', items: ['Dehradun Jeera Rice (जीरा राइस)', 'Dal Makhani (दाल मखनी)', 'Mix Veg Sabzi (मिक्स वेज)', 'Tawa Roti (तवा रोटी)', 'Fruit Custard (कस्टर्ड)'], confirmedHeadcount: 810, actualCheckIns: 418, bufferPct: 6.5 },
    { id: 'm-sn', type: 'Snacks', title: `${currentDay} Refreshment`, state: 'OPEN', startTime: '17:00', endTime: '18:15', cutoff: '15:30', isMessOff: false, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', items: ['Samosa with Sweet & Green Chutney (समोसा व चटनी)', 'Hot Filter Coffee (कॉफी)'], confirmedHeadcount: 690, actualCheckIns: 0, bufferPct: 5.0 },
    { id: 'm-di', type: 'Dinner', title: `${currentDay} Special Dinner`, state: 'OPEN', startTime: '19:45', endTime: '21:45', cutoff: '18:00', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80', items: ['Paneer Butter Masala (पनीर बटर मसाला)', 'Arhar Dal Tadka (अरहर दाल)', 'Ghee Phulka Roti', 'Warm Gulab Jamun (गुलाब जामुन)', 'Bournvita Milk'], confirmedHeadcount: 760, actualCheckIns: 0, bufferPct: 5.5 }
  ]);

  const [bookings, setBookings] = useState<Record<string, any>>({
    'm-bf': { status: 'CONSUMED', verifiedAtGate: true },
    'm-lu': { status: 'CONSUMED', verifiedAtGate: true },
    'm-sn': { status: 'CONFIRMED', verifiedAtGate: false },
    'm-di': { status: 'CONFIRMED', verifiedAtGate: false }
  });

  const [rebateBalance, setRebateBalance] = useState(675);
  const [plateStreak, setPlateStreak] = useState(18);

  const [addIns, setAddIns] = useState([
    { id: 'adin-1', slot: `${currentDay} Lunch`, name: 'Cold Spiced Mattha (Buttermilk)', type: 'ADD_EXTRA', handle: 'Resident (SVH)', votes: 94, voted: false, status: 'APPROVED_FOR_TRIAL', note: 'Chef Rameshwar: 60L batch capacity cleared.' },
    { id: 'adin-2', slot: `${currentDay} Dinner`, name: 'Less Oil in Paneer Butter Masala', type: 'IMPROVE', handle: 'Resident (SNGH)', votes: 52, voted: false, status: 'SHORTLISTED', note: 'Committee requested low-cholesterol recipe trial.' }
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

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      sound.playWarning();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleToggleBooking = (mealId: string) => {
    const meal = schedule.find((m) => m.id === mealId);
    if (!meal || meal.state !== 'OPEN') {
      sound.playWarning();
      return;
    }
    const b = bookings[mealId];
    if (b?.status === 'CONFIRMED') {
      setBookings((prev) => ({ ...prev, [mealId]: { status: 'CANCELLED', verifiedAtGate: false } }));
      setRebateBalance((r) => r + 75);
      setPlateStreak((s) => s + 1);
      sound.playSuccess();
    } else {
      setBookings((prev) => ({ ...prev, [mealId]: { status: 'CONFIRMED', verifiedAtGate: false } }));
      setRebateBalance((r) => Math.max(0, r - 75));
      sound.playSuccess();
    }
  };

  const handleGateScan = (code: string) => {
    if (code.includes('WRONG_MESS')) {
      sound.playWarning();
      return { code: 'WRONG_MESS', message: 'Access Denied: Resident belongs to PD Tandon Mess, not SVH.', resident: 'Priyanshu Patel (PD Tandon)' };
    }
    if (code.includes('ALREADY_USED')) {
      sound.playWarning();
      return { code: 'ALREADY_USED', message: 'Pass Already Scanned at 12:44 PM! Double-dipping blocked.', resident: 'Ankur (SVH B-314)' };
    }
    sound.playSuccess();
    setSchedule((prev) => prev.map((m) => (m.id === 'm-lu' ? { ...m, actualCheckIns: m.actualCheckIns + 1 } : m)));
    setBookings((prev) => ({ ...prev, 'm-lu': { status: 'CONSUMED', verifiedAtGate: true } }));
    return { code: 'SUCCESS', message: 'Pass Verified: Lunch Thali Redeemed', resident: 'Vansshiekaa Singh (20259028) • SNGH' };
  };

  // Loading state while Firebase restores session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-warmIvory flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-deepMaroon border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-deepMaroon">Connecting to Firebase Auth...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show Auth Screen
  if (!firebaseUser) {
    return <AuthPage />;
  }

  // Once authenticated, redirect to the Dashboard
  return (
    <div className="min-h-screen bg-warmIvory dark:bg-appDark text-charcoal dark:text-textPrimary flex flex-col font-sans">
      <Header
        currentUser={currentUser}
        onSwitchUser={(id: string) => {
          const p = defaultPersonas.find((x) => x.id === id);
          if (p) {
            setCurrentUser(p);
            sound.playSuccess();
          }
        }}
        personas={defaultPersonas}
        currentTime={currentTime}
        currentDay={currentDay}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {currentUser.role === 'STUDENT' && (
          <StudentPortal
            currentUser={currentUser}
            schedule={schedule}
            bookings={bookings}
            onToggleBooking={handleToggleBooking}
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
          />
        )}

        {currentUser.role === 'MESS_STAFF' && (
          <StaffPortal schedule={schedule} onGateScan={handleGateScan} />
        )}

        {currentUser.role === 'HOSTEL_WARDEN' && (
          <WardenPortal
            currentUser={currentUser}
            requests={wardenRequests}
            onRequestAction={(id: string, status: string) => {
              setWardenRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
            }}
            publicActions={publicActions}
          />
        )}

        {currentUser.role === 'ADMIN' && <AdminPortal />}
      </main>

      <RasoiSahayak currentDay={currentDay} onCancelMeal={handleToggleBooking} />

      <footer className="border-t border-softBorder py-4 text-center text-[11px] text-mutedStone space-y-0.5">
        <div>MessWise: The Kamar-Taj Refectory • Fully Residential Campus Refectory Platform</div>
        <div>
          Webster 2026 • <strong>Team Terror Code 404 (Team ID: 254)</strong>: Vansshiekaa Singh (20259028), Ankur (20259001), Saksham Kumar Singh (20259023) — Materials Engineering, MNNIT Allahabad.
        </div>
      </footer>
    </div>
  );
}