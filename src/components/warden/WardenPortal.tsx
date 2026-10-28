import React from 'react';
import { sound } from '../../lib/audio';

interface WardenPortalProps {
  currentUser: any;
  requests: any[];
  onRequestAction: (id: string, status: string) => void;
  publicActions: any[];
}

export const WardenPortal: React.FC<WardenPortalProps> = ({
  currentUser,
  requests,
  onRequestAction,
  publicActions
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-riceWhite dark:bg-surface border border-softBorder rounded-3xl p-6 shadow-sm">
        <span className="text-[10px] font-bold text-terracotta uppercase tracking-wider">Hostel Warden Administration</span>
        <h2 className="text-xl font-bold font-serif text-deepMaroon dark:text-primaryAccent mt-1">
          {currentUser.name} • {currentUser.hostelName} Scope
        </h2>
        <p className="text-xs text-mutedStone">
          Approve medical diets (Soft Khichdi), extended leave opt-outs, and review refectory quality.
        </p>
      </div>

      {/* Pending Approvals */}
      <div className="bg-riceWhite dark:bg-surface border border-softBorder rounded-3xl p-6 shadow-sm space-y-3">
        <h3 className="font-bold text-base text-deepMaroon">Pending Resident Requests ({requests.length})</h3>
        <div className="space-y-2">
          {requests.map((r) => (
            <div key={r.id} className="p-4 bg-warmIvory rounded-2xl border border-softBorder flex justify-between items-center text-xs">
              <div>
                <span className="font-bold block text-sm">{r.student}</span>
                <span className="text-mutedStone block">{r.branch} • Room {r.room}</span>
                <span className="text-terracotta font-semibold mt-0.5 block">{r.type}</span>
              </div>
              {r.status === 'PENDING' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onRequestAction(r.id, 'APPROVED');
                      sound.playSuccess();
                    }}
                    className="px-3.5 py-1.5 bg-leafGreen text-white font-bold rounded-xl shadow-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      onRequestAction(r.id, 'REJECTED');
                      sound.playError();
                    }}
                    className="px-3.5 py-1.5 bg-errorRed text-white font-bold rounded-xl shadow-sm"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    r.status === 'APPROVED' ? 'bg-leafGreen/15 text-leafGreen' : 'bg-red-100 text-errorRed'
                  }`}
                >
                  {r.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* You Said We Did Public Board */}
      <div className="bg-riceWhite dark:bg-surface border border-softBorder rounded-3xl p-6 shadow-sm space-y-3">
        <h3 className="font-bold text-base text-deepMaroon">"You Said, We Did" Closed Action Board</h3>
        <div className="space-y-2">
          {publicActions.map((act) => (
            <div key={act.id} className="p-4 bg-warmIvory rounded-2xl border border-softBorder text-xs space-y-1">
              <div className="flex justify-between font-bold">
                <span>{act.issue}</span>
                <span className="text-leafGreen">{act.status}</span>
              </div>
              <p className="text-mutedStone">Action Taken: {act.action}</p>
              <span className="text-[10px] text-mutedStone font-mono block">
                Resolved based on {act.votes} verified student reports
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};