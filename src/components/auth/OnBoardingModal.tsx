import React, { useState } from 'react';
import { mnnitHostels, mnnitAcademicBranches } from '../../config/hostels';

interface OnboardingModalProps {
  userEmail: string;
  onSaveProfile: (data: { hostelId: string; hostelName: string; branch: string; room: string; year: string }) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ userEmail, onSaveProfile }) => {
  const [selectedHostelId, setSelectedHostelId] = useState(mnnitHostels[0].id);
  const [selectedBranch, setSelectedBranch] = useState(mnnitAcademicBranches[0]);
  const [roomNumber, setRoomNumber] = useState('B-314');
  const [studyYear, setStudyYear] = useState('2nd Year B.Tech');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hostelObj = mnnitHostels.find(h => h.id === selectedHostelId) || mnnitHostels[0];
    onSaveProfile({
      hostelId: hostelObj.id,
      hostelName: hostelObj.name,
      branch: selectedBranch,
      room: roomNumber.trim(),
      year: studyYear
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-riceWhite dark:bg-surface border-2 border-turmericGold rounded-3xl shadow-2xl p-6 text-charcoal dark:text-textPrimary space-y-4 animate-fadeIn">
        <div className="border-b border-softBorder dark:border-borderDark pb-3">
          <span className="text-[10px] font-bold text-terracotta uppercase tracking-wider block">First-Time Resident Setup</span>
          <h2 className="text-xl font-bold font-serif text-deepMaroon dark:text-primaryAccent mt-0.5">
            Select Your Hostel & Room
          </h2>
          <p className="text-xs text-mutedStone">Signed in as <strong>{userEmail}</strong>. Fill in your official residence details:</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold block mb-1">Assigned MNNIT Hostel (11 Hostels)</label>
            <select
              value={selectedHostelId}
              onChange={(e) => setSelectedHostelId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated font-medium"
            >
              {mnnitHostels.map((h) => (
                <option key={h.id} value={h.id}>{h.name} ({h.shortCode}) — {h.type.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold block mb-1">Room / Seat Number</label>
              <input
                type="text" required placeholder="e.g. B-314 (3-Seater) or A-208"
                value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated font-mono"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Year of Study</label>
              <select
                value={studyYear} onChange={(e) => setStudyYear(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated"
              >
                <option>1st Year B.Tech</option>
                <option>2nd Year B.Tech</option>
                <option>3rd Year B.Tech</option>
                <option>Final Year B.Tech</option>
                <option>Postgraduate / M.Tech</option>
                <option>PhD Research Scholar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold block mb-1">Academic Department / Branch</label>
            <select
              value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated"
            >
              {mnnitAcademicBranches.map((br, idx) => (
                <option key={idx} value={br}>{br}</option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-deepMaroon hover:bg-deepMaroon/90 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Confirm Residence & Enter Refectory →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
