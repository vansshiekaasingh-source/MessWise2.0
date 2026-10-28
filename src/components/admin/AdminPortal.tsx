import React from 'react';
import { mnnitHostels } from '../../config/hostels';

export const AdminPortal: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-riceWhite dark:bg-surface border border-softBorder rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold font-serif text-deepMaroon dark:text-primaryAccent">Refectory Operations & Waste Analytics</h2>
        <p className="text-xs text-mutedStone">Campus-wide telemetry, serving standard policies, and hostel registry management.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-riceWhite dark:bg-surface border border-softBorder rounded-2xl">
          <span className="text-[10px] text-mutedStone uppercase font-bold block">Active Hostels</span>
          <span className="text-2xl font-bold font-mono text-deepMaroon">11 Units</span>
          <span className="text-[10px] text-leafGreen block mt-0.5">8 Boys • 3 Girls</span>
        </div>
        <div className="p-4 bg-riceWhite dark:bg-surface border border-softBorder rounded-2xl">
          <span className="text-[10px] text-mutedStone uppercase font-bold block">Waste Prevented (Est)</span>
          <span className="text-2xl font-bold font-mono text-leafGreen">142.5 kg</span>
          <span className="text-[10px] text-mutedStone block mt-0.5">From timely opt-outs</span>
        </div>
        <div className="p-4 bg-riceWhite dark:bg-surface border border-softBorder rounded-2xl">
          <span className="text-[10px] text-mutedStone uppercase font-bold block">CO₂e Averted</span>
          <span className="text-2xl font-bold font-mono text-terracotta">92.6 kg</span>
          <span className="text-[10px] text-mutedStone block mt-0.5">0.65 kg CO₂e / kg factor</span>
        </div>
        <div className="p-4 bg-riceWhite dark:bg-surface border border-softBorder rounded-2xl">
          <span className="text-[10px] text-mutedStone uppercase font-bold block">Virtual Water Saved</span>
          <span className="text-2xl font-bold font-mono text-blue-600">59,850 L</span>
          <span className="text-[10px] text-mutedStone block mt-0.5">420 L / kg factor</span>
        </div>
      </div>

      {/* MNNIT Hostel Registry Table */}
      <div className="bg-riceWhite dark:bg-surface border border-softBorder rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-softBorder">
          <h3 className="font-bold text-sm text-deepMaroon">MNNIT Allahabad Hostel & Refectory Mapping</h3>
          <p className="text-xs text-mutedStone">All 11 campus hostels mapped to refectory kitchens:</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warmIvory text-mutedStone uppercase text-[10px]">
              <tr>
                <th className="p-3">Hostel Name</th>
                <th className="p-3">Code</th>
                <th className="p-3">Type</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Pattern / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-softBorder">
              {mnnitHostels.map((h) => (
                <tr key={h.id} className="hover:bg-warmIvory/30">
                  <td className="p-3 font-semibold">{h.name}</td>
                  <td className="p-3 font-mono">{h.shortCode}</td>
                  <td className="p-3 uppercase font-bold text-terracotta">{h.type}</td>
                  <td className="p-3 font-mono">{h.capacity} residents</td>
                  <td className="p-3 text-mutedStone text-[11px]">{h.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};