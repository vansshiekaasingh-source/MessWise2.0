import React, { useState, useEffect } from 'react';
import { sound } from '../../lib/audio';

interface StudentPortalProps {
  currentUser: any;
  schedule: any[];
  bookings: Record<string, any>;
  onToggleBooking: (id: string) => void;
  rebateBalance: number;
  plateStreak: number;
  addIns: any[];
  onAddInSubmit: (item: any) => void;
  onAddInVote: (id: string) => void;
  feedbacks: any[];
  onFeedbackSubmit: (fb: any) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentUser,
  schedule,
  bookings,
  onToggleBooking,
  rebateBalance,
  plateStreak,
  addIns,
  onAddInSubmit,
  onAddInVote,
  feedbacks,
  onFeedbackSubmit
}) => {
  const [activeTab, setActiveTab] = useState<'meals' | 'qr' | 'addins' | 'feedback'>('meals');
  const [tokenSeconds, setTokenSeconds] = useState(30);
  const [addInName, setAddInName] = useState('');
  const [fbRating, setFbRating] = useState(5);
  const [fbComment, setFbComment] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTokenSeconds((s) => (s <= 1 ? 30 : s - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-deepMaroon to-[#531b25] text-riceWhite p-6 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-[10px] font-bold px-2.5 py-1 bg-turmericGold text-charcoal rounded-full uppercase tracking-wider">
            {currentUser.hostelName} • Room {currentUser.room}
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black mt-2">Namaste, {currentUser.name}</h1>
          <p className="text-xs text-white/80 mt-1">{currentUser.branch} • MNNIT Allahabad Refectory</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-black/30 backdrop-blur px-4 py-2 rounded-xl border border-white/10 text-center">
            <span className="text-[10px] uppercase text-white/70 block">Pledge Streak</span>
            <span className="text-lg font-bold font-mono text-turmericGold">🔥 {plateStreak} Days</span>
          </div>
          <div className="bg-black/30 backdrop-blur px-4 py-2 rounded-xl border border-white/10 text-center">
            <span className="text-[10px] uppercase text-white/70 block">Hostel Rebate</span>
            <span className="text-lg font-bold font-mono text-leafGreen">₹{rebateBalance}</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-softBorder pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('meals')}
          className={`px-4 py-2 rounded-xl ${activeTab === 'meals' ? 'bg-deepMaroon text-white' : 'text-mutedStone'}`}
        >
          🍽️ Today's Meals & Booking
        </button>
        <button
          onClick={() => setActiveTab('qr')}
          className={`px-4 py-2 rounded-xl ${activeTab === 'qr' ? 'bg-deepMaroon text-white' : 'text-mutedStone'}`}
        >
          🛡️ Live Rotating QR Pass
        </button>
        <button
          onClick={() => setActiveTab('addins')}
          className={`px-4 py-2 rounded-xl ${activeTab === 'addins' ? 'bg-deepMaroon text-white' : 'text-mutedStone'}`}
        >
          💡 Add-In Recommendations ({addIns.length})
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded-xl ${activeTab === 'feedback' ? 'bg-deepMaroon text-white' : 'text-mutedStone'}`}
        >
          ⭐ Verified Diner Feedback
        </button>
      </div>

      {/* 1. Meals */}
      {activeTab === 'meals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {schedule.map((meal) => {
            const b = bookings[meal.id];
            const isLocked = meal.state !== 'OPEN';

            return (
              <div key={meal.id} className="bg-riceWhite dark:bg-surface border border-softBorder rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <div className="relative h-32">
                    <img src={meal.img} alt={meal.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <div className="text-white">
                        <span className="text-[9px] font-bold uppercase text-turmericGold block">{meal.type} • {meal.startTime} - {meal.endTime}</span>
                        <h3 className="font-bold text-sm">{meal.title}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-1 text-xs text-mutedStone">
                    {meal.items.map((it: string, idx: number) => (
                      <div key={idx} className="text-charcoal dark:text-textPrimary">• {it}</div>
                    ))}
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-softBorder/60 flex justify-between items-center text-xs mt-2">
                  <div>
                    <span className="text-[10px] text-mutedStone block">Cutoff:</span>
                    <span className="font-mono font-bold">{isLocked ? 'Cutoff Locked' : `${meal.cutoff} IST`}</span>
                  </div>

                  {b?.status === 'CONSUMED' ? (
                    <span className="text-leafGreen font-bold flex items-center gap-1">✓ Redeemed at Gate</span>
                  ) : (
                    <button
                      disabled={isLocked}
                      onClick={() => onToggleBooking(meal.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                        isLocked
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : b?.status === 'CONFIRMED'
                          ? 'border border-errorRed text-errorRed hover:bg-errorRed hover:text-white'
                          : 'bg-deepMaroon text-white hover:bg-deepMaroon/90 shadow-sm'
                      }`}
                    >
                      {isLocked ? 'Locked' : b?.status === 'CONFIRMED' ? 'Cancel & Rebate ₹75' : 'Confirm Plate'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. QR Pass */}
      {activeTab === 'qr' && (
        <div className="max-w-md mx-auto bg-riceWhite dark:bg-surface border border-softBorder rounded-3xl p-6 shadow-xl text-center space-y-3">
          <span className="text-[10px] font-bold text-turmericGold uppercase bg-turmericGold/10 px-3 py-1 rounded-full border border-turmericGold/30">
            Anti-Double Dipping Credential
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
                HMAC_SHA256_{currentUser.regNo}_ROTATING_{tokenSeconds}
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
          <p className="text-[11px] text-mutedStone">Auto-rotating HMAC token. Screenshots or duplicates fail immediately.</p>
        </div>
      )}

      {/* 3. Add-Ins */}
      {activeTab === 'addins' && (
        <div className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!addInName.trim()) return;
              onAddInSubmit({
                id: `adin-${Date.now()}`,
                slot: 'Today Dinner',
                name: addInName,
                type: 'ADD_EXTRA',
                handle: `Resident (${currentUser.hostelName})`,
                votes: 1,
                voted: true,
                status: 'SUBMITTED',
                note: 'Under committee review'
              });
              setAddInName('');
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              required
              placeholder="Propose an add-in (e.g. Spiced Chhach or Fresh Salad)..."
              value={addInName}
              onChange={(e) => setAddInName(e.target.value)}
              className="flex-1 text-xs p-2.5 rounded-xl border border-softBorder bg-warmIvory"
            />
            <button type="submit" className="px-4 py-2.5 bg-deepMaroon text-white font-bold text-xs rounded-xl shadow-sm">
              + Propose Add-In
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addIns.map((ad) => (
              <div key={ad.id} className="p-4 bg-riceWhite dark:bg-surface border border-softBorder rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-terracotta uppercase">{ad.slot} • {ad.type}</span>
                    <h4 className="font-bold text-sm text-charcoal dark:text-textPrimary">{ad.name}</h4>
                    <span className="text-[10px] text-mutedStone">By: {ad.handle}</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-leafGreen/15 text-leafGreen">{ad.status}</span>
                </div>
                <p className="text-mutedStone italic text-[11px]">⚙️ {ad.note}</p>
                <div className="pt-2 border-t border-softBorder flex justify-between items-center font-mono">
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

      {/* 4. Verified Feedback */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onFeedbackSubmit({
                id: `fb-${Date.now()}`,
                meal: 'Deluxe Thali Feast (Lunch)',
                rating: fbRating,
                comment: fbComment || 'Food was properly prepared.',
                author: `Verified Diner (${currentUser.room})`,
                time: 'Just now'
              });
              setFbComment('');
            }}
            className="p-5 bg-riceWhite dark:bg-surface border border-softBorder rounded-2xl space-y-3"
          >
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-deepMaroon dark:text-primaryAccent">Verified Diner Quality Feedback</h3>
              <span className="px-2 py-0.5 bg-leafGreen/10 border border-leafGreen/30 text-leafGreen text-[10px] font-bold rounded">Gate Redeemed</span>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Rating: {fbRating} Stars</label>
                <input type="range" min="1" max="5" value={fbRating} onChange={(e) => setFbRating(Number(e.target.value))} className="w-full accent-deepMaroon" />
              </div>
              <textarea
                rows={2}
                placeholder="Rate Dal Makhani taste, hot-holding temperature, or hygiene..."
                value={fbComment}
                onChange={(e) => setFbComment(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-softBorder bg-warmIvory text-xs"
              />
              <button type="submit" className="px-4 py-2 bg-deepMaroon text-white font-bold rounded-xl shadow-sm">
                Submit Verified Feedback
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {feedbacks.map((f) => (
              <div key={f.id} className="p-3.5 bg-riceWhite dark:bg-surface border border-softBorder rounded-xl text-xs space-y-1">
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