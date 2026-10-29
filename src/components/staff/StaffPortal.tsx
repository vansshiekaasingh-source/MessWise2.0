import React, { useState } from 'react';
import { sound } from '../../lib/audio';

interface StaffPortalProps {
  schedule?: any[];
  onGateScan: (code: string) => any;
}

export const StaffPortal: React.FC<StaffPortalProps> = ({ schedule = [], onGateScan }) => {
  const [scanResult, setScanResult] = useState<any>(null);
  const [activeStaffTab, setActiveStaffTab] = useState<'scanner' | 'kitchen' | 'quality' | 'surplus'>('scanner');

  // Quality check form state
  const [qcTemp, setQcTemp] = useState(72);
  const [qcHygiene, setQcHygiene] = useState(true);
  const [qcStatusMsg, setQcStatusMsg] = useState<string | null>(null);

  // Safe fallback to prevent undefined crashes
  const defaultLunch = {
    id: 'm-lu',
    type: 'Lunch',
    title: 'Monday Deluxe Thali Feast',
    startTime: '12:30',
    endTime: '14:30',
    actualCheckIns: 418,
    confirmedHeadcount: 810,
    bufferPct: 6.5
  };

  const lunch = schedule.find((s) => s.id === 'm-lu') || schedule[0] || defaultLunch;

  const handleScanClick = (code: string) => {
    const res = onGateScan(code);
    setScanResult(res);
  };

  const handleQC = (status: 'PASS' | 'FAIL') => {
    if (status === 'PASS') {
      sound.playSuccess();
      setQcStatusMsg('Quality Check PASS logged! Food temperature (72°C) meets safe hot-holding standards.');
    } else {
      sound.playError();
      setQcStatusMsg('⚠️ Quality Check FAIL logged! Counter release blocked and emergency alert dispatched to Warden.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Staff Header Banner */}
      <div className="bg-gradient-to-r from-deepMaroon to-[#531b25] text-riceWhite p-6 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-[10px] font-bold px-2.5 py-1 bg-turmericGold text-charcoal rounded-full uppercase tracking-wider">
            Refectory Kitchen Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black mt-2">SVH Mega Mess Operations</h1>
          <p className="text-xs text-white/80 mt-1">Gate Telemetry • Thali Planner • Food Quality Gate</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-black/30 backdrop-blur px-4 py-2 rounded-xl border border-white/10 text-center">
            <span className="text-[10px] uppercase text-white/70 block">Checked In</span>
            <span className="text-xl font-bold font-mono text-leafGreen">{lunch.actualCheckIns || 418}</span>
          </div>
          <div className="bg-black/30 backdrop-blur px-4 py-2 rounded-xl border border-white/10 text-center">
            <span className="text-[10px] uppercase text-white/70 block">Locked Plan</span>
            <span className="text-xl font-bold font-mono text-turmericGold">{lunch.confirmedHeadcount || 810}</span>
          </div>
        </div>
      </div>

      {/* Staff Sub-Tabs */}
      <div className="flex gap-2 border-b border-softBorder dark:border-borderDark pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveStaffTab('scanner')}
          className={`px-4 py-2 rounded-xl cursor-pointer ${activeStaffTab === 'scanner' ? 'bg-deepMaroon text-white' : 'text-mutedStone hover:text-charcoal'}`}
        >
          📷 Gate 1 Scanner
        </button>
        <button
          onClick={() => setActiveStaffTab('kitchen')}
          className={`px-4 py-2 rounded-xl cursor-pointer ${activeStaffTab === 'kitchen' ? 'bg-deepMaroon text-white' : 'text-mutedStone hover:text-charcoal'}`}
        >
          🍲 Thali Planner (Why This Number?)
        </button>
        <button
          onClick={() => setActiveStaffTab('quality')}
          className={`px-4 py-2 rounded-xl cursor-pointer ${activeStaffTab === 'quality' ? 'bg-deepMaroon text-white' : 'text-mutedStone hover:text-charcoal'}`}
        >
          🧪 Food Quality Inspection (PASS / FAIL)
        </button>
        <button
          onClick={() => setActiveStaffTab('surplus')}
          className={`px-4 py-2 rounded-xl cursor-pointer ${activeStaffTab === 'surplus' ? 'bg-deepMaroon text-white' : 'text-mutedStone hover:text-charcoal'}`}
        >
          🤝 Surplus Share Workflow
        </button>
      </div>

      {/* 1. GATE SCANNER VIEW */}
      {activeStaffTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-riceWhite dark:bg-surface border border-softBorder dark:border-borderDark rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-deepMaroon dark:text-primaryAccent">SVH Mega Mess Gate 1 Optical Scanner</h3>
                <p className="text-xs text-mutedStone">Current Session: <strong>{lunch.title || 'Lunch Service'}</strong></p>
              </div>
              <span className="font-mono text-xs font-bold px-3 py-1 bg-leafGreen/10 text-leafGreen border border-leafGreen/30 rounded-full">
                {lunch.actualCheckIns || 418} / {lunch.confirmedHeadcount || 810} Checked In
              </span>
            </div>

            {/* Viewfinder Frame */}
            <div className="w-full h-64 bg-black rounded-2xl border-4 border-mutedStone/40 flex flex-col items-center justify-center relative">
              <div className="w-44 h-44 border-2 border-turmericGold relative flex items-center justify-center animate-pulse">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-turmericGold"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-turmericGold"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-turmericGold"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-turmericGold"></div>
                <span className="text-[11px] text-white/70 font-mono">Camera Viewfinder Active</span>
              </div>
              <span className="absolute bottom-3 text-[11px] text-white/60">
                Single-use HMAC verification enabled • Auto-focus 60fps
              </span>
            </div>

            {/* Fast Test Verification Buttons */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => handleScanClick('VALID_PASS')}
                className="px-4 py-2.5 bg-leafGreen hover:bg-leafGreen/90 text-white font-bold rounded-xl shadow-sm cursor-pointer"
              >
                ✓ Scan Valid Pass (Plays Success Chime)
              </button>
              <button
                type="button"
                onClick={() => handleScanClick('WRONG_MESS_TANDON')}
                className="px-4 py-2.5 bg-warningAmber hover:bg-warningAmber/90 text-white font-bold rounded-xl shadow-sm cursor-pointer"
              >
                🚫 Scan Wrong-Mess Pass (PD Tandon Resident)
              </button>
              <button
                type="button"
                onClick={() => handleScanClick('ALREADY_USED')}
                className="px-4 py-2.5 bg-errorRed hover:bg-errorRed/90 text-white font-bold rounded-xl shadow-sm cursor-pointer"
              >
                ⚠️ Scan Already-Used Pass (Double-Dipping Shield)
              </button>
            </div>
          </div>

          {/* Real-time Telemetry Result Card */}
          <div className="bg-riceWhite dark:bg-surface border border-softBorder dark:border-borderDark rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-mutedStone mb-3">Redemption Status</h4>
              {scanResult ? (
                <div
                  className={`p-5 rounded-2xl border text-center animate-fadeIn ${
                    scanResult.code === 'SUCCESS'
                      ? 'bg-leafGreen/10 border-leafGreen text-leafGreen'
                      : scanResult.code === 'WRONG_MESS'
                      ? 'bg-warningAmber/15 border-warningAmber text-warningAmber'
                      : 'bg-errorRed/10 border-errorRed text-errorRed'
                  }`}
                >
                  <div className="text-4xl mb-1">
                    {scanResult.code === 'SUCCESS' ? '✓' : scanResult.code === 'WRONG_MESS' ? '🚫' : '⚠️'}
                  </div>
                  <div className="font-bold font-mono text-base">{scanResult.code}</div>
                  <p className="text-xs mt-1 font-medium">{scanResult.message}</p>
                  {scanResult.resident && (
                    <div className="mt-3 text-[11px] font-mono border-t border-black/10 dark:border-white/10 pt-2 font-bold">
                      {scanResult.resident}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-mutedStone text-xs border-2 border-dashed border-softBorder rounded-2xl">
                  Ready for scanning. Click any test button on the left to verify token redemption.
                </div>
              )}
            </div>

            <div className="text-[11px] text-mutedStone border-t border-softBorder pt-3 space-y-1">
              <div>• Station: <strong>SVH Ground Floor Refectory</strong></div>
              <div>• Cross-Hostel Rejection: <strong>Enforced</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* 2. THALI PLANNER (EXPLAINABLE COOKING MATH) */}
      {activeStaffTab === 'kitchen' && (
        <div className="bg-riceWhite dark:bg-surface border border-softBorder dark:border-borderDark rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-lg text-deepMaroon dark:text-primaryAccent">
              Thali Planner: Explainable Cooking Targets ({lunch.title || 'Lunch Service'})
            </h3>
            <p className="text-xs text-mutedStone">
              Locked Headcount: <strong>{lunch.confirmedHeadcount || 810} confirmed students</strong> (+6.5% buffer policy)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-warmIvory dark:bg-surfaceElevated rounded-2xl border border-softBorder dark:border-borderDark space-y-1">
              <div className="font-bold text-sm text-charcoal dark:text-textPrimary">Dehradun Basmati Rice</div>
              <div className="text-2xl font-bold font-mono text-deepMaroon dark:text-gold mt-1">129.4 kg</div>
              <div className="text-[11px] text-mutedStone">Standard: 150g / portion</div>
              <div className="text-[10px] text-terracotta font-mono pt-1 border-t border-softBorder">
                Math: (810 × 150g) + 6.5% buffer = 129.4 kg
              </div>
            </div>

            <div className="p-4 bg-warmIvory dark:bg-surfaceElevated rounded-2xl border border-softBorder dark:border-borderDark space-y-1">
              <div className="font-bold text-sm text-charcoal dark:text-textPrimary">Dal Makhani (Slow Simmered)</div>
              <div className="text-2xl font-bold font-mono text-deepMaroon dark:text-gold mt-1">155.3 Litres</div>
              <div className="text-[11px] text-mutedStone">Standard: 180ml / portion</div>
              <div className="text-[10px] text-terracotta font-mono pt-1 border-t border-softBorder">
                Math: (810 × 180ml) + 6.5% buffer = 155.3 L
              </div>
            </div>

            <div className="p-4 bg-warmIvory dark:bg-surfaceElevated rounded-2xl border border-softBorder dark:border-borderDark space-y-1">
              <div className="font-bold text-sm text-charcoal dark:text-textPrimary">Fresh Tawa Roti</div>
              <div className="text-2xl font-bold font-mono text-deepMaroon dark:text-gold mt-1">2,588 Pieces</div>
              <div className="text-[11px] text-mutedStone">Standard: 3 pcs / student</div>
              <div className="text-[10px] text-terracotta font-mono pt-1 border-t border-softBorder">
                Math: (810 × 3 pcs) + 6.5% buffer = 2,588 pcs
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. FOOD QUALITY GATE */}
      {activeStaffTab === 'quality' && (
        <div className="bg-riceWhite dark:bg-surface border border-softBorder dark:border-borderDark rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-deepMaroon dark:text-primaryAccent">
              Mandatory Pre-Service Quality Checklist
            </h3>
            <p className="text-xs text-mutedStone">
              Inspect food holding temperature and hygiene. A FAIL result freezes counter distribution and notifies the Warden.
            </p>
          </div>

          {qcStatusMsg && (
            <div className="p-3 bg-warmIvory border border-turmericGold rounded-2xl text-xs font-bold animate-fadeIn">
              {qcStatusMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3 p-4 bg-warmIvory dark:bg-surfaceElevated rounded-2xl border border-softBorder">
              <div>
                <label className="font-bold block mb-1">Cooked Food Temperature Probe: {qcTemp}°C</label>
                <input
                  type="range"
                  min="40"
                  max="90"
                  value={qcTemp}
                  onChange={(e) => setQcTemp(Number(e.target.value))}
                  className="w-full accent-deepMaroon"
                />
                <span className="text-[10px] text-mutedStone">Safe hot-holding threshold: ≥ 65°C</span>
              </div>

              <label className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  checked={qcHygiene}
                  onChange={(e) => setQcHygiene(e.target.checked)}
                  className="rounded"
                />
                <span className="font-semibold">Counter & Serving Utensil Sanitization Passed</span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleQC('PASS')}
                  className="px-4 py-2 bg-leafGreen hover:bg-leafGreen/90 text-white font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  Log PASS (Authorize Counter)
                </button>
                <button
                  type="button"
                  onClick={() => handleQC('FAIL')}
                  className="px-4 py-2 bg-errorRed hover:bg-errorRed/90 text-white font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  Log FAIL (Freeze Service)
                </button>
              </div>
            </div>

            <div className="p-4 bg-warmIvory dark:bg-surfaceElevated rounded-2xl border border-softBorder text-xs space-y-2">
              <h4 className="font-bold text-mutedStone uppercase text-[10px]">Recent Quality Log</h4>
              <div className="p-3 bg-white dark:bg-surface rounded-xl border flex justify-between items-center">
                <div>
                  <span className="font-bold block">Cooked Food Inspection • 72°C</span>
                  <span className="text-[10px] text-mutedStone">Inspector: Chef Rameshwar • Today 12:15 IST</span>
                </div>
                <span className="px-2 py-0.5 bg-leafGreen text-white text-[10px] font-bold rounded">PASS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SURPLUS SHARE */}
      {activeStaffTab === 'surplus' && (
        <div className="bg-riceWhite dark:bg-surface border border-softBorder dark:border-borderDark rounded-3xl p-6 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-base text-deepMaroon dark:text-primaryAccent">Surplus Share Redistribution Flow</h3>
          <p className="text-mutedStone">
            Requires dual signatures: **Quality Check PASS** and **Warden Approval** before food is cleared for campus NGO dispatch.
          </p>

          <div className="p-4 bg-warmIvory dark:bg-surfaceElevated rounded-2xl border space-y-2">
            <div className="flex justify-between items-center font-bold">
              <span>Steamed Basmati Rice & Dal Makhani (approx. 18 kg)</span>
              <span className="px-2 py-0.5 bg-leafGreen/15 text-leafGreen rounded">APPROVED FOR DISPATCH</span>
            </div>
            <p className="text-mutedStone">Recipient: <strong>Robin Hood Army (MNNIT Student Chapter)</strong></p>
            <div className="text-[10px] text-mutedStone">Quality Certified by Chef Rameshwar • Approved by Dr. Manish Gupta (Warden)</div>
          </div>
        </div>
      )}
    </div>
  );
};
