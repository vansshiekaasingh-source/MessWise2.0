import React, { useState } from 'react';
import { sound } from '../../lib/audio';

interface RasoiSahayakProps {
  currentDay: string;
  onCancelMeal: (mealId: string) => void;
}

export const RasoiSahayak: React.FC<RasoiSahayakProps> = ({ currentDay, onCancelMeal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [pendingAction, setPendingAction] = useState<{ mealId: string; title: string } | null>(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Namaste! I am Rasoi Sahayak (रसोई सहायक), grounded in MNNIT's verified timetable. Ask me about today's ${currentDay} menu, sweets, or cancel a meal before cutoff!`
    }
  ]);

  const handleSend = (text?: string) => {
    const q = text || query;
    if (!q.trim()) return;

    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: q }]);
    setQuery('');

    setTimeout(() => {
      const lower = q.toLowerCase();
      let botReply = '';
      let action = null;

      if (lower.includes('dinner') || lower.includes('रात') || lower.includes('sweet') || lower.includes('मीठा')) {
        botReply = "Tonight at MNNIT Refectory: Paneer Butter Masala, Arhar Dal Tadka, Ghee Phulka & Warm Gulab Jamun (गुलाब जामुन). Bournvita milk after 21:00.";
      } else if (lower.includes('lunch') || lower.includes('दोपहर')) {
        botReply = `Today's ${currentDay} Lunch Thali features Dal Makhani, Dehradun Jeera Rice, Tawa Roti & Chilled Fruit Custard.`;
      } else if (lower.includes('cancel') || lower.includes('skip') || lower.includes('रद्द')) {
        botReply = "Tonight's Dinner cutoff closes at 18:00 (6:00 PM). Would you like me to cancel your plate and credit ₹75 to your rebate balance?";
        action = { mealId: 'm-di', title: "Cancel Tonight's Dinner & Claim ₹75 Rebate" };
      } else {
        botReply = "I am synced with the MNNIT Allahabad Refectory ledger. Dal Makhani and Paneer Butter Masala are scheduled today. How else can I assist you?";
      }

      setPendingAction(action);
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: botReply }]);
    }, 350);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-5 py-3.5 bg-gradient-to-r from-deepMaroon to-terracotta text-white font-bold text-xs rounded-full shadow-2xl border-2 border-turmericGold flex items-center gap-2.5 hover:scale-105 transition-all glow-pulse cursor-pointer"
        >
          <span className="text-lg">👨‍🍳</span>
          <span>Rasoi Sahayak (रसोई सहायक)</span>
          <span className="w-2.5 h-2.5 rounded-full bg-turmericGold animate-ping"></span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-riceWhite dark:bg-surface border-2 border-turmericGold rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fadeIn">
          <div className="bg-deepMaroon text-white p-4 flex justify-between items-center border-b border-turmericGold/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-turmericGold text-deepMaroon flex items-center justify-center font-bold text-sm">
                र
              </div>
              <div>
                <h3 className="font-bold text-xs leading-none">Rasoi Sahayak • रसोई सहायक</h3>
                <p className="text-[10px] text-white/70 mt-0.5">MNNIT AI Refectory Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-turmericGold text-base">✕</button>
          </div>

          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-warmIvory/40 dark:bg-surfaceElevated/50">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-deepMaroon text-white rounded-br-none'
                      : 'bg-white dark:bg-surface border border-softBorder dark:border-borderDark text-charcoal dark:text-textPrimary rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {pendingAction && (
              <div className="p-3 bg-white dark:bg-surface border-2 border-terracotta rounded-xl shadow-md space-y-2">
                <span className="text-[10px] font-bold text-terracotta uppercase tracking-wider block">⚡ Action Card</span>
                <h4 className="font-bold text-xs">{pendingAction.title}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onCancelMeal(pendingAction.mealId);
                      setPendingAction(null);
                      sound.playSuccess();
                    }}
                    className="flex-1 py-1.5 bg-leafGreen text-white font-bold rounded-lg text-xs"
                  >
                    ✓ Confirm & Save Food
                  </button>
                  <button onClick={() => setPendingAction(null)} className="px-3 py-1.5 border border-softBorder rounded-lg text-xs">
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-2 bg-riceWhite dark:bg-surface border-t border-softBorder flex gap-1.5 overflow-x-auto text-[10px]">
            {["What's for dinner tonight?", "आज लंच में क्या है?", "Cancel tonight's dinner"].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 bg-warmIvory dark:bg-surfaceElevated border border-softBorder rounded-full whitespace-nowrap hover:border-terracotta"
              >
                {chip}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-riceWhite dark:bg-surface border-t border-softBorder flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask in English or हिन्दी..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-xs p-2 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated"
            />
            <button type="submit" className="px-3.5 py-2 bg-deepMaroon text-white text-xs font-bold rounded-xl hover:bg-deepMaroon/90">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};