import React, { useState, useEffect } from 'react';
import { sound } from '../../lib/audio';

interface StudentPortalProps {
  currentUser: any;
  currentTime: Date;
  currentDay: string;
  rebateBalance: number;
  plateStreak: number;
  addIns: any[];
  onAddInSubmit: (item: any) => void;
  onAddInVote: (id: string) => void;
  feedbacks: any[];
  onFeedbackSubmit: (fb: any) => void;
  vacationPass: any;
  onApplyVacation: (pass: any) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentUser,
  currentTime,
  currentDay,
  rebateBalance,
  plateStreak,
  addIns,
  onAddInSubmit,
  onAddInVote,
  feedbacks,
  onFeedbackSubmit,
  vacationPass,
  onApplyVacation
}) => {
  const [activeTab, setActiveTab] = useState<'meals' | 'qr' | 'vacation' | 'addins' | 'feedback'>('meals');
  const [tokenSeconds, setTokenSeconds] = useState(30);

  // Vacation leave form state
  const [leaveDays, setLeaveDays] = useState(3);
  const [leaveReason, setLeaveReason] = useState('Home Visit (Family Gathering)');
  const [destinationCity, setDestinationCity] = useState('Lucknow, UP');
  const [emergencyPhone, setEmergencyPhone] = useState('9876543210');
  const [vacationMsg, setVacationMsg] = useState<string | null>(null);

  // Add-In state
  const [addInName, setAddInName] = useState('');

  // Verified Feedback state
  const [fbRating, setFbRating] = useState(5);
  const [fbComment, setFbComment] = useState('');

  // Dynamic 30s QR rotation
  useEffect(() => {
    const timer = setInterval(() => setTokenSeconds((s) => (s <= 1 ? 30 : s - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- BUG 2 FIX: PRECISE REAL-TIME MEAL TIMELINE ENGINE ---
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const totalMins = currentHours * 60 + currentMinutes;

  const getDynamicMealState = (type: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner') => {
    switch (type) {
      case 'Breakfast':
        // Cutoff: 06:00 (360m), Window: 07:30 to 09:30 (450m - 570m)
        if (totalMins < 360) return { state: 'OPEN', label: 'OPEN (Cutoff 06:00 AM)', isService: false };
        if (totalMins >= 360 && totalMins < 450) return { state: 'LOCKED', label: 'LOCKED (Prep in Progress)', isService: false };
        if (totalMins >= 450 && totalMins <= 570) return { state: 'SERVED', label: 'ACTIVE NOW (Service Ongoing)', isService: true };
        return { state: 'CLOSED', label: 'CLOSED (Service Ended)', isService: false };

      case 'Lunch':
        // Cutoff: 10:00 (600m), Window: 12:30 to 14:30 (750m - 870m)
        if (totalMins < 600) return { state: 'OPEN', label: 'OPEN (Cutoff 10:00 AM)', isService: false };
        if (totalMins >= 600 && totalMins < 750) return { state: 'LOCKED', label: 'LOCKED (Cooking in Kitchen)', isService: false };
        if (totalMins >= 750 && totalMins <= 870) return { state: 'SERVED', label: 'ACTIVE NOW (Service Ongoing)', isService: true };
        return { state: 'CLOSED', label: 'CLOSED (Service Ended)', isService: false };

      case 'Snacks':
        // Cutoff: 15:30 (930m), Window: 17:00 to 18:15 (1020m - 1095m)
        if (totalMins < 930) return { state: 'OPEN', label: 'OPEN (Cutoff 03:30 PM)', isService: false };
        if (totalMins >= 930 && totalMins < 1020) return { state: 'LOCKED', label: 'LOCKED (Prep)', isService: false };
        if (totalMins >= 1020 && totalMins <= 1095) return { state: 'SERVED', label: 'ACTIVE NOW (Service Ongoing)', isService: true };
        return { state: 'CLOSED', label: 'CLOSED (Service Ended)', isService: false };

      case 'Dinner':
        // Cutoff: 18:00 (1080m), Window: 19:45 to 21:45 (1185m - 1305m)
        if (totalMins < 1080) return { state: 'OPEN', label: 'OPEN (Cutoff 06:00 PM)', isService: false };
        if (totalMins >= 1080 && totalMins < 1185) return { state: 'LOCKED', label: 'LOCKED (Cooking)', isService: false };
        if (totalMins >= 1185 && totalMins <= 1305) return { state: 'SERVED', label: 'ACTIVE NOW (Service Ongoing)', isService: true };
        // At night (after 21:45 / 12:00 AM / 03:00 AM), Dinner is strictly CLOSED!
        return { state: 'CLOSED', label: 'CLOSED (Service Ended)', isService: false };
    }
  };

  const dynamicMeals = [
    { id: 'm-bf', type: 'Breakfast' as const, title: `${currentDay} Refectory Breakfast`, startTime: '07:30', endTime: '09:30', cutoff: '06:00', items: ['Stuffed Paneer Paratha (पनीर पराठा)', 'Fresh Curd (दही)', 'Adrak Chai (चाय)'], img: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80' },
    { id: 'm-lu', type: 'Lunch' as const, title: `${currentDay} Deluxe Thali Feast`, startTime: '12:30', endTime: '14:30', cutoff: '10:00', items: ['Dehradun Jeera Rice (जीरा राइस)', 'Dal Makhani (दाल मखनी)', 'Mix Veg Sabzi (सब्जी)', 'Tawa Roti', 'Fruit Custard'], img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80' },
    { id: 'm-sn', type: 'Snacks' as const, title: `${currentDay} Refreshment`, startTime: '17:00', endTime: '18:15', cutoff: '15:30', items: ['Samosa with Sweet & Green Chutney', 'Hot Filter Coffee (कॉफी)'], img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' },
    { id: 'm-di', type: 'Dinner' as const, title: `${currentDay} Special Dinner`, startTime: '19:45', endTime: '21:45', cutoff: '18:00', items: ['Paneer Butter Masala (पनीर बटर मसाला)', 'Arhar Dal Tadka', 'Ghee Phulka Roti', 'Warm Gulab Jamun (गुलाब जामुन)', 'Bournvita Milk'], img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80' }
  ];

  // Vacation apply handler
  const handleVacationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rebateCreditCalculated = leaveDays * 4 * 75; // 4 meals per day * ₹75
    onApplyVacation({
      id: `vac-${Date.now()}`,
      studentName: currentUser.name,
      room: currentUser.room,
      leaveDays,
      leaveReason,
      destinationCity,
      emergencyPhone,
      rebateCredit: rebateCreditCalculated,
      status: 'APPROVED', // Automatic rule-based approval for demonstration
      appliedAt: currentTime.toLocaleDateString()
    });
    setVacationMsg(`Vacation Leave Approved! ${leaveDays * 4} upcoming meals paused. ₹${rebateCreditCalculated} credited to your ledger.`);
    sound.playSuccess();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Resident Identity Banner */}
      <div className="bg-gradient-to-r from-deepMaroon to-[#531b25] text-riceWhite p-6 rounded-3xl shadow-lg border border-softBorder dark:border-borderDark flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-1 bg-turmericGold text-charcoal rounded-full uppercase tracking-wider">
              {currentUser.hostelName} • Room {currentUser.room}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-white/20 text-white rounded-full">
              {currentUser.year} • {currentUser.branch}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black mt-2">Namaste, {currentUser.name}</h1>
          <p className="text-xs text-white/80 mt-1">MNNIT Allahabad Refectory Ledger • Verified Resident</p>
        </div>

        <div className="flex gap-3">
          <div className="bg-black/30 backdrop-blur px-4 py-2 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] uppercase text-white/70 block">Campus Status</span>
            <span className={`text-xs font-bold font-mono ${vacationPass?.status === 'APPROVED' ? 'text-turmericGold' : 'text-leafGreen'}`}>
              {vacationPass?.status === 'APPROVED' ? '🟡 On Vacation Leave' : '🟢 Checked-In (Campus)'}
            </span>
          </div>
          <div className="bg-black/30 backdrop-blur px-4 py-2 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] uppercase text-white/70 block">Hostel Rebate</span>
            <span className="text-lg font-bold font-mono text-leafGreen">₹{rebateBalance}</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-softBorder dark:border-borderDark pb-2 text-xs font-semibold overflow-x-auto">
        <button onClick={() => setActiveTab('meals')} className={`px-4 py-2 rounded-xl cursor-pointer ${activeTab === 'meals' ? 'bg-deepMaroon text-white' : 'text-mutedStone hover:text-charcoal'}`}>
          🍽️ Today's Real-Time Meal Timeline
        </button>
        <button onClick={() => setActiveTab('qr')} className={`px-4 py-2 rounded-xl cursor-pointer ${activeTab === 'qr' ? 'bg-deepMaroon text-white' : 'text-mutedStone hover:text-charcoal'}`}>
          🛡️ 30s Rotating QR Pass
        </button>
        <button onClick={() => setActiveTab('vacation')} className={`px-4 py-2 rounded-xl cursor-pointer ${activeTab === 'vacation' ? 'bg-deepMaroon text-white' : 'text-mutedStone hover:text-charcoal'}`}>
          ✈️ Hostel Check-Out & Vacation Leave
        </button>
        <button onClick={() => setActiveTab('addins')} className={`px-4 py-2 rounded-xl cursor-pointer ${activeTab === 'addins' ? 'bg-deepMaroon text-white' : 'text-mutedStone hover:text-charcoal'}`}>
          💡 Add-In Recommendations ({addIns.length})
        </button>
        <button onClick={() => setActiveTab('feedback')} className={`px-4 py-2 rounded-xl cursor-pointer ${activeTab === 'feedback' ? 'bg-deepMaroon text-white' : 'text-mutedStone hover:text-charcoal'}`}>
          ⭐ Verified Quality Feedback
        </button>
      </div>

      {/* Tab 1: Real-time Dynamic Timeline (Fixing Bug 2) */}
      {activeTab === 'meals' && (
        <div className="space-y-4">
          <div className="p-3 bg-warmIvory dark:bg-surfaceElevated rounded-2xl border border-softBorder dark:border-borderDark text-xs flex justify-between items-center">
            <div>
              <span className="font-bold text-deepMaroon dark:text-primaryAccent">Real-time Refectory State:</span>
              <span className="text-mutedStone ml-1">Meal stages auto-transition based on authoritative campus clock ({currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}).</span>
            </div>
            <span className="font-mono text-xs font-bold text-turmericGold">Cycle: {currentDay}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {dynamicMeals.map((meal) => {
              const timeline = getDynamicMealState(meal.type);

              return (
                <div key={meal.id} className="bg-riceWhite dark:bg-surface border border-softBorder dark:border-borderDark rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="relative h-32">
                      <img src={meal.img} alt={meal.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-3.5">
                        <div className="text-white">
                          <span className="text-[9px] font-bold uppercase text-turmericGold block">{meal.type} • {meal.startTime} - {meal.endTime}</span>
                          <h3 className="font-bold text-sm leading-tight">{meal.title}</h3>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-2 text-xs">
                      <div className="space-y-1 text-mutedStone">
                        {meal.items.map((it, idx) => (
                          <div key={idx} className="text-charcoal dark:text-textPrimary">• {it}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-softBorder/60 dark:border-borderDark/60 flex justify-between items-center text-xs mt-2">
                    <div>
                      <span className="text-[10px] text-mutedStone block">Stage & Cutoff:</span>
                      <span className={`font-mono font-bold ${
                        timeline.state === 'SERVED' ? 'text-leafGreen' :
                        timeline.state === 'OPEN' ? 'text-charcoal dark:text-textPrimary' :
                        'text-mutedStone'
                      }`}>
                        {timeline.label}
                      </span>
                    </div>

                    <span className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                      timeline.state === 'SERVED' ? 'bg-leafGreen/15 text-leafGreen border border-leafGreen/30' :
                      timeline.state === 'OPEN' ? 'bg-deepMaroon text-white' :
                      'bg-gray-100 dark:bg-surfaceElevated text-gray-500'
                    }`}>
                      {timeline.state === 'SERVED' ? 'Dining Ongoing' : timeline.state === 'OPEN' ? 'Confirmed' : 'Closed'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: 30s Rotating Pass */}
      {activeTab === 'qr' && (
        <div className="max-w-md mx-auto bg-riceWhite dark:bg-surface border border-softBorder dark:border-borderDark rounded-3xl p-6 shadow-xl text-center space-y-3">
          <span className="text-[10px] font-bold text-turmericGold uppercase bg-turmericGold/10 px-3 py-1 rounded-full border border-turmericGold/30">
            Anti-Double Dipping Gate Credential
          </span>
          <h2 className="text-lg font-bold text-deepMaroon dark:text-primaryAccent">{currentUser.name}</h2>
          <p className="text-xs text-mutedStone">Roll: {currentUser.regNo} • Assigned: <strong>{currentUser.hostelName}</strong></p>

          <div className="my-4 p-4 bg-white rounded-2xl shadow-inner inline-block border-2 border-dashed border-gray-300">
            <div className="w-48 h-48 mx-auto bg-white flex flex-col justify-between p-2 border-4 border-black">
              <div className="flex justify-between">
                <div className="w-8 h-8 bg-black p-1"><div className="w-full h-full bg-white p-0.5"><div className="w-full h-full bg-black"></div></div></div>
                <div className="w-8 h-8 bg-black p-1"><div className="w-full h-full bg-white p-0.5"><div className="w-full h-full bg-black"></div></div></div>
              </div>
              <div className="font-mono text-[8px] text-black font-bold break-all p-1">
                HMAC_SHA256_{currentUser.regNo}_ROTATING_PASS_{tokenSeconds}
              </div>
              <div className="flex justify-between items-end">
                <div className="w-8 h-8 bg-black p-1"><div className="w-full h-full bg-white p-0.5"><div className="w-full h-full bg-black"></div></div></div>
                <div className="font-mono text-[8px] font-bold text-black border p-0.5">MNNIT</div>
              </div>
            </div>
          </div>

          <div className="text-xs font-mono font-bold text-deepMaroon dark:text-gold flex justify-center items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-turmericGold animate-ping"></span>
            Token rotates in: {tokenSeconds}s
          </div>
          <p className="text-[11px] text-mutedStone">Cryptographic single-use token. Screen recordings and screenshots will be blocked at the counter.</p>
        </div>
      )}

      {/* Tab 3: Hostel Check-in / Check-out & Vacation Module (Bug 5 Fix) */}
      {activeTab === 'vacation' && (
        <div className="space-y-4">
          <div className="bg-riceWhite dark:bg-surface border border-softBorder dark:border-borderDark rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold text-terracotta uppercase tracking-wider block">Hostel Residence Telemetry</span>
              <h3 className="font-bold text-lg text-deepMaroon dark:text-primaryAccent">Hostel Check-Out & Vacation Leave Engine</h3>
              <p className="text-xs text-mutedStone mt-0.5">
                Planning to leave campus? File your vacation gate-pass. All upcoming meals will be paused automatically and credited to your rebate ledger.
              </p>
            </div>

            {vacationMsg && (
              <div className="p-3 bg-leafGreen/15 border border-leafGreen text-leafGreen rounded-xl text-xs font-bold animate-fadeIn">
                ✓ {vacationMsg}
              </div>
            )}

            {vacationPass?.status === 'APPROVED' ? (
              <div className="p-4 bg-warmIvory dark:bg-surfaceElevated border-2 border-turmericGold rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-deepMaroon dark:text-gold">Active Outstation Gate Pass</span>
                  <span className="px-2 py-0.5 bg-turmericGold text-charcoal font-bold rounded">CHECKED OUT</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-mutedStone pt-1">
                  <div>Leave Duration: <strong>{vacationPass.leaveDays} Days</strong></div>
                  <div>Destination: <strong>{vacationPass.destinationCity}</strong></div>
                  <div>Emergency Contact: <strong>{vacationPass.emergencyPhone}</strong></div>
                  <div>Rebate Balance Credited: <strong className="text-leafGreen">+₹{vacationPass.rebateCredit}</strong></div>
                </div>
                <p className="text-[11px] text-mutedStone italic pt-1">Present this digital gate-pass at MNNIT Main Gate on departure.</p>
              </div>
            ) : (
              <form onSubmit={handleVacationSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1">Leave Duration (Days)</label>
                    <input
                      type="number" min="1" max="30" required value={leaveDays}
                      onChange={(e) => setLeaveDays(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated font-mono"
                    />
                    <span className="text-[10px] text-mutedStone mt-0.5 block">Estimated rebate credit: <strong>₹{leaveDays * 4 * 75}</strong></span>
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Destination City / State</label>
                    <input
                      type="text" required placeholder="e.g. Lucknow, Varanasi, Delhi" value={destinationCity}
                      onChange={(e) => setDestinationCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1">Parent / Guardian Emergency Phone</label>
                    <input
                      type="tel" required placeholder="10-digit mobile" value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Reason for Leave</label>
                    <input
                      type="text" required placeholder="e.g. Home Visit, Medical Leave, Conference" value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-deepMaroon hover:bg-deepMaroon/90 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all"
                >
                  Apply Vacation Leave & Pause Meals (Claim ₹{leaveDays * 4 * 75}) →
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Add-Ins */}
      {activeTab === 'addins' && (
        <div className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!addInName.trim()) return;
              onAddInSubmit({
                id: `adin-${Date.now()}`,
                slot: `${currentDay} Dinner`,
                name: addInName,
                type: 'ADD_EXTRA',
                handle: `Resident (${currentUser.hostelName})`,
                votes: 1,
                voted: true,
                status: 'SUBMITTED',
                note: 'Awaiting committee & supervisor review'
              });
              setAddInName('');
              sound.playSuccess();
            }}
            className="flex gap-2"
          >
            <input
              type="text" required placeholder="Propose a dish (e.g. Spiced Chhach or Fresh Cucumber Salad)..."
              value={addInName} onChange={(e) => setAddInName(e.target.value)}
              className="flex-1 text-xs p-2.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated"
            />
            <button type="submit" className="px-4 py-2.5 bg-deepMaroon text-white font-bold text-xs rounded-xl shadow-sm">
              + Propose Add-In
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addIns.map((ad) => (
              <div key={ad.id} className="p-4 bg-riceWhite dark:bg-surface border border-softBorder dark:border-borderDark rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-terracotta uppercase">{ad.slot} • {ad.type}</span>
                    <h4 className="font-bold text-sm text-charcoal dark:text-textPrimary">{ad.name}</h4>
                    <span className="text-[10px] text-mutedStone">By: {ad.handle}</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-leafGreen/15 text-leafGreen">{ad.status}</span>
                </div>
                <p className="text-mutedStone italic text-[11px]">⚙️ {ad.note}</p>
                <div className="pt-2 border-t border-softBorder dark:border-borderDark flex justify-between items-center font-mono">
                  <span>{ad.votes} resident votes</span>
                  <button
                    disabled={ad.voted}
                    onClick={() => onAddInVote(ad.id)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs ${ad.voted ? 'bg-gray-200 text-gray-500' : 'bg-deepMaroon text-white'}`}
                  >
                    {ad.voted ? '✓ Upvoted' : '▲ Upvote'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Verified Quality Feedback */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onFeedbackSubmit({
                id: `fb-${Date.now()}`,
                meal: `${currentDay} Deluxe Thali Feast`,
                rating: fbRating,
                comment: fbComment || 'Food was properly prepared.',
                author: `Verified Diner (${currentUser.room})`,
                time: 'Just now'
              });
              setFbComment('');
              sound.playSuccess();
            }}
            className="p-5 bg-riceWhite dark:bg-surface border border-softBorder dark:border-borderDark rounded-2xl space-y-3"
          >
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-deepMaroon dark:text-primaryAccent">Verified Diner Quality Feedback</h3>
              <span className="px-2 py-0.5 bg-leafGreen/10 border border-leafGreen/30 text-leafGreen text-[10px] font-bold rounded">Gate Verified</span>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Rating: {fbRating} Stars</label>
                <input type="range" min="1" max="5" value={fbRating} onChange={(e) => setFbRating(Number(e.target.value))} className="w-full accent-deepMaroon" />
              </div>
              <textarea
                rows={2}
                placeholder="Share feedback on Dal Makhani taste, hot-holding temperature, or cleanliness..."
                value={fbComment}
                onChange={(e) => setFbComment(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated text-xs"
              />
              <button type="submit" className="px-4 py-2 bg-deepMaroon text-white font-bold rounded-xl shadow-sm">
                Submit Verified Feedback
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {feedbacks.map((f) => (
              <div key={f.id} className="p-3.5 bg-riceWhite dark:bg-surface border border-softBorder dark:border-borderDark rounded-xl text-xs space-y-1">
                <div className="flex justify-between font-bold">
                  <span>{f.meal}</span>
                  <span className="text-turmericGold">★ {f.rating}/5</span>
                </div>
                <p className="text-mutedStone">"{f.comment}"</p>
                <span className="text-[10px] text-mutedStone block">{f.author} • {f.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
