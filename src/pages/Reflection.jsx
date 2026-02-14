import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckIn } from '../services/CheckInContext.jsx';

const MODES = [
  { id: 'vent', label: 'I need to vent' },
  { id: 'clarity', label: 'I need clarity' },
  { id: 'encouragement', label: 'I need encouragement' },
  { id: 'grounding', label: 'I need grounding' },
];

const QUESTIONS = {
  vent: [
    'What specifically feels heavy or frustrating right now?',
    'What would you like to be able to say aloud about this?',
  ],
  clarity: [
    'What is one small, concrete question you have about this situation?',
    'What information or viewpoint would help you feel less stuck?',
  ],
  encouragement: [
    'What is one small thing you have done recently that you can acknowledge?',
    'What would feel like a kind next step, however small?',
  ],
  grounding: [
    'Name three physical sensations you can notice in this moment.',
    'What is one breath practice or small action you can use right now?',
  ],
};

function buildMessage(entry) {
  if (!entry || !entry.mood || !entry.intensity) {
    return [
      'Thank you for taking a moment for yourself.',
      "It's okay if you are not sure how you feel yet.",
    ];
  }

  const { mood, intensity } = entry;
  const lines = [];

  lines.push('Thank you for taking a moment for yourself.');

  const isLow = intensity <= 2;
  const isHigh = intensity >= 4;

  if (mood === 'awful' || mood === 'low') {
    if (isHigh) {
      lines.push("It's okay to feel this way, especially when everything feels heavy.");
    } else {
      lines.push("It's okay to feel this way. Even small emotions deserve attention.");
    }
  } else if (mood === 'neutral') {
    lines.push('Feeling “just okay” is still a real and valid experience.');
  } else if (mood === 'good' || mood === 'great') {
    if (isHigh) {
      lines.push('It’s nice to notice moments that feel brighter. You are allowed to enjoy them.');
    } else {
      lines.push('Even gentle moments of ease are worth pausing for and appreciating.');
    }
  } else {
    lines.push("It's okay to feel this way.");
  }

  return lines;
}

function Reflection() {
  const navigate = useNavigate();
  const { entry } = useCheckIn();
  const [mode, setMode] = useState(null);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const messages = useMemo(() => buildMessage(entry), [entry]);

  const handleSaveReflection = async () => {
    if (!mode) return;
    setSaving(true);
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const payload = {
      entryId: entry?.id || null,
      mode,
      responses: {
        q1: answers[0] || '',
        q2: answers[1] || '',
      },
    };
    try {
      const res = await fetch(`${API_BASE}/submit-reflection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSaved(true);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to save reflection', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-5">
      <header className="space-y-2">
        <h2 className="text-lg font-semibold text-white">Reflection</h2>
        <p className="text-sm text-slate-300 max-w-xl">
          Take a brief moment to notice what this check-in shows you about how you are doing right now.
        </p>
      </header>

      <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm text-slate-200">
        {messages.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white">Guided reflection (optional)</h3>
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => { setMode(m.id); setSaved(false); }}
              className={`text-sm px-3 py-2 rounded-full transition ${mode === m.id ? 'bg-sky-500 text-white' : 'bg-white/4 text-slate-200 hover:bg-white/6'}`}>
              {m.label}
            </button>
          ))}
        </div>

        {mode && (
          <div className="mt-3 space-y-3">
            {QUESTIONS[mode].map((q, idx) => (
              <div key={q} className="space-y-1">
                <label className="text-xs text-slate-400">{q}</label>
                <textarea
                  rows={3}
                  value={answers[idx] || ''}
                  onChange={(e) => setAnswers((s) => ({ ...s, [idx]: e.target.value }))}
                  className="w-full rounded-md border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            ))}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveReflection}
                disabled={saving || saved}
                className="cta-button inline-flex items-center rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-sky-400 disabled:opacity-60"
              >
                {saving ? 'Saving...' : saved ? 'Saved' : 'Save reflection'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-sm text-slate-300 hover:text-white"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-sm shadow-sky-500/30 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          View Dashboard
        </button>
      </div>
    </section>
  );
}

export default Reflection;


