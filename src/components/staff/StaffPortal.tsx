import React, { useState } from 'react';

interface StaffPortalProps {
  schedule: any[];
  onGateScan: (code: string) => any;
}

export const StaffPortal: React.FC<StaffPortalProps> = ({ schedule, onGateScan }) => {
  const [scanResult, setScanResult] = useState<any>(null);
  const lunch = schedule.find((s) => s.id === 'm-lu') || schedule[1];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-riceWhite dark:bg-surface border border-softBorder rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-deepMaroon dark:text-primaryAccent">SVH Mega Mess Gate 1 Scanner</h3>
              <p className="text-xs text-mutedStone">Active Session: {lunch.title}</p>
            </div>
            <span className="font-mono text-xs font-bold px-3 py-1 bg-leafGreen/10 text-leafGreen border border-leafGreen/30 rounded-full">
              {lunch.actualCheckIns} / {lunch.confirmedHeadcount} Checked In
            </span>
          </div>

          <div className="w-full h-60 bg-black rounded-2xl border-4 border-mutedStone/40 flex flex-col items-center justify-center relative">
            <div className="w-40 h-40 border-2 border-turmericGold relative flex items-center justify-center animate-pulse">
              <span className="text-[11px] text-white/70 font-mono">Scanner Viewfinder Active</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            <button
              onClick={() => setScanResult(onGateScan('VALID_PASS'))}
              className="px-3.5 py-2 bg-leafGreen text-white font-bold rounded-xl shadow-sm"
            >
              Scan Valid Pass (Success Chime)
            </button>
            <button
              onClick={() => setScanResult(onGateScan('WRONG_MESS_TANDON'))}
              className="px-3.5 py-2 bg-warningAmber text-white font-bold rounded-xl shadow-sm"
            >
              Scan Wrong-Mess Pass (Rejection Alert)
            </button>
            <button
              onClick={() => setScanResult(onGateScan('ALREADY_USED'))}
              className="px-3.5 py-2 bg-errorRed text-white font-bold rounded-xl shadow-sm"
            >
              Scan Already-Used Pass (Double-Dip Shield)
            </button>
          </div>
        </div>

        <div className="bg-riceWhite dark:bg-surface border border-softBorder rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-mutedStone mb-3">Redemption Telemetry</h4>
            {scanResult ? (
              <div
                className={`p-5 rounded-2xl border text-center ${
                  scanResult.code === 'SUCCESS'
                    ? 'bg-leafGreen/10 border-leafGreen text-leafGreen'
                    : scanResult.code === 'WRONG_MESS'
                    ? 'bg-warningAmber/15 border-warningAmber text-warningAmber'
                    : 'bg-errorRed/10 border-errorRed text-errorRed'
                }`}
              >
                <div className="text-3xl mb-1">{scanResult.code === 'SUCCESS' ? '✓' : '⚠️'}</div>
                <div className="font-bold font-mono text-base">{scanResult.code}</div>
                <p className="text-xs mt-1">{scanResult.message}</p>
                {scanResult.resident && <div className="mt-2 text-[11px] font-mono border-t pt-1 font-bold">{scanResult.resident}</div>}
              </div>
            ) : (
              <div className="p-8 text-center text-mutedStone text-xs border-2 border-dashed border-softBorder rounded-2xl">
                Ready for scanning. Click a test button on the left to verify token redemption.
              </div>
            )}
          </div>
          <div className="text-[11px] text-mutedStone border-t pt-3">
            Atomic conditional database updates active. Zero duplicate check-in guarantee.
          </div>
        </div>
      </div>

      {/* Thali Planner */}
      <div className="bg-riceWhite dark:bg-surface border border-softBorder rounded-3xl p-6 shadow-sm space-y-3">
        <h3 className="font-bold text-base text-deepMaroon">Thali Planner: Explainable Cooking Targets ({lunch.title})</h3>
        <p className="text-xs text-mutedStone">Confirmed Headcount: <strong>{lunch.confirmedHeadcount} students</strong> (+6.5% buffer)</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-warmIvory rounded-2xl border border-softBorder">
            <div className="font-bold">Dehradun Basmati Rice</div>
            <div className="text-2xl font-bold font-mono text-deepMaroon mt-1">129.4 kg</div>
            <div className="text-[10px] text-mutedStone mt-0.5">Formula: 810 × 150g + 6.5% buffer</div>
          </div>
          <div className="p-3.5 bg-warmIvory rounded-2xl border border-softBorder">
            <div className="font-bold">Dal Makhani (Slow Simmered)</div>
            <div className="text-2xl font-bold font-mono text-deepMaroon mt-1">155.3 Litres</div>
            <div className="text-[10px] text-mutedStone mt-0.5">Formula: 810 × 180ml + 6.5% buffer</div>
          </div>
          <div className="p-3.5 bg-warmIvory rounded-2xl border border-softBorder">
            <div className="font-bold">Fresh Tawa Roti</div>
            <div className="text-2xl font-bold font-mono text-deepMaroon mt-1">2,588 Pieces</div>
            <div className="text-[10px] text-mutedStone mt-0.5">Formula: 810 × 3 pcs + 6.5% buffer</div>
          </div>
        </div>
      </div>
    </div>
  );
};